App.NodeController = Ember.ObjectController.extend({
  // Controller Properties
  isSelected: false,
  isExpanded: false,

  kibanaId: null,
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    if (this.get('isSelected')) {
      this.set('kibanaId', filterSrv.set({type:'field',mandate:'either', field: "host_id", query:JSON.stringify(this.get('id')) }) );
      dashboard.refresh();
    } else {
      filterSrv.remove(this.get('kibanaId'));
      dashboard.refresh();
    }
  }.observes('isSelected'),

  // Computed properties
  isAgentInstalled: Ember.computed.bool('samControlled'),
  isAssured: Ember.computed.equal('samControlled', 2),
  assuredMessage: function () {
    return (this.get('isAssured')) ? 'This is an assured node. VMs with SLAs may be placed here.' : 'This is not an assured node. VMs with SLAs may not be placed here.';
  }.property('samControlled'),
  isOn: Ember.computed.equal('status.operational', App.ON),
  cpuFrequency: function () {
    // MHz to GHz conversion
    var mhz = this.get('capabilities.cpu_frequency');
    if (!!mhz) {
      var ghz = mhz.split(' ')[0] / 1000;
      return ghz + 'GHz';
    } else {
      return '';
    }
  }.property('capabilities.cpu_frequency'),
  isScheduled: Ember.computed.notEmpty('schedulerMark'),
  scheduledMessage: function () {
    if (this.get('isScheduled')) {
      return 'VMs will be placed on this node\'s socket ' + this.get('schedulerMark') + '.';
    } else {
      return 'This node is not set for VM placement.';
    }
  }.property('schedulerMark', 'isScheduled'),
  isHealthy: Ember.computed.equal('status.health', App.SUCCESS),
  healthMessage: function () {
    if (!this.get('isAgentInstalled') && App.isEmpty(this.get('status.short_message'))) {
      return 'Not under ' + App.application.get('title') + ' control';
    }
    if (App.isEmpty(this.get('status.short_message'))) {
      // If status message is empty, just show health as a string
      return '<strong>Health</strong>: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else {
      return this.get('status.short_message').trim().replace('!', '.').capitalize();
    }
  }.property('status.short_message', 'status.health', 'isAgentInstalled'),
  operationalMessage: function () {
    return '<strong>State</strong>: ' + App.codeToOperational(this.get('status.operational')).capitalize();
  }.property('status.operational'),
  nodeType: function () {
    var services = this.get('cloudServices').mapBy('name');
    if (services.length < 1) return 'generic';
    if (services.indexOf('compute') !== -1) return 'compute';
    if (services.indexOf('networking') !== -1) return 'networking';
    if (services.indexOf('storage') !== -1) return 'storage';
    return 'generic';
    //return services.objectAt(0);
  }.property('cloudServices'),
  nodeTypeLink: function () {
    return '/images/nodes/' + this.get('nodeType') + '.svg';
  }.property('nodeType'),
  servicesMessage: function () {
    if (!this.get('cloudServices')) return null;
    return '<strong>Services:</strong><br>' + this.get('cloudServices').map(function (item, index, enumerable) {
      return item.name.toString().capitalize() + ': ' + App.overallHealth(item.health, item.operational).capitalize();
    }).join('<br>');
  }.property('cloudServices'),
  isTrustRegistered: Ember.computed.bool('trustNode'),
  isTrustRegisteredMessage: function () {
    if (this.get('isTrustRegistered')) {
      return 'Currently registered with Trust Server';
    } else {
      return 'Not registered with Trust Server';
    }
  }.property('isTrustRegistered'),
  isTrusted: Ember.computed.equal('status.trust', App.TRUSTED),
  isTrustUnknown: Ember.computed.not('status.trust'),
  trustMessage: function () {
    var message = '';
    if (this.get('status.trust') === App.UNKNOWN) {
      message = 'Trust Status: Unknown';
    } else if (this.get('status.trust') === App.UNTRUSTED) {
      message = 'Trust Status: Not Trusted';
    } else if (this.get('status.trust') === App.TRUSTED) {
      message = 'Trust Status: Trusted';
    } else if (this.get('status.trust') === App.UNREGISTERED) {
      message = 'Trust Status: Not Registered';
    }
    message += '<br>' + 'BIOS: ' + App.trustDetailsToString(this.get('status.trust_details.bios'));
    message += '<br>' + 'VMM: ' + App.trustDetailsToString(this.get('status.trust_details.vmm'));
    if (this.get('status.trust') === App.UNTRUSTED) message += '<br><em>Note: Check PCR Logs tab for details.</em>';
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
