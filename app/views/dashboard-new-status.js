import Ember from 'ember';

export default Ember.View.extend({
  childrenId: function() {
    return 'children-' + this.get('elementId');
  }.property('elementId'),
  selectorId: function() {
    return 'selector-' + this.get('elementId');
  }.property('elementId')
});
