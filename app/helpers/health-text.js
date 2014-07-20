import Ember from 'ember';
import priorityToType from '../utils/convert/priority-to-type';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return priorityToType(code, true).capitalize();
});
