import Ember from 'ember';
import associativeToNumericArray from '../utils/associative-to-numeric-array';

export default function(response, separator) {
  if (typeof separator === 'undefined') separator = '<br>';

  if (response.meta && response.meta.registration_status) {
    return response.meta.registration_status.mapBy('error_message').join(separator);
  }

  if (Ember.isArray(response)) {
    if (response[0] && response[0].then) {
      if (response[0].status !== 200) {
        return response[0].statusText;
      }
    } else {
      return response.join(separator);
    }
  } else if (response.hasOwnProperty('errors')) {  // Check errors first in case response is actually a DS.InvalidError
    if (Ember.isArray(response.errors)) {
      return response.errors.join(separator);
    } else if (typeof response.errors === 'string') {
      return response.errors;
    // Expected format from backend for 422 validation errors
    } else if (typeof response.errors === 'object') {
      return associativeToNumericArray(response.errors).join(separator);
    } else {
      return '';
    }
  } else if (response.hasOwnProperty('error_message')) {
    return response.error_message;
  } else if (response.hasOwnProperty('message')) {
    return response.message;
  } else if (response.hasOwnProperty('faultstring')) {
    return response.faultstring;
  } else {
    return '';
  }
}
