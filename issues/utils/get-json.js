var requestJSON = require('./request-json');

module.exports = function(options) {
  options.method = 'GET';
  return requestJSON(options);
};
