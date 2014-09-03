var XMLHttpRequest = require('xhr2');
var RSVP = require('rsvp');
var https = require('https');
var DOMParser = require('xmldom').DOMParser;

// Set Node.js options
var agent = new https.Agent;
agent.options.rejectUnauthorized = false;  // Allow self-signed certificates
XMLHttpRequest.nodejsSet({httpsAgent: agent});

module.exports = function(url, headers) {
  var promise = new RSVP.Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          var xmlObject = new DOMParser().parseFromString(this.response);
          resolve(xmlObject);
        } else {
          reject(this);
        }
      }
    };
    xhr.responseType = 'text';
    if (headers) for (var name in headers) xhr.setRequestHeader(name, headers[name]);
    xhr.send();
  });
  return promise;
};
