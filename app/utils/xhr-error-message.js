import Ember from 'ember';
import errorMessage from './error-message';

/**
 * Return an error notification given the XHR object
 *
 * @param {object} xhr - the XHR object (e.g. an XMLHTTPRequest object, jqXHR object, or the XHR parameter passed to the Promises/A+ error handler)
 * @param {string} [defaultMessage] - The error message to display if no message is found in the XHR response text. Defaults to a message of the form: 'An error occured: 404 Not Found'.
 * @returns {string} The error message, which is also displayed in the UI
 */
export default function(xhr, defaultMessage) {
  var message = defaultMessage || 'An error occured: ' + xhr.status + ' ' + xhr.statusText;
  var json;
  try {
    if (!!xhr[0] && 'responseText' in xhr[0]) {
      json = Ember.$.parseJSON(xhr[0].responseText);
    } else if (!!xhr && 'responseText' in xhr) {
      json = Ember.$.parseJSON(xhr.responseText);
    } else {
      json = xhr;
    }
    message = errorMessage(json) || message;
  } catch(error) {}
  return message;
}
