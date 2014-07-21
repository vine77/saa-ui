import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import trustToString from '../utils/convert/trust-to-string';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (isEmpty(code)) ? placeholders.NOT_APPLICABLE : trustToString(code).capitalize();
});
