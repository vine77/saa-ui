#!/usr/bin/env node

var RSVP = require('rsvp');
var request = require('request');

module.exports = function(options) {
  if (typeof options === 'string') options = {url: options};
  return new RSVP.Promise(function(resolve, reject) {
    request({
      method: options.method || 'GET',
      url: options.url,
      body: options.body,
      proxy: options.proxy,
      headers: options.headers,
      strictSSL: false
    }, function(error, response, body) {
      if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
        resolve(body);
      } else {
        reject(error ? error : {response: response, body: body});
      }
    });
  });
};
