import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';
import isEmpty from '../utils/is-empty';

export default Ember.Handlebars.makeBoundHelper(function(time) {
  return (isEmpty(time)) ? placeholders.NOT_APPLICABLE : new Ember.Handlebars.SafeString('<time class="timeago" datetime="' + window.moment(time).format() + '" title="' + window.moment(time).format('YYYY-MM-DD hh:mm:ss') + '"' + '>' + window.moment(time).fromNow() + '</time>');
});
