import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(xhr) {
  return App.xhrErrorMessage(xhr);
});
