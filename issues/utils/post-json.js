var requestJSON = require('./request-json');

module.exports = function(options) {
  options.method = 'POST';
  return requestJSON(options);
};
