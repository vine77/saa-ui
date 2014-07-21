import Ember from 'ember';
import priorityToType from '../utils/convert/priority-to-type';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (isEmpty(code)) ? placeholders.NOT_APPLICABLE : priorityToType(code).toString().capitalize();
});
