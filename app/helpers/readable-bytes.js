import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(sizeInBytes) {
  return App.bytesToReadableSize(sizeInBytes);
});
