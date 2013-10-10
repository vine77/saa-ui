App.NodeController = Ember.ObjectController.extend({
  // Controller Properties
  isSelected: false,
  isExpanded: false,

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
    if (!this.get('isAgentInstalled') && App.isEmpty(this.get('status.short_message'))) {
      return 'Not under ' + App.application.get('title') + ' control';
    }
    if (App.isEmpty(this.get('status.short_message'))) {
      // If status message is empty, just show health as a string
      return '<strong>Health</strong>: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else {
      return this.get('status.short_message').capitalize();
    }
  }.property('status.short_message', 'status.health', 'isAgentInstalled'),
  operationalMessage: function () {
    return '<strong>State</strong>: ' + App.codeToOperational(this.get('status.operational')).capitalize();
  }.property('status.operational'),
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
  isTrusted: Ember.computed.equal('status.trust', 2),
  isNotTrusted: Ember.computed.equal('status.trust', 1),
  isTrustUnknown: Ember.computed.not('status.trust'),
  trustMessage: function () {
    var message = '';
    if (this.get('status.trust') === 0) {
      message = 'Trust Status: Unknown.';
    } else if (this.get('status.trust') === 1) {
      message = 'Trust Status: Not Trusted';
    } else if (this.get('status.trust') === 2) {
      message = 'Trust Status: Trusted';
    }
    message += '<br>' + 'BIOS: ' + App.trustDetailsToString(this.get('status.trust_details.bios'));
    message += '<br>' + 'VMM: ' + App.trustDetailsToString(this.get('status.trust_details.vmm'));
    return message;
  }.property('status.trust'),
  contentionFormatted: function () {
    return Math.round(this.get('contention.system.llc.value') * 100) / 100;
  }.property('contention.system.llc.value'),
  contentionMessage: function() {
    if (App.isEmpty(this.get('contention.system.llc.value'))) {
      return '<strong>System LLC Contention</strong>: N/A';
    } else {
      var message = 'Overall LLC Contention: ' + this.get('contention.system.llc.value') + ' (' + this.get('contention.system.llc.label') + ')';
      var sockets = this.get('contention.sockets');
      var j = sockets.length;
      for (var i = 0; i < j; i++) {
        var socket = sockets.findBy('socket_number', i);
        if (!socket) {
          j++;
        } else {
          message += '<br>' + 'Socket ' + socket.socket_number + ' Contention: ' + socket.llc.value + ' (' + socket.llc.label + ')';
        }
      }
      return message;
    }
  }.property('contention'),
  contentionWidth: function () {
    if (this.get('contention.system.llc.value') === 0 || App.isEmpty(this.get('contention.system.llc.value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('contention.system.llc.value'), 0, 50);
      return 'width:' + percent + '%;';
    }
  }.property('contention.system.llc.value'),
  socketsEnum: function () {
    var socketsEnum = [];
    for (var i = 0; i < this.get('capabilities.sockets'); i++) {
      socketsEnum.push(i);
    }
    return socketsEnum;
  }.property('capabilities.sockets'),

  // Observers
  graphObserver: function () {
    return App.graphs.graph(this.get('id'), this.get('name'), 'node');
  }.observes('isSelected', 'isExpanded'),

  // Actions
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
        this.transitionToRoute('nodesNode', model);
      } else {
        this.transitionToRoute('nodes');
      }
    }
  }

});
