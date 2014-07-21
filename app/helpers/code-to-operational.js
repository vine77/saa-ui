import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import codeToOperational from '../utils/convert/code-to-operational';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (isEmpty(code)) ? placeholders.NOT_APPLICABLE : codeToOperational(code).toString().capitalize();
});
