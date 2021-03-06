#!/usr/bin/env node

var RSVP = require('rsvp');
var request = require('./utils/request');
var getJSON = require('./utils/get-json');
var postJSON = require('./utils/post-json');
var putJSON = require('./utils/put-json');
var cqToGi = require('./utils/cq-to-gi');
var getVersion = require('./utils/get-version');

// Configuration variables
var users = require('./config.json').users;
var gates = require('./config.json').gates;
var proxy = require('./config.json').proxy;
var isDryRun = require('./config.json').dryrun;
var downloadAttachments = require('./config.json').attachments;

// Authentication credentials
if (process.argv.length < 6) {
  console.log('Input your ClearQuest username, ClearQuest password, GitHub username, and GitHub password as command line arguments (in single quotes)');
  return process.exit(1);
}
var clearquestUsername = process.argv[2];
var clearquestPassword = process.argv[3];
var githubUsername = process.argv[4];
var githubPassword = process.argv[5];

// URLs and headers
var clearquestUrl = 'https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1/query/49124594?oslc.pageSize=1000&oslc.properties=cq:Customer_Support_ID,cq:Gate_To,dcterms:contributor';
var clearquestHeaders = {
  'OSLC-Core-Version': '2.0',
  'Authorization': 'Basic ' + new Buffer(clearquestUsername + ':' + clearquestPassword).toString('base64'),
  'Content-Type': 'application/json; charset=utf-8;'
};
var clearquestAttachmentHeaders = {
  'OSLC-Core-Version': '1.0',
  'Authorization': 'Basic ' + new Buffer(clearquestUsername + ':' + clearquestPassword).toString('base64'),
  'Content-Type': 'application/json; charset=utf-8;'
};
var githubHeaders = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Node.js HTTP Client',
  'Authorization': 'Basic ' + new Buffer(githubUsername + ':' + githubPassword).toString('base64')
};

console.log('Pulling issues from ClearQuest...');

// Get unsynced records from ClearQuest
getJSON({url: clearquestUrl, headers: clearquestHeaders}).then(function(clearquestResponse) {
  var cqRecords = clearquestResponse['rdfs:member'];
  var clearquestPromises = [];

  var currentGateRecords = cqRecords.filter(function(record) {
    var isMatchForGate = false;
    gates.forEach(function(gate) {
      if (record['cq:Gate_To'].indexOf(gate) !== -1) isMatchForGate = true;
    });
    return isMatchForGate;
  });

  var unsyncedRecords = currentGateRecords.filter(function(record) {
    if (parseInt(record['cq:Customer_Support_ID'])) return false;  // Exclude issues already synced
    // Include if username matches that in config file (and user's "sync" flag is true)
    var cqOwner = record['dcterms:contributor']['rdf:resource'].split('/').pop();
    var includeRecord = false;
    users.forEach(function(user) {
      if (user.sync && user.clearquest.toLowerCase() === cqOwner.toLowerCase()) includeRecord = true;
    });
    return includeRecord;
  });
  console.log('There are ' + unsyncedRecords.length + ' unsynced records out of ' + currentGateRecords.length + ' open front-end CQ issues (gated to current phase).');

  unsyncedRecords.forEach(function(unsyncedRecord) {
    // Get full ClearQuest record
    var clearquestRecordUrl = unsyncedRecord['rdf:about'];
    if (!clearquestRecordUrl) return;
    console.log(unsyncedRecord['oslc:shortTitle'] + ': ' + clearquestRecordUrl);
    var clearquestPromise = getJSON({url: clearquestRecordUrl, headers: clearquestHeaders}).then(function(clearquestRecord) {
      if (!downloadAttachments || isDryRun) return clearquestRecord;  // Don't download attachments if dryrun is true attachments is false
      // Get attachments
      var attachmentsUrl = clearquestRecord['cq:Attachments'][0]['rdf:resource'];
      return getJSON({url: attachmentsUrl, headers: clearquestAttachmentHeaders}).then(function(attachmentsResponse) {
        var attachmentResults = attachmentsResponse['oslc_cm:results'];
        if (attachmentResults.length >= 1) {
          var attachmentPromises = [];
          console.log(unsyncedRecord['oslc:shortTitle'] + ' has attachments');
          clearquestRecord.attachments = attachmentResults.map(function(result) {
            return {url: result['rdf:resource'], filename: result['oslc_cm:label']};
          });
          console.log(clearquestRecord.attachments);
          clearquestRecord.attachments.forEach(function(attachment) {
            // Download each attachment
            var attachmentPromise = request({url: attachment.url}).then(function(attachmentResponse) {
              // Upload attachment to Dropbox
              var accessToken = 'sPxCBS90CYMAAAAAAAA9pXvit290_cyiNnTex7fMgvvHHP-pAI2QILWVzY_tpQ0P';
              var dropboxFilename = unsyncedRecord['oslc:shortTitle'] + '-' + attachment.filename;
              var dropboxUrl = 'https://api-content.dropbox.com/1/files_put/auto/' + dropboxFilename + '?access_token=' + accessToken + '&overwrite=false';
              return request({
                method: 'PUT',
                url: dropboxUrl,
                body: attachmentResponse,
                proxy: proxy
              }).then(function(dropboxResponse) {
                console.log('Dropbox upload succeeded');
                console.log(dropboxResponse);
              }).catch(function() {
                console.log('Dropbox upload failed');
              });
            }).then(function(uploadResponse) {
              // Get shared Dropbox link for uploaded attachment
              return postJSON({url: 'https://api.dropbox.com/1/shares/auto' + uploadResponse.path});
            }).then(function(sharedResponse) {
              var sharedUrl = sharedResponse.url;
              console.log('Shared URL:', sharedUrl);
            });
            attachmentPromises.push(attachmentPromise);
          });
          return RSVP.all(attachmentPromises);
        } else {
          console.log(unsyncedRecord['oslc:shortTitle'] + ' has no attachments.');
        }
        return clearquestRecord;
      });
    }).then(function(clearquestRecord) {
      if (isDryRun) return;  // Don't push anything to GitHub if a dry-run
      // Create new issue on GitHub
      console.log('Creating GitHub issue for ' + clearquestRecord['cq:id'] + '...');
      return postJSON({
        url: 'https://api.github.com/repos/vine77/saa-ui/issues',
        body: cqToGi(clearquestRecord),
        headers: githubHeaders,
        proxy: proxy
      }).then(function(githubIssue) {
        console.log('Successfully created GitHub issue #' + githubIssue.number + ' for ' + clearquestRecord['cq:id']);
        // Update ClearQuest with GitHub issue number
        return putJSON({
          url: clearquestRecordUrl + '?oslc.properties=cq:Customer_Support_ID&rcm.action=Modify',
          body: {
            'cq:Customer_Support_ID': githubIssue.number
          },
          headers: clearquestHeaders
        }).then(function() {
          console.log('Successfully marked ' + clearquestRecord['cq:id'] + ' as being associated with GitHub issue #' + githubIssue.number);
        }).catch(function(error) {
          console.log('Failed to mark ' + clearquestRecord['cq:id'] + ' as being associated with GitHub issue #' + githubIssue.number);
          console.log(error);
        });
      }).catch(function(error) {
        console.log('Failed to create issue on GitHub for ' + clearquestRecord['cq:id']);
        console.log(error);
      });
    });
    clearquestPromises.push(clearquestPromise);
  });
  return RSVP.all(clearquestPromises);
}).catch(function(error) {
  console.log('An error occurred while attempting to get ClearQuest issues. ' + error.status + ' ' + error.statusText);
  console.log(error);
  process.exit(1);
});
