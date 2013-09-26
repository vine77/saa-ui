// Embedded records

App.NodeSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    vcpus: {embedded: 'always'},
    vmInfo: {embedded: 'always'},
    memory: {embedded: 'always'},
    capabilities: {embedded: 'always'},
    utilization: {embedded: 'always'},
    status: {embedded: 'always'},
    contention: {embedded: 'always'},
    ids: {embedded: 'always'},
    name: {key: 'node_name'}
  }
});

App.NodeStatusSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    trust_details: {embedded: 'always'}
  }
});

App.NodeUtilizationSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    cpu: {embedded: 'always'}
  }
});

App.ContentionSystemSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    llc: {embedded: 'always'}
  }
});

App.ContentionSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    sockets: {embedded: 'always'},
    system: {embedded: 'always'}
  }
});

App.SocketSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    llc: {embedded: 'always'}
  }
});


// Embedded models

App.NodeStatus = DS.Model.extend({
  locked: DS.attr('boolean'),
  health: DS.attr('number'),
  short_message: DS.attr('string'),
  long_message: DS.attr('string'),
  operational: DS.attr('number'),
  operationalMessage: function () {
    return '<strong>State</strong>: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational'),
  trust: DS.attr('number'),  // 0: UNKNOWN , 1: NOT TRUSTED, 2: TRUSTED
  isTrusted: Ember.computed.equal('trust', 2),
  isNotTrusted: Ember.computed.equal('trust', 1),
  isTrustUnknown: Ember.computed.not('trust'),
  trust_details: DS.belongsTo('nodeStatusTrustDetails'),
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
  }.property('trust')
});

App.NodeStatusTrustDetails = DS.Model.extend({
  bios: DS.attr('string'),
  vmm: DS.attr('string')
});

