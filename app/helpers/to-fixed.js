import Ember from 'ember';
import toFixed from '../utils/to-fixed';

export default Ember.Handlebars.makeBoundHelper(function(number, digits) {
  return toFixed(number, digits);
});
