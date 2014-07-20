import Ember from 'ember';
import codeToOperational from '../utils/convert/code-to-operational';
import operationalToIconClass from '../utils/convert/operational-to-icon-class';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + codeToOperational(code) + ' ' + operationalToIconClass(code) + ' icon-large fixed-width"></i>');
});
