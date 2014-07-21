import Ember from 'ember';
import xhrErrorMessage from '../utils/xhr-error-message';

export default Ember.Handlebars.makeBoundHelper(function(xhr) {
  return xhrErrorMessage(xhr);
});
