import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  if (value) {
    return value.toFixed(1);
  } else {
    return App.NOT_APPLICABLE;
  }
});
