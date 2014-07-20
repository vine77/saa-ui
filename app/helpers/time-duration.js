import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(duration) {
  return (App.isEmpty(duration)) ? placeholders.NOT_APPLICABLE : moment.duration(duration, 'seconds').humanize();
});
