import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  generationTime: DS.attr('string'),
  nodesCount: DS.attr(),
  rankedNodes: DS.hasMany('vmInstantiationSimpleRankedNode'),
  scheduleTime: DS.attr('string'),
  slaName: DS.attr('string'),
  sloGates: DS.hasMany('vmInstantiationSimpleSloGate'),
  vmName: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  // Computed properties
  multipleNodes: Ember.computed.gt('nodesCount.total', 1),
  selectedNode: function() {
    if (Ember.isEmpty('rankedNodes')) return null;
    return this.get('rankedNodes').findBy('selected').get('node');
  }.property('rankedNodes'),

  // Full Relationships
  vm: DS.belongsTo('vm'),
  sla: DS.belongsTo('sla')
});
