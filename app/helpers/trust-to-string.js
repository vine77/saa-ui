import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import trustToString from '../utils/convert/trust-to-string';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (App.isEmpty(code)) ? placeholders.NOT_APPLICABLE : trustToString(code).capitalize();
});
