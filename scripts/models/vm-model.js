// Embedded records
DS.RESTAdapter.map('App.Vm', {
  name: {key: 'vm_name'},
  status: {embedded: 'always'},
  mac: {embedded: 'always'},
  utilization: {embedded: 'always'},
  capabilities: {embedded: 'always'},
  floatingIps: {embedded: 'always'},
  fixedIps: {embedded: 'always'},
  contention: {embedded: 'always'}
});

DS.RESTAdapter.map('App.VmStatus', {
  trust_details: {embedded: 'always'}
});

DS.RESTAdapter.map('App.VmContention', {
  threads: {embedded: 'always'},
  system: {embedded: 'always'}
});

DS.RESTAdapter.map('App.VmContentionThread', {
  llc: { embedded: 'always' }
});

DS.RESTAdapter.map('App.VmContentionSystem', {
  llc: { embedded: 'always' }
});

// Embedded models
App.VmStatus = DS.Model.extend({
  locked: DS.attr('boolean'),
  health: DS.attr('number'),
  short_message: DS.attr('string'),
  long_message: DS.attr('string'),
  healthMessage: function () {
    if (App.isEmpty(this.get('short_message')) && App.isEmpty(this.get('long_message'))) {
      // If both short and long messages are empty, show health as message
      return '<strong>Health</strong>: ' + App.priorityToType(this.get('health')).capitalize();
    } else if (App.isEmpty(this.get('long_message'))) {  // Short message only
      return this.get('short_message').capitalize();
    } else {  // Default to long message
      return this.get('long_message').capitalize();
    }
  }.property('health', 'long_message', 'short_message'),
  operational: DS.attr('number'),
  operationalMessage: function () {
    return '<strong>State</strong>: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational'),
  trust: DS.attr('boolean'),
  trust_details: DS.belongsTo('App.VmStatusTrustDetails'),
  trustMessage: function () {
    var message = '';
    if (this.get('trust') === 0) {
      message = 'Trust Status: Unknown.';
    } else if (this.get('trust') === 1) {
      message = 'Trust Status: Not Trusted';
    } else if (this.get('trust') === 2) {
      message = 'Trust Status: Trusted';
    }
    message += '<br>' + 'BIOS: ' + App.trustDetailsToString(this.get('trust_details.bios'));
    message += '<br>' + 'VMM: ' + App.trustDetailsToString(this.get('trust_details.vmm'));
    return message;
  }.property('trust'),
  sla_status: DS.attr('number'),
  slaViolated: function () {
    return this.get('sla_status') === 1;
  }.property('sla_status'),
  slaNotViolated: function () {
    return this.get('sla_status') === 0;
  }.property('sla_status'),
  slaUnknown: function () {
    return Ember.isEmpty(this.get('sla_status'));
  }.property('sla_status'),
  sla_messages: DS.attr('array'),
  slaMessage: function () {
    if (App.isEmpty(this.get('sla_messages'))) {
      var slaStatus = '';
      if (this.get('sla_status') === 0) {
        slaStatus = 'Not violated';
      } else if (this.get('sla_status') === 1) {
        slaStatus = 'Violated';
      } else {
        slaStatus = 'Unknown';
      }
      return 'SLA Status: ' + slaStatus;
    } else {
      var messages = this.get('sla_messages').map(function (item, index, enumerable) {
        if (item.slice(-1) === '.') item = item.slice(0, -1);
        return item.capitalize();
      });
      return messages.join('; ');
    }
  }.property('sla_status', 'sla_message')
});
App.VmStatusTrustDetails = DS.Model.extend({
  bios: DS.attr('string'),
  vmm: DS.attr('string')
});
App.VmUtilization = DS.Model.extend({
  ipc: DS.attr('number'),
  uptime: DS.attr('number'),
  //network: DS.attr('string'),     // empty for beta
  //io: DS.attr('string'),          // empty for beta
  memory: DS.attr('string'),
  cpu: DS.attr('number'),
  gips_current: DS.attr('number')
});

App.VmCapabilities = DS.Model.extend({
  cores: DS.attr('number'),
  memory_size: DS.attr('string'),
  gips_allocated: DS.attr('number')
});