App.ContentionSystemLlc = DS.Model.extend({
  value: DS.attr('number'),
  valueExists: function () {
    return typeof this.get('value') !== 'undefined' && this.get('value') !== null;
  }.property('value'),
  system: DS.belongsTo('contentionSystem'),
  valueFormatted: function () {
    return Math.round(this.get('value') * 100) / 100;
  }.property('value'),
  label: DS.attr('string'),
  contentionMessage: function() {
    if (App.isEmpty(this.get('value'))) {
      return '<strong>System LLC Contention</strong>: N/A';
    } else {
      var message = 'Overall LLC Contention: ' + this.get('value') + ' (' + this.get('label') + ')';
      // TODO: Can't use this reference
      //var sockets = App.Node.find(this._reference.parent.parent.parent.id).get('contention.sockets');
      var sockets = [];
      sockets.forEach(function (item, index, enumerable) {
        var socket = item.get('llc');
        var socketNumber = item.get('socket_number');
        message += '<br>' + 'Socket ' + socketNumber + ' Contention: ' + socket.get('value') + ' (' + socket.get('label') + ')';
      });
      return message;
    }
  }.property('value', 'label'),
  width: function() {
    // TODO: Can't use this reference
    //var numberOfSockets = App.Node.find(this._reference.parent.parent.parent.id).get('capabilities.sockets');
    var numberOfSockets = 0;
    var rangeMaximum = numberOfSockets * 50;
    if (this.get('value') === 0 || App.isEmpty(this.get('value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('value'), 0, rangeMaximum);
      return 'width:' + percent + '%;';
    }
  }.property('value')
});

App.ContentionSystem = DS.Model.extend({
  llc: DS.belongsTo('contentionSystemLlc')
});

App.Contention = DS.Model.extend({
  sockets: DS.hasMany('socket'),
  socketsSorted: function() {
    var socketsStore = this.get('sockets');
    socketsController = Ember.ArrayController.create({
      content: socketsStore,
      sortProperties: ['socket_number'],
      sortAscending: true
    });
    return socketsController;
  }.property('sockets'),
  node: DS.belongsTo('node'),
  system: DS.belongsTo('contentionSystem')
});

App.Socket = DS.Model.extend({
  llc: DS.belongsTo('llc'),
  contention: DS.belongsTo('contention'),
  socket_number: DS.attr('number')
});

App.Llc = DS.Model.extend({
  sockets: DS.belongsTo('socket'),
  value: DS.attr('number'),
  label: DS.attr('string'),
  styles: function() {
    return 'background-color: '+ App.rangeToColor(this.get('value'), 0, 50);
  }.property('value'),
  barWidth: function() {
    if (App.isEmpty(this.get('value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('value'), 0, 50);
      return 'width:' + percent + '%;';
    }
  }.property('value'),
  socketMessage: function() {
    if (this.get('value') == -1) {
       return '<strong>Socket LLC Contention Not Available</strong>';
    } else {
      return '<strong>Socket LLC Contention</strong><br>' + this.get('label') + '<br> Value: ' + this.get('value');
    }
  }.property('value', 'label')
});

App.Cpu = DS.Model.extend({
  iowait: DS.attr('number'),
  idle: DS.attr('number'),
  total: DS.attr('number'),
  steal: DS.attr('number'),
  guest: DS.attr('number')
});

App.NodeUtilization = DS.Model.extend({
  // Embedded Relationships
  cpu: DS.belongsTo('cpu'),
  // Properties
  ipc: DS.attr('number'),
  uptime: DS.attr('number'),                  // in seconds
  cpu_frequency_current: DS.attr('string'),
  memory: DS.attr('string'),
  gips_current: DS.attr('number'),            // GIPS = frequency * IPC
  gips_max: DS.attr('number'),
  //io: DS.attr('number'),                    // empty for beta
  //network: DS.attr('number')                // empty for beta
});

App.NodeCapabilities = DS.Model.extend({
  hyperthreading: DS.attr('boolean'),
  cores_per_socket: DS.attr('number'),
  cpu_frequency: DS.attr('string'),
  turbo_mode: DS.attr('boolean'),
  memory_size: DS.attr('string'),
  cpu_type: DS.attr('string'),
  cache_size: DS.attr('string'),
  sockets: DS.attr('number'),
  socketsEnum: function () {
    var socketsEnum = [];
    for (var i = 0; i < this.get('sockets'); i++) {
      socketsEnum.push(i);
    }
    return socketsEnum;
  }.property('sockets')
});

App.Vcpus = DS.Model.extend({
  used: DS.attr('number'),
  max: DS.attr('number')
});

App.VmInfo = DS.Model.extend({
  count: DS.attr('number'),
  max: DS.attr('number')
});

App.Memory = DS.Model.extend({
  used: DS.attr('number'),
  max: DS.attr('number')
});

App.Ids = DS.Model.extend({
  ip_address: DS.attr('string'),
  mac: DS.attr('string')
});


// Primary model
App.Node = DS.Model.extend({
  // Common Properties
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  isSelectedObserver: function() {
    if ((this.get('isSelected')) && (this.get('isAgentInstalled'))) {
      App.currentSelections.get('selectedNodes').addObject(this);
    } else {
      App.currentSelections.get('selectedNodes').removeObject(this);
    }
    App.contextualGraphs.propertyDidChange('selectedNodes');
    App.currentSelections.propertyDidChange('selectedNodes');
  }.observes('isSelected'),

  // Embedded Relationships
  status: DS.belongsTo('nodeStatus'),
  utilization: DS.belongsTo('nodeUtilization'),
  capabilities: DS.belongsTo('nodeCapabilities'),
  vcpus: DS.belongsTo('vcpus'),
  vmInfo: DS.belongsTo('vmInfo'),
  memory: DS.belongsTo('memory'),
  contention: DS.belongsTo('contention'),
  ids: DS.belongsTo('ids'),

  // Full Relationships
  vms: DS.hasMany('vm', {async: true}),
  nodeTrustReport: DS.belongsTo('nodeTrustReport'),
  trustNode: DS.belongsTo('trustNode'),

  didReload: function () {
    if (this.get('nodeTrustReport.isLoaded')) {
      this.get('nodeTrustReport').reload();
    }
  },

  // Properties from API
  name: DS.attr('string'),
  logsUrl: DS.attr('string'),
  tier: DS.attr('string'),
  samControlled: DS.attr('number'),  // 0: Not under SAM control (agent not installed), 1: SAM monitored, 2: SAM assured (can place SLA VMs on node)
  samRegistered: DS.attr('boolean'),
  schedulerMark: DS.attr('number'),
  schedulerPersistent: DS.attr('boolean'),

  // Computed properties
  isAgentInstalled: function () {
    return Boolean(this.get('samControlled'));
  }.property('samControlled'),
  isAssured: function () {
    return this.get('samControlled') === 2;
  }.property('samControlled'),
  assuredMessage: function () {
    return (this.get('isAssured')) ? 'This is an assured node. VMs with SLAs may be placed here.' : 'This is not an assured node. VMs with SLAs may not be placed here.';
  }.property('samControlled'),
  isTrustRegistered: function () {
    return (this.get('trustNode.ipaddress')) ? true : false;
  }.property('trustNode.ipaddress'),
  isTrustRegisteredMessage: function () {
    if (this.get('trustNode.ipaddress')) {
      return 'Currently registered with Trust Server';
    } else {
      return 'Not registered with Trust Server';
    }
  }.property('trustNode.ipaddress'),
  isOn: function () {
    return (this.get('status.operational') === App.ON);
  }.property('status.operational'),
  cpuFrequency: function () {
    // MHz to GHz conversion
    var mhz = this.get('capabilities.cpu_frequency');
    if (!!mhz) {
      var ghz = mhz.split(' ')[0] / 1000;
      return ghz + 'GHz';
    } else {
      return '';
    }
  }.property('cpu_frequency'),
  isScheduled: function () {
    return !Ember.isNone(this.get('schedulerMark'));
  }.property('schedulerMark'),
  scheduledMessage: function () {
    if (this.get('isScheduled')) {
      return 'VMs will be placed on this node\'s socket ' + this.get('schedulerMark') + '.';
    } else {
      return 'This node is not set for VM placement.';
    }
  }.property('schedulerMark', 'isScheduled'),
  healthMessage: function () {
    var healthMessage = '';
    if (!this.get('isAgentInstalled') && (this.get('status.health') === App.UNKNOWN) || App.isEmpty(this.get('status.health'))) {
      return 'Not under ' + App.application.get('title') + ' control';
    }
    if (App.isEmpty(this.get('status.short_message')) && App.isEmpty(this.get('status.long_message'))) {
      // If both short and long messages are empty, show health as message
      healthMessage = '<strong>Health</strong>: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else if (App.isEmpty(this.get('status.long_message'))) {  // Short message only
      healthMessage = this.get('status.short_message').capitalize();
    } else {  // Default to long message
      healthMessage = this.get('status.long_message').capitalize();
    }
    return healthMessage;
  }.property('status.health', 'status.long_message', 'status.short_message', 'isAgentInstalled'),

  // Observers
  graphObserver: function () {
    return App.graphs.graph(this.get('id'), this.get('name'), 'node');
  }.observes('isSelected', 'isExpanded')

});
