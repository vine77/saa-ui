import Ember from 'ember';
import placeholders from '../utils/mappings/placeholders';

export default Ember.Handlebars.makeBoundHelper(function(time) {
  return (App.isEmpty(time)) ? placeholders.NOT_APPLICABLE : new Handlebars.SafeString('<time class="timeago" datetime="' + moment(time).format() + '" title="' + moment(time).format('YYYY-MM-DD hh:mm:ss') + '"' + '>' + moment(time).fromNow() + '</time>');
});
