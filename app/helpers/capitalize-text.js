import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(string) {
  return (App.isEmpty(string)) ? placeholders.NOT_APPLICABLE : string.toString().capitalize();
});
