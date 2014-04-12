App.NodeController = Ember.ObjectController.extend({
  needs: ['nodes', 'logBar', 'application'],
  // Controller Properties

  isSelected: false,
  isExpanded: false,
  isActionPending: false,
  isRebooting: false,

  nodeActions: function() {
    return  [
      App.ActionController.create({
        name: 'Export Trust Report',
        method: 'exportTrustReport',
        icon: 'icon-external-link',
        disabledWhileRebooting: false,
        sortOrder: 0,
        node: this
      }),
      App.ActionController.create({
        name: 'Remove Trust',
        method: 'removeTrust',
        icon: 'icon-unlock',
        disabledWhileRebooting: true,
        sortOrder: 1,
        node: this
      }),
      App.ActionController.create({
        name: 'Add Trust',
        method: 'addTrust',
        icon: 'icon-lock',
        disabledWhileRebooting: true,
        sortOrder: 2,
        node: this
      }),
      App.ActionController.create({
        name: 'Fingerprint',
        method: 'trustFingerprint',
        icon: 'icon-hand-up',
        disabledWhileRebooting: true,
        sortOrder: 3,
        node: this
      }),
      App.ActionController.create({
        name: 'Configure Trust Agent',
        method: 'configureTrustAgent',
        icon: 'icon-unlock-alt',
        disabledWhileRebooting: true,
        sortOrder: 4,
        node: this
      }),
      App.ActionController.create({
        name: 'Unregister',
        method: 'unregister',
        icon: 'icon-remove',
        disabledWhileRebooting: false,
        sortOrder: 7,
        node: this
      }),
      App.ActionController.create({
        name: 'Set agent mode to monitored',
        method: 'setMonitored',
        icon: 'icon-eye-open',
        disabledWhileRebooting: true,
        sortOrder: 8,
        node: this
      }),
      App.ActionController.create({
        name: 'Set agent mode to assured',
        method: 'setAssured',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 9,
        node: this
      }),
      App.ActionController.create({
        name: 'Place VMs on Socket',
        method: 'schedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: true,
        sortOrder: 6,
        node: this
      }),
      App.ActionController.create({
        name: 'Unset for VM placement',
        method: 'unschedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: false,
        sortOrder: 5,
        node: this
      })
    ];
  }.property('@each', 'App.mtWilson.isInstalled'),

  nodeActionsAreAvailable: function() {
    return this.get('nodeActions') && this.get('nodeActions').filterBy('isListItem', true).length > 0;
  }.property('nodeActions.@each'),

  updateKibana: function() {
    var self = this;
    if (!frames['allLogsFrame'] || !frames['allLogsFrame'].angular) return;
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    var nodeId = ((this.get('id'))?this.get('id').toString():'');

    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaNodesQuery').push('host_id: \"'+nodeId+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaNodesQuery').join(' OR ') + ")"
      }, fieldId);

      this.set('controllers.logBar.kibanaFieldIds.nodes', newFieldId);
      dashboard.refresh();

    } else {

      var inArray = $.inArray('host_id: \"'+nodeId+'\"', this.get('controllers.logBar.kibanaNodesQuery'));
      if (inArray !== -1) {
        this.get('controllers.logBar.kibanaNodesQuery').removeAt(inArray);
        var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
        var newFieldId = filterSrv.set({
          type:'querystring',
          mandate:'must',
          query:"(" + this.get('controllers.logBar.kibanaNodesQuery').join(' OR ') + ")"
        }, fieldId);
        this.set('controllers.logBar.kibanaFieldIds.nodes', newFieldId);

        if (this.get('controllers.logBar.kibanaNodesQuery').length < 1) {
          filterSrv.remove(this.get('controllers.logBar.kibanaFieldIds.nodes'));
          this.set('controllers.logBar.kibanaFieldIds.nodes', null);
        }
        dashboard.refresh();
      }
    }
  }.observes('isSelected'),

  // Computed properties
  isAgentInstalled: Ember.computed.bool('samControlled'),
  isMonitored: Ember.computed.equal('samControlled', App.MONITORED),
  isAssured: Ember.computed.equal('samControlled', App.ASSURED),
  isSelectable: function() {
    return this.get('isAgentInstalled');
  }.property('isAgentInstalled'),
  nodeTypeMessage: function () {
    if (this.get('isAssured')) {
      return 'This is an assured node. VMs with SLAs may be placed here.';
    } else if (this.get('isMonitored')) {
      return 'This is a monitored node. SAA will monitor this node, but VMs with SLAs may not be placed here.';
    } else {
      return 'This is not an assured node. VMs with SLAs may not be placed here.';
    }
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
  isHealthy: function() {
    return (this.get('status.health') == App.SUCCESS) || (this.get('status.health') == App.INFO);
  }.property('status.health'),
  isUnhealthy: Ember.computed.not('isHealthy'),
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
  }.property('cloudServices'),
  servicesClass: function () {
    return 'icon-' + this.get('nodeType');
  }.property('nodeType'),
  servicesMessage: function () {
    if (!this.get('cloudServices')) return null;
    return '<strong>Services:</strong><br>' + this.get('cloudServices').map(function (item, index, enumerable) {
      return item.name.toString().capitalize() + ': ' + App.overallHealth(item.health, item.operational).capitalize();
    }).join('<br>');
  }.property('cloudServices'),

  isTrustRegistered: Ember.computed.bool('trustNode'),
  isTrusted: Ember.computed.equal('status.trust_status.trust', App.TRUSTED),
  isUntrusted: Ember.computed.equal('status.trust_status.trust', App.UNTRUSTED),
  isTrustUnknown: Ember.computed.not('status.trust_status.trust'),

  isTrustAgentInstalled: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_TRUE),
  isTrustAgentNotInstalled: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_FALSE),
  isTrustAgentUnknown: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_UNKNOWN),

  isTrustAgentNotInstalledOrUnknown: function() {
    return this.get('isTrustAgentNotInstalled') || this.get('isTrustAgentUnknown') || !(this.get('isTrustAgentInstalled'));
  }.property('isTrustAgentNotInstalled', 'isTrustAgentUnknown'),

  isTrustRegisteredMessage: function () {
    if (this.get('isTrustRegistered')) {
      return 'Currently registered with Trust Server' + this.get('trustAgentMessage');
    } else {
      return 'Not registered with Trust Server' + this.get('trustAgentMessage');
    }
  }.property('isTrustRegistered'),

  trustMessage: function () {
    var message = 'Trust Status: ' + App.trustToString(this.get('status.trust_status.trust')).capitalize();
    message += '<br>' + 'BIOS: ' + App.trustToString(this.get('status.trust_status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + App.trustToString(this.get('status.trust_status.trust_details.vmm')).capitalize();
    if (this.get('isUntrusted')) message += '<br><em>Note: Check PCR Logs tab for details.</em>';
    message +=  this.get('trustAgentMessage');
    return message;
  }.property('status.trust_status.trust'),

  trustAgentMessage: function() {
    var message = '<hr style="margin:2px">';
    message += '<ul class="hover-list">';
      message += '<li>Trust Config = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config')).capitalize() + '</li>';
      message += '<ul class="hover-list">';
        message += '<li> TPM Enabled = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tpm_enabled')).capitalize() + '</li>';
        message += '<li> Tboot Measured Launch = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tboot_measured_launch')).capitalize() + '</li>';
        message += '<li> Trust Agent </li>';
        message += '<ul>'
          message += '<li> Installed = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_installed')).capitalize() + '</li>';
          message += '<li> Running = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_running')).capitalize() + '</li>';
          message += '<li> Paired = ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_paired')).capitalize() + '</li>';
          message += '<li> Actual Version = ' + App.na(this.get('status.trust_status.trust_config_details.tagent_actual_version')) + '</li>';
          message += '<li> Expected Version = ' + App.na(this.get('status.trust_status.trust_config_details.tagent_expected_version')) + '</li>';
        message += '</ul>';
      message += '</ul>';
    message += '</ul>';

    if (!this.get('isTrustAgentInstalled')) { return message; } else { return ''; }
  }.property('status.trust_status.trust_config_details.tagent_expected_version', 'status.trust_status.trust_config_details.tagent_actual_version', 'status.trust_status.trust_config_details.tagent_paired', 'status.trust_status.trust_config_details.tagent_running', 'status.trust_status.trust_config_details.tagent_installed', 'status.trust_status.trust_config_details.tboot_measured_launch', 'status.trust_status.trust_config_details.tpm_enabled', 'status.trust_status.trust_config_details.trust_config'),

  computeMessage: function() {
    if (App.isEmpty(this.get('utilization.scu_current'))) {
      return '<strong>SAA Compute Units</strong>: N/A';
    } else {
      return 'SAA Compute Units: ' + this.get('utilization.scu_current') + ' out of ' + this.get('utilization.scu_max') + ' SU';
    }
  }.property('utilization.scu_current', 'utilization.scu_max'),
  computeWidth: function () {
    if (this.get('utilization.scu_current') === 0 || App.isEmpty(this.get('utilization.scu_current'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('utilization.scu_current'), 0, this.get('utilization.scu_max'));
      return 'width:' + percent + '%;';
    }
  }.property('utilization.scu_current', 'utilization.scu_max'),
  computeExists: Ember.computed.notEmpty('utilization.scu_current'),

  hasContention: Ember.computed.notEmpty('contention.system.llc.value'),
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

  // Icons for list view table
  servicesIcon: function () {
    return '<i class="icon-' + this.get('nodeType') + '" title="' + this.get('servicesMessage') + '"></i>';
  }.property('nodeType', 'servicesMessage'),
  trustIcon: function () {
    // TODO: trustMessage and isTrustRegisteredMessage
    if (this.get('isTrustRegistered')) {
      if (this.get('isTrustUnknown')) {
        return '<i class="icon-large icon-question-sign unknown"></i>';
      } else {
        if (this.get('isTrusted')) {
          return '<i class="icon-large icon-lock trusted"}}></i>';
        } else {
          return '<i class="icon-large icon-unlock untrusted"}}></i>';
        }
      }
    } else {
      return '<i class="icon-large icon-unlock unregistered"></i>';
    }
  }.property('isTrustRegistered', 'isTrustUnknown', 'isTrusted'),
  scheduledIcon: function () {
    // TODO: scheduledMessage
    if (this.get('isScheduled')) {
      return '<i class="icon-magnet"></i>';
    } else {
      return '';
    }
  }.property('isScheduled'),

  // Observers
  graphObserver: function () {
    return App.graphs.graph(this.get('id'), this.get('name'), 'node', this.get('capabilities.sockets'));
  }.observes('isSelected', 'isExpanded'),

  actions: {
    exportTrustReport: function (model) {
      this.get('controllers.nodes').send('exportTrustReport', model);
    }
  }

});

