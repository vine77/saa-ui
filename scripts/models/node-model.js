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
  // 0: Not under SAA control (agent not installed), 1: SAA monitored, 2: SAA assured (can place SLA VMs on node)
  samControlled: Ember.computed.alias('status.mode'),
  isAssured: function() {
    switch(this.get('samControlled')) {
      case '2':
      case 2:
      case App.ASSURED_SCU_VCPU:
        return true;
        break;
      case '3':
      case 3:
      case App.ASSURED_SCU_VM:
        return true;
        break;
      case '4':
      case 4:
      case App.ASSURED_CORES_PHYSICAL:
        return true;
        break;
      default:
        return false;
        break;
    }
  }.property('samControlled'),
  isAssuredScuVcpu: Ember.computed.equal('samControlled', App.ASSURED_SCU_VCPU),
  isAssuredScuVm: Ember.computed.equal('samControlled', App.ASSURED_SCU_VM),
  isAssuredCoresPhysical: Ember.computed.equal('samControlled', App.ASSURED_CORES_PHYSICAL),
  samRegistered: function () {
    return this.get('status.mode') == App.MONITORED || this.get('isAssured');
  }.property('status.mode'),
  schedulerMark: DS.attr('number'),
  schedulerPersistent: DS.attr('boolean'),
  status: DS.attr(),
  tier: DS.attr('string'),
  utilization: DS.attr(),
  vmInfo: DS.attr(),

  memory: Ember.computed.alias('utilization.cloud.memory'),
  vcpus: Ember.computed.alias('utilization.cloud.vcpus'),

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
