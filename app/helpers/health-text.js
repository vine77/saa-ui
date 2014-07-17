import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return App.priorityToType(code, true).capitalize();
});
