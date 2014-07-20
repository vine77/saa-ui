import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import codeToOperational from '../utils/convert/code-to-operational';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (App.isEmpty(code)) ? placeholders.NOT_APPLICABLE : codeToOperational(code).toString().capitalize();
});
