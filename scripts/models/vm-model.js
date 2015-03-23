App.VmSerializer = App.ApplicationSerializer.extend({
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
  tenantName: DS.attr('string'),

  // Computed properties
  scuTotal: function() {
    var compute = this.get('utilization.scu.compute');
    var ioWait = this.get('utilization.scu.io_wait');
    var misc = this.get('utilization.scu.misc');
    if (Ember.isEmpty(compute) && Ember.isEmpty(ioWait) && Ember.isEmpty(misc)) return null;
    if ((compute === -1) || (ioWait === -1) || (misc === -1)) return -1;
    return (compute || 0) + (ioWait || 0) + (misc || 0);
  }.property('utilization.scu.compute', 'utilization.scu.io_wait', 'utilization.scu.misc'),

  // Computed properties for sorting
  state: function () {
    return this.get('status.health') + '.' + this.get('status.operational');
  }.property('status.health', 'status.operational'),
  noisy: function () {
    return this.get('status.victim') + '.' + this.get('status.aggressor');
  }.property('status.victim', 'status.aggressor'),
  sortScuRange: function () {
    var sortScuRange = this.get('capabilities.scu_allocated_min');
    if (this.get('capabilities.scu_allocated_max')) sortScuRange += '.' + this.get('capabilities.scu_allocated_max');
    return sortScuRange;
  }.property('capabilities.scu_allocated_min', 'capabilities.scu_allocated_max'),

  // Self-referential relationships
  aggressors: DS.hasMany('vm', {async: true, inverse: null}),
  victims: DS.hasMany('vm', {async: true, inverse: null}),

  // Relationships
  node: DS.belongsTo('node'),
  flavor: DS.belongsTo('flavor'),
  sla: DS.belongsTo('sla'),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple'),
  vmTrustReport: DS.belongsTo('vmTrustReport'),
  tenant: DS.belongsTo('tenant', {async: true})
});
