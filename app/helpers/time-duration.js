import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(duration) {
  return (App.isEmpty(duration)) ? App.NOT_APPLICABLE : moment.duration(duration, 'seconds').humanize();
});
