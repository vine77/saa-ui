import Ember from 'ember';
import priorityToType from '../utils/convert/priority-to-type';
import overallHealth from '../utils/convert/overall-health';
import codeToOperational from '../utils/convert/code-to-operational';

export default Ember.ObjectController.extend({
  nodeType: function() {
    var name = this.get('name');
    if (name.length < 1) {
      return 'generic';
    } else {
      return name;
    }
    return 'generic';
  }.property('name'),
  nodeTypeClass: function() {
    return 'icon-' + this.get('nodeType');
  }.property('nodeType'),
  overallHealth: function() {
     return overallHealth(health, operational);
  }.property(),
  healthMessage: function() {
    return 'Healthy State: ' + priorityToType(this.get('health')).capitalize();
  }.property('health'),
  operationalMessage: function() {
    return 'Operational State: ' + codeToOperational(this.get('operational')).capitalize();
  }.property('operational')

});
