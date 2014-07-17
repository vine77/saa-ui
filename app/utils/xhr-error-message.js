import Ember from 'ember';
import errorMessage from '../utils/error-message';

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
