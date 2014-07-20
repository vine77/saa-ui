import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  if (value) {
    return value.toFixed(1);
  } else {
    return placeholders.NOT_APPLICABLE;
  }
});
