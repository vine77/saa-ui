var requestJSON = require('./request-json');

module.exports = function(options) {
  options.method = 'PUT';
  return requestJSON(options);
};
