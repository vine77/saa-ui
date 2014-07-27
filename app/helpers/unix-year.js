import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(time) {
  if (!isEmpty(time)) {
    if (typeof time === 'number') time *= 1000;  // Convert from Unix timestamp to milliseconds from epoch
    return new Ember.Handlebars.SafeString('<time class="timestamp" datetime="' + window.moment(time).format('YYYY') + '">' + window.moment(time).format('YYYY') + '</time>');
  } else {
    return placeholders.NOT_APPLICABLE;
  }
});
