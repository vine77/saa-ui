App.StatusView = Ember.View.extend({
  test: "CASE2",
  childrenId: function() {
    //return 'children-' + this.get('elementId');
    return 'children-' + this.get('elementId');
  }.property('elementId'),
  selectorId: function() {
    return 'selector-' + this.get('elementId');
  }.property('elementId')

});