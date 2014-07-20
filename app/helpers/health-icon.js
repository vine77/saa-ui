import Ember from 'ember';
import priorityToType from '../utils/convert/priority-to-type';
import priorityToIconClass from '../utils/convert/priority-to-icon-class';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + priorityToType(code) + ' ' + priorityToIconClass(code) + ' icon-large fixed-width"></i>');
});
