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
  name: DS.attr('string'),
  schedulerMark: DS.attr('number'),
  schedulerPersistent: DS.attr('boolean'),
  status: DS.attr(),
  tier: DS.attr('string'),
  utilization: DS.attr(),
  vmInfo: DS.attr(),

  samControlled: Ember.computed.alias('status.mode'),  // 0: Not under SAA control (agent not installed), 1: SAA monitored, 2: SAA assured (can place SLA VMs on node)
  memory: Ember.computed.alias('utilization.cloud.memory'),
  vcpus: Ember.computed.alias('utilization.cloud.vcpus'),

  // Computed properties
  scuTotal: function() {
    var compute = this.get('utilization.scu.system.compute');
    var ioWait = this.get('utilization.scu.system.io_wait');
    var misc = this.get('utilization.scu.system.misc');
    if (Ember.isEmpty(compute) && Ember.isEmpty(ioWait) && Ember.isEmpty(misc)) return null;
    if ((compute === -1) || (ioWait === -1) || (misc === -1)) return -1;
    var returnValue = (compute || 0) + (ioWait || 0) + (misc || 0);
    return returnValue.toFixed(2);
  }.property('utilization.scu.system.compute', 'utilization.scu.system.io_wait', 'utilization.scu.system.misc'),
  isAssured: function() {
    return this.get('samControlled') == App.ASSURED_SCU_VCPU ||
      this.get('samControlled') == App.ASSURED_SCU_VM ||
      this.get('samControlled') == App.ASSURED_CORES_PHYSICAL;
  }.property('samControlled'),
  isAssuredScuVcpu: Ember.computed.equal('samControlled', App.ASSURED_SCU_VCPU),
  isAssuredScuVm: Ember.computed.equal('samControlled', App.ASSURED_SCU_VM),
  isAssuredCoresPhysical: Ember.computed.equal('samControlled', App.ASSURED_CORES_PHYSICAL),
  samRegistered: function () {
    return this.get('status.mode') == App.MONITORED || this.get('isAssured');
  }.property('status.mode'),

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
  vms: DS.hasMany('vm', {async: true}),
  tenants: DS.hasMany('tenant', {async: true})
});
