import Ember from 'ember';
import bytesToReadableSize from '../utils/bytes-to-readable-size';

export default Ember.Handlebars.makeBoundHelper(function(sizeInBytes) {
  return bytesToReadableSize(sizeInBytes);
});
