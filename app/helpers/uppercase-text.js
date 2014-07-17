import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(string) {
  return (App.isEmpty(string)) ? App.NOT_APPLICABLE : string.toString().toUpperCase();
});
