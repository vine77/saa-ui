import Ember from 'ember';
import numberWithCommas from '../utils/number-with-commas';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  return numberWithCommas(value);
});
