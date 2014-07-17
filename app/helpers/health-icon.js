import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(code) {
  return new Handlebars.SafeString('<i class="' + App.priorityToType(code) + ' ' + App.priorityToIconClass(code) + ' icon-large fixed-width"></i>');
});
