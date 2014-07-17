App.ServiceController = Ember.ObjectController.extend({
  nodeType: function () {
    var name = this.get('name');
    if (name.length < 1) {
      return 'generic';
    } else {
      return name;
    }
    return 'generic';
  }.property('name'),
  nodeTypeClass: function () {
    return 'icon-' + this.get('nodeType');
  }.property('nodeType'),
  overallHealth: function() {
     return App.overallHealth(health, operational);
  }.property(),
  healthMessage: function() {
    return 'Healthy State: ' + App.priorityToType(this.get('health')).capitalize();
  }.property('health'),
  operationalMessage: function() {
    return 'Operational State: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational')

});
