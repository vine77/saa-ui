import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return (App.isEmpty(code)) ? App.NOT_APPLICABLE : App.priorityToType(code).toString().capitalize();
});
