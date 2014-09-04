var requestJSON = require('./request-json');

module.exports = function(options) {
  options.method = 'DELETE';
  return requestJSON(options);
};
