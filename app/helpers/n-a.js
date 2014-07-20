import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  return (App.isEmpty(value)) ? placeholders.NOT_APPLICABLE : value;
});
