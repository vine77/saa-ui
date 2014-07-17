import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(size) {
  return App.readableSize(size);
});
