App.NodeSerializer = App.ApplicationSerializer.extend({
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

  // Computed properties for sorting
  state: function () {
    return this.get('status.health') + '.' + this.get('status.operational');
  }.property('status.health', 'status.operational'),

  cpuSort: function () {
    var mhz = this.get('capabilities.cpu_frequency');
    if (!!mhz) {
      var ghz = mhz.split(' ')[0] / 1000;
      var cpuFrequency = ghz + 'GHz';
    } else {
      var cpuFrequency = '';
    }
    return (parseFloat(cpuFrequency) * 100 + '.' + parseFloat(this.get('capabilities.cores_per_socket')) * 50 + '.' +  parseFloat(this.get('capabilities.sockets')));
  }.property('capabilities.cpu_frequency', 'capabilities.cores_per_socket', 'capabilities.sockets'),

  // Relationships
  nodeTrustReport: DS.belongsTo('nodeTrustReport'),
  trustNode: DS.belongsTo('trustNode'),
  vms: DS.hasMany('vm', {async: true})
});
