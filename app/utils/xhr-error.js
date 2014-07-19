import notify from './../utils/notify';
import health from './../utils/mappings/health';
import errorMessage from './../utils/xhr-error-message';

/**
 * Display an error notification given the XHR object
 *
 * @param {object} xhr - the XHR object (e.g. an XMLHTTPRequest object, jqXHR object, or the XHR parameter passed to the Promises/A+ error handler)
 * @param {string} [defaultMessage] - The error message to display if no message is found in the XHR response text. Defaults to a message of the form: 'An error occured: 404 Not Found'.
 * @returns {string} The error message, which is also displayed in the UI
 */
export default function(xhr, defaultMessage) {
  var message = errorMessage(xhr, defaultMessage);
  var severity = (xhr.status === 422 || (xhr[0] && xhr[0].status === 422)) ? health.WARNING : health.ERROR;
  notify(message, severity);
  return message;
}
