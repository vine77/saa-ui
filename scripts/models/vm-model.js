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

  // Relationships
  node: DS.belongsTo('node'),
  vmTrustReport: DS.belongsTo('vmTrustReport'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple'),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  sla: DS.belongsTo('sla')

});
