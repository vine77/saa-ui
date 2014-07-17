import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(items) {
  if (Ember.isEmpty(items) || Ember.typeOf(items) !== 'array') return '';
  return items.join(', ');
}, '@each');
