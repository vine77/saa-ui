import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  capabilities: DS.attr(),
  contention: DS.attr(),
  floatingIps: DS.attr('array'),
  fixedIps: DS.attr('array'),
  macs: DS.attr('array'),
  name: DS.attr('string'),
  nodeName: DS.attr('string'),
  slaName: DS.attr('string'),
  status: DS.attr(),
  utilization: DS.attr(),

  // Computed properties for sorting
  state: function() {
    return this.get('status.health') + '.' + this.get('status.operational');
  }.property('status.health', 'status.operational'),
  noisy: function() {
    return this.get('status.victim') + '.' + this.get('status.aggressor');
  }.property('status.victim', 'status.aggressor'),

  vcpusTimesSu: function() {
    var suFloor, suCeiling, computeSlo, suRange, suTotalRange;
    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return null;
    computeSlo = this.get('sla.slos').findBy('sloType', 'compute');
    suRange = computeSlo && computeSlo.get('value');
    if (Ember.isEmpty(suRange)) {
      suFloor = null;
    } else if (suRange.indexOf(';') === -1) {
      suFloor = suRange;
    } else {
      suFloor = suRange.split(';')[0];
    }

    if (Ember.isEmpty(suRange)) {
      suCeiling = null;
    } else if (suRange.indexOf(';') === -1) {
      suCeiling = suRange;
    } else {
      suCeiling = suRange.split(';')[1];
    }

    if (Ember.isEmpty(suFloor)) {
      suTotalRange = null;
    } else if (this.get('suFloor') === suCeiling) {
      suTotalRange = (parseFloat(suFloor) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    } else {
      suTotalRange = (parseFloat(suFloor) * parseInt(this.get('capabilities.cores'))).toFixed(1) + '-' + (parseFloat(suCeiling) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    }

    if (Ember.isEmpty(suFloor)) {
      suRange = null;
    } else if (suFloor === suCeiling) {
      suRange = parseFloat(suFloor).toFixed(1);
    } else {
      suRange = parseFloat(suFloor).toFixed(1) + '-' + parseFloat(suCeiling).toFixed(1);
    }

    return (parseFloat(suTotalRange.replace('-', '')) * 50 + '.' + this.get('capabilities.cores') + '.' + suRange.replace('-', ''));
  }.property('capabilities.cores', 'sla.slos.@each'),

  // Self-referential relationships
  aggressors: DS.hasMany('vm', {async: true, inverse: null}),
  victims: DS.hasMany('vm', {async: true, inverse: null}),

  // Relationships
  node: DS.belongsTo('node'),
  sla: DS.belongsTo('sla'),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple'),
  vmTrustReport: DS.belongsTo('vmTrustReport')
});
