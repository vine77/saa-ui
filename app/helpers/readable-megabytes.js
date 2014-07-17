import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(sizeInMegabytes) {
  return App.bytesToReadableSize(sizeInMegabytes, 1048576);
});
