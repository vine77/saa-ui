import Ember from 'ember';
import bytesToReadableSize from '../utils/bytes-to-readable-size';

export default Ember.Handlebars.makeBoundHelper(function(sizeInMegabytes) {
  return bytesToReadableSize(sizeInMegabytes, 1048576);
});
