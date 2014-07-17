import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + App.codeToOperational(code) + ' ' + App.operationalToIconClass(code) + ' icon-large fixed-width"></i>');
});