App.VmContention = DS.Model.extend({
  threads: DS.hasMany('App.VmContentionThread'),
  system: DS.belongsTo('App.VmContentionSystem')
});

App.VmContentionSystem = DS.Model.extend({
  llc: DS.belongsTo('App.VmContentionSystemLlc')
});

App.VmContentionSystemLlc = DS.Model.extend({
  value: DS.attr('number'),
  valueExists: function () {
    return typeof this.get('value') !== 'undefined' && this.get('value') !== null;
  }.property('value'),
  label: DS.attr('string'),
  barWidth: function () {
    if (this.get('value') === 0 || App.isEmpty(this.get('value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('value'), 0, 50);
      return "width:"+percent+"%;";
    }
  }.property('value'),
  contentionMessage: function () {
    if (App.isEmpty(this.get('value'))) {
      return '<strong>Contention Not Available</strong>';
    } else {
      var message = 'Overall Cache Contention: ' + this.get('value');
      var vCPUs = App.Vm.find(this._reference.parent.parent.parent.id).get('contention.threads');
      vCPUs.forEach(function (item, index, enumerable) {
        vCPU = item.get('llc');
        message += '<br>' + 'vCPU Contention: ' + vCPU.get('value');
      });
      return message;
    }
  }.property('value')
});

App.VmContentionThread = DS.Model.extend({
  llc: DS.belongsTo('App.VmContentionThreadLlc')
});

App.VmContentionThreadLlc = DS.Model.extend({
  value: DS.attr('number'),
  label: DS.attr('string'),
  contentionBarWidth: function () {
    if (this.get('value') === 0 || App.isEmpty(this.get('value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('value'), 0, 50);
      return "width:"+percent+"%;";
    }
  }.property('value'),
  contentionMessage: function () {
    if (this.get('value') == -1) {
      return '<strong>Cache Contention Not Available</strong>';
    } else {
      return '<strong>Cache Contention</strong><br> Value: ' + this.get('value');
    }
  }.property('value')
});


App.Vm = DS.Model.extend({
  // Common Properties
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  isSelectedObserver: function() {
    if ((this.get('isSelected'))) {
      App.currentSelections.get('selectedVms').addObject(this);
    } else {
      App.currentSelections.get('selectedVms').removeObject(this);
    }
    App.contextualGraphs.propertyDidChange('selectedVms');
    App.currentSelections.propertyDidChange('selectedVms');
  }.observes('isSelected'),

  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isSelected', 'isExpanded'),

  // Embedded Relationships
  status: DS.belongsTo('App.VmStatus'),
  capabilities: DS.belongsTo('App.VmCapabilities'),
  utilization: DS.belongsTo('App.VmUtilization'),
  contention: DS.belongsTo('App.VmContention'),

  // Full Relationships
  node: DS.belongsTo('App.Node'),
  vmTrustReport: DS.belongsTo('App.VmTrustReport'),
  vmInstantiationSimple: DS.belongsTo('App.VmInstantiationSimple'),
  vmInstantiationDetailed: DS.belongsTo('App.VmInstantiationDetailed'),
  //stack: DS.belongsTo('App.Stack'),
  sla: DS.belongsTo('App.Sla'),

  didReload: function () {
    if (this.get('vmTrustReport.isLoaded')) {
      this.get('vmTrustReport').reload();
    }
    if (this.get('vmInstantiationSimple.isLoaded')) {
      this.get('vmInstantiationSimple').reload();
    }
    if (this.get('vmInstantiationDetailed.isLoaded')) {
      this.get('vmInstantiationDetailed').reload();
    }
  },


  // Properties from get_all API
  name: DS.attr('string'),
  slaName: DS.attr('string'),
  nodeName: DS.attr('string'),
  //stackName: DS.attr('string'),
  macs: DS.attr('array'),
  floatingIps: DS.attr('array'),
  fixedIps: DS.attr('array'),

  // Computed properties
  isOn: function () {
    return (this.get('status.operational') === App.ON);
  }.property('status.operational')
});
