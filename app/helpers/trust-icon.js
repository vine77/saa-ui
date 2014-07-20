import Ember from 'ember';
import trustToString from '../utils/convert/trust-to-string';
import trustToIconClass from '../utils/convert/trust-to-icon-class';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + trustToString(code) + ' ' + trustToIconClass(code) + ' icon-large fixed-width"></i>');
});
