#!/usr/bin/env node

var getJSON = require('./utils/get-json');
var cqToGi = require('./utils/cq-to-gi');

console.log('Pulling issues from ClearQuest...');

var url = 'https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1/query/49124594?oslc.pageSize=1000';
var headers = {
  'OSLC-Core-Version': '2.0',
  'Authorization': 'Basic bmp3YXJkMXg6eWFybmlhbnQzIXRp'
};

var cqRecords = [];

getJSON(url, headers).then(function(response) {
  cqRecords = response['rdfs:member'];
  cqRecords = [cqRecords[0]];  // TODO: Remove this line
  cqRecords.forEach(function(record) {
    var url = record['rdf:about'];
    if (url) getJSON(url, headers).then(function(response) {
      cqToGi(response);
    });
  });
  console.log('Records: ' + cqRecords.length);
}).catch(function(error) {
  console.log('Failed to get ClearQuest issues. ' + error.status + ' ' + error.statusText);
});
