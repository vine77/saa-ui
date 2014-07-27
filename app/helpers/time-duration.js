import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(duration) {
  return (isEmpty(duration)) ? placeholders.NOT_APPLICABLE : window.moment.duration(duration, 'seconds').humanize();
});
