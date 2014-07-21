import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  return (isEmpty(value)) ? placeholders.NOT_APPLICABLE : value;
});
