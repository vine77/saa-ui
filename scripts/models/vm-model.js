App.VmSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    name: 'vm_name'
  }
});

App.Vm = DS.Model.extend({
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
  state: function () {
    return this.get('status.health') + '.' + this.get('status.operational');
  }.property('status.health', 'status.operational'),
  noisy: function () {
    return this.get('status.victim') + '.' + this.get('status.aggressor');
  }.property('status.victim', 'status.aggressor'),

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
