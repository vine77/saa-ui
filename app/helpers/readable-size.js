import Ember from 'ember';
import readableSize from '../utils/readable-size';

export default Ember.Handlebars.makeBoundHelper(function(size) {
  return readableSize(size);
});
