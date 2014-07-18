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
    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return null;
    var computeSlo = this.get('sla.slos').findBy('sloType', 'compute');
    var suRange = computeSlo && computeSlo.get('value');
    if (Ember.isEmpty(suRange)) {
      var suFloor = null;
    } else if (suRange.indexOf(';') === -1) {
      var suFloor = suRange;
    } else {
      var suFloor = suRange.split(';')[0];
    }

    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return null;
    var computeSlo = this.get('sla.slos').findBy('sloType', 'compute');
    var suRange = computeSlo && computeSlo.get('value');
    if (Ember.isEmpty(suRange)) {
      var suCeiling = null;
    } else if (suRange.indexOf(';') === -1) {
      var suCeiling = suRange;
    } else {
      var suCeiling = suRange.split(';')[1];
    }

    if (Ember.isEmpty(suFloor)) {
      var suTotalRange = null;
    } else if (this.get('suFloor') === suCeiling) {
      var suTotalRange = (parseFloat(suFloor) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    } else {
      var suTotalRange = (parseFloat(suFloor) * parseInt(this.get('capabilities.cores'))).toFixed(1) + '-' + (parseFloat(suCeiling) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    }

    if (Ember.isEmpty(suFloor)) {
      var suRange = null;
    } else if (suFloor === suCeiling) {
      var suRange = parseFloat(suFloor).toFixed(1);
    } else {
      var suRange = parseFloat(suFloor).toFixed(1) + '-' + parseFloat(suCeiling).toFixed(1);
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
