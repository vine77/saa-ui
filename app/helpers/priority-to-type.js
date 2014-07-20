import Ember from 'ember';
import priorityToType from '../utils/convert/priority-to-type';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (App.isEmpty(code)) ? placeholders.NOT_APPLICABLE : priorityToType(code).toString().capitalize();
});
