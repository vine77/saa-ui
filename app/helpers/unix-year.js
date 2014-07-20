import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(time) {
  if (!App.isEmpty(time)) {
    if (typeof time === 'number') time *= 1000;  // Convert from Unix timestamp to milliseconds from epoch
    return new Handlebars.SafeString('<time class="timestamp" datetime="' + moment(time).format('YYYY') + '">' + moment(time).format('YYYY') + '</time>');
  } else {
    return placeholders.NOT_APPLICABLE;
  }
});
