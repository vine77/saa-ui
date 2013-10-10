App.NodeSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    name: 'node_name'
  }
});

App.Node = DS.Model.extend({
  capabilities: DS.attr(),
  cloudServices: DS.attr(),
  contention: DS.attr(),
  ids: DS.attr(),
  memory: DS.attr(),
  name: DS.attr('string'),
  samControlled: DS.attr('number'),  // 0: Not under SAM control (agent not installed), 1: SAM monitored, 2: SAM assured (can place SLA VMs on node)
  samRegistered: DS.attr('boolean'),
  schedulerMark: DS.attr('number'),
  schedulerPersistent: DS.attr('boolean'),
  status: DS.attr(),
  tier: DS.attr('string'),
  utilization: DS.attr(),
  vcpus: DS.attr(),
  vmInfo: DS.attr(),

  // Relationships
  vms: DS.hasMany('vm', {async: true}),
  nodeTrustReport: DS.belongsTo('nodeTrustReport'),
  trustNode: DS.belongsTo('trustNode')
});
