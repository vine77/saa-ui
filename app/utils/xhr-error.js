import notify from '../utils/notify';
import health from '../utils/mappings/health';
import errorMessage from '../utils/xhr-error-message';

export default function(xhr, defaultMessage) {
  var message = errorMessage(xhr, defaultMessage);
  var severity = (xhr.status === 422 || (xhr[0] && xhr[0].status === 422)) ? health.WARNING : health.ERROR;
  notify(message, severity);
  return message;
}
