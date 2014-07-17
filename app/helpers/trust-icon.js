import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + App.trustToString(code) + ' ' + App.trustToIconClass(code) + ' icon-large fixed-width"></i>');
});
