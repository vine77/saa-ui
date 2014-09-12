#!/usr/bin/env node

var RSVP = require('rsvp');
var request = require('./utils/request');
var getJSON = require('./utils/get-json');
var postJSON = require('./utils/post-json');
var putJSON = require('./utils/put-json');
var cqToGi = require('./utils/cq-to-gi');
var getVersion = require('./utils/get-version');

// Configuration variables
var gates = require('./config.json').gates;
var proxy = require('./config.json').proxy;
var dryrun = require('./config.json').dryrun || false;

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
var clearquestUrl = 'https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1/query/49124594?oslc.pageSize=1000&oslc.properties=cq:Customer_Support_ID,cq:Gate_To';
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

// Push unsynced records from ClearQuest to GitHub
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
    return !parseInt(record['cq:Customer_Support_ID']);
  });

  console.log('There are ' + unsyncedRecords.length + ' unsynced records out of ' + currentGateRecords.length + ' open front-end CQ issues (gated to current phase).');

  unsyncedRecords.forEach(function(unsyncedRecord) {
    // Get full ClearQuest record
    var clearquestRecordUrl = unsyncedRecord['rdf:about'];
    if (!clearquestRecordUrl) return;
    console.log(unsyncedRecord['oslc:shortTitle'] + ': ' + clearquestRecordUrl);
    var clearquestPromise = getJSON({url: clearquestRecordUrl, headers: clearquestHeaders}).then(function(clearquestRecord) {
      // Get attachments
      var attachmentsUrl = clearquestRecord['cq:Attachments'][0]['rdf:resource'];
      return getJSON({url: attachmentsUrl, headers: clearquestAttachmentHeaders}).then(function(attachmentsResponse) {
        var attachmentResults = attachmentsResponse['oslc_cm:results'];
        if (attachmentResults.length >= 1) {
          var attachmentPromises = [];
          clearquestRecord.attachments = attachmentResults.map(function(result) {
            return {url: result['rdf:resource'], filename: result['oslc_cm:label']};
          });
          console.log(unsyncedRecord['oslc:shortTitle'] + ' has attachments');
          console.log(clearquestRecord.attachments);
        } else {
          console.log(unsyncedRecord['oslc:shortTitle'] + ' had no attachments.');
        }
        return clearquestRecord;
      });
    }).then(function(clearquestRecord) {
      if (!!dryrun) return;  // Don't push anything to GitHub if a dry-run
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