App.NodesNodeController = App.NodeController.extend();

App.ServiceController = Ember.ObjectController.extend({
  nodeType: function () {
    var name = this.get('name');
    if (name.length < 1) {
      return 'generic';
    } else {
      return name;
    }
    return 'generic';
  }.property('name'),
  nodeTypeClass: function () {
    return 'icon-' + this.get('nodeType');
  }.property('nodeType'),
  overallHealth: function() {
     return App.overallHealth(health, operational);
  }.property(),
  healthMessage: function() {
    return 'Healthy State: ' + App.priorityToType(this.get('health')).capitalize();
  }.property('health'),
  operationalMessage: function() {
    return 'Operational State: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational')

});

App.ActionController = Ember.ObjectController.extend({
  isDisabled: function() {
    return this.get('node.isRebooting') && this.get('disabledWhileRebooting');
  }.property('node.@each', 'node.isRebooting'),
  isListItem: function() {
    switch (this.get('method')) {
      case 'exportTrustReport':
        return App.mtWilson.get('isInstalled');
      case 'removeTrust':
        return (App.mtWilson.get('isInstalled')) ? this.get('node.isTrustRegistered') : false;
      case 'addTrust':
        return (App.mtWilson.get('isInstalled')) ? !this.get('node.isTrustRegistered') : false;
      case 'trustFingerprint':
        return App.mtWilson.get('isInstalled');
      case 'configureTrustAgent':
        return App.mtWilson.get('isInstalled');
      case 'unschedule':
        return this.get('node.isScheduled');
      case 'schedule':
        return false;
      case 'unregister':
        return this.get('node.samRegistered');
      case 'setMonitored':
        return this.get('node.isAgentInstalled') && !this.get('node.isMonitored');
      case 'setAssured':
        return this.get('node.isAgentInstalled') && !this.get('node.isAssured');
      default:
        return false;
    }
  }.property('node.isAssured', 'node.isMonitored', 'node.samRegistered', 'node.isScheduled', 'node.isTrustRegistered'),

  additionalListItems: function() {
    var additionalListItems = [];
    if (this.get('method') == 'schedule') {
      if (this.get('node') && !this.get('node.isScheduled')) {
        this.get('node.socketsEnum').forEach( function(item, index, enumerable) {
          additionalListItems.push('<li {{bind-attr class="isDisabled:disabled"}}><a {{action "performAction" method contextNode '+item+'}}><i class="icon-magnet"></i> Place VMs on Socket '+item+'</a></li>');
        });
        return Ember.View.extend({
          tagName: '',
          template: Ember.Handlebars.compile(additionalListItems.join(''))
        });
      } else {
        return false;
      }
    }
  }.property('node.socketsEnum.@each', 'node.isScheduled'),

  actions: {
    performAction: function(method, contextNode, socket) {
      if (method == 'schedule') {
        contextNode.get('parentController').send(method, contextNode, socket);
      } else {
        contextNode.get('parentController').send(method, contextNode);
      }
    }
  }

});

