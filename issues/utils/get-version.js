var RSVP = require('rsvp');
var getXML = require('./get-xml');

/** Returns latest build version as a string in a Promise */
module.exports = function() {
  var quickbuildUrl = 'https://quickbuild.igk.intel.com/rest/latest_builds/4075';  // Corresponds to release-saa-v1.1.2
  var quickbuildHeaders = {
    'Authorization': 'Basic bmp3YXJkMXg6eWFybmlhbnQzIXRp'
  };
  return getXML(quickbuildUrl, quickbuildHeaders).then(function(response) {
    var version = response.getElementsByTagName('version')[0].childNodes[0];
    return RSVP.resolve(version);
  });
};
