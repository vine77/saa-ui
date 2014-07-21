import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(string) {
  return (isEmpty(string)) ? placeholders.NOT_APPLICABLE : string.toString().toUpperCase();
});
