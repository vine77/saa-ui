#!/usr/bin/env node

var RSVP = require('rsvp');
var getJSON = require('./utils/get-json');
var postJSON = require('./utils/post-json');
var putJSON = require('./utils/put-json');
var cqToGi = require('./utils/cq-to-gi');
var getVersion = require('./utils/get-version');

// Configuration variables
var PROXY = 'http://proxy.jf.intel.com:911';
var gates = require('./config.json').gates;

// Authentication credentials
if (process.argv.length < 6) {
  return console.log('Input your ClearQuest username, ClearQuest password, GitHub username, and GitHub password as command line arguments');
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
  'Content-Type': 'application/json; charset=utf-8'
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
  var promises = [];
  var unsyncedRecords = cqRecords.filter(function(record) {
    return !parseInt(record['cq:Customer_Support_ID']);
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
    // Get full ClearQuest record
    console.log('clearquestRecordUrl: ' + clearquestRecordUrl);
    var promise = getJSON({url: clearquestRecordUrl, headers: clearquestHeaders}).then(function(clearquestRecord) {
      console.log('GitHub payload: ');
      console.log(cqToGi(clearquestRecord));
      // Create new issue on GitHub
      return postJSON({
        url: 'https://api.github.com/repos/vine77/saa-ui/issues',
        body: cqToGi(clearquestRecord),
        headers: githubHeaders,
        proxy: PROXY
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
          console.log('Successfully added GitHub issue #' + githubIssue.number + ' to ' + clearquestRecord['cq:id']);
        }).catch(function(error) {
          console.log('Failed to add GitHub issue #' + githubIssue.number + ' to ' + clearquestRecord['cq:id']);
          console.log(error);
        });
      }).catch(function(error) {
        console.log('Failed to create issue on GitHub for ' + clearquestRecord['cq:id']);
        console.log(error);
      });
    });
    promises.push(promise);
  });
  return RSVP.all(promises);
}).catch(function(error) {
  console.log('An error occurred while attempting to get ClearQuest issues. ' + error.status + ' ' + error.statusText);
  console.log(error);
});
