import Ember from 'ember';
import ActionController from './action';
import Health from '../utils/mappings/health';
import Operational from '../utils/mappings/operational';
import Trust from '../utils/mappings/trust';
import TrustConfig from '../utils/mappings/trust-config';
import Mode from '../utils/mappings/mode';
import codeToTrustConfig from '../utils/convert/code-to-trust-config';
import codeToMode from '../utils/convert/code-to-mode';
import priorityToType from '../utils/convert/priority-to-type';
import typeToSortOrder from '../utils/convert/type-to-sort-order';
import codeToOperational from '../utils/convert/code-to-operational';
import overallHealth from '../utils/convert/overall-health';
import trustToString from '../utils/convert/trust-to-string';
import rangeToPercentage from '../utils/convert/range-to-percentage';
import isEmpty from '../utils/is-empty';
import readableSizeToBytes from '../utils/readable-size-to-bytes';
import readableSize from '../utils/readable-size';
import na from '../utils/na';
import application from '../models/application';
import graphs from '../models/graphs';

export default Ember.ObjectController.extend({
  needs: ['nodes', 'logBar', 'application'],
  // Controller Properties

  isSelected: false,
  isExpanded: false,
  isActionPending: false,
  isRebooting: false,

  nodeActions: function() {
    return  [
      ActionController.create({
        name: 'Export Trust Report',
        method: 'exportTrustReport',
        icon: 'icon-external-link',
        disabledWhileRebooting: false,
        sortOrder: 0,
        node: this
      }),
      ActionController.create({
        name: 'Remove Trust',
        method: 'removeTrust',
        icon: 'icon-unlock',
        disabledWhileRebooting: true,
        sortOrder: 1,
        node: this
      }),
      ActionController.create({
        name: 'Add Trust',
        method: 'addTrust',
        icon: 'icon-lock',
        disabledWhileRebooting: true,
        sortOrder: 2,
        node: this
      }),
      ActionController.create({
        name: 'Fingerprint',
        method: 'trustFingerprint',
        icon: 'icon-hand-up',
        disabledWhileRebooting: true,
        sortOrder: 3,
        node: this
      }),
      ActionController.create({
        name: 'Configure Trust Agent',
        method: 'configureTrustAgent',
        icon: 'icon-unlock-alt',
        disabledWhileRebooting: true,
        sortOrder: 4,
        node: this
      }),
      ActionController.create({
        name: 'Unregister',
        method: 'unregister',
        icon: 'icon-remove',
        disabledWhileRebooting: false,
        sortOrder: 6,
        node: this
      }),
      ActionController.create({
        name: 'Change agent mode to monitored',
        method: 'setMonitored',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 7,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to assured (per-vCPU SCUs)',
        method: 'setAssuredVcpu',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 8,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to assured (per-VM SCUs)',
        method: 'setAssuredVm',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 9,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to assured (exclusive cores)',
        method: 'setAssuredCores',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 10,
        node: this
      }),
      ActionController.create({
        name: 'Place VMs on Socket',
        method: 'schedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: true,
        sortOrder: 6,
        node: this
      }),
      ActionController.create({
        name: 'Unset for VM placement',
        method: 'unschedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: false,
        sortOrder: 5,
        node: this
      })
    ];
  }.property('@each', 'mtWilson.isInstalled'),

  utilizationCoresCgroups: function() {
    return this.get('utilization.cores.cgroups');
  }.property('utilization.cores.cgroups.@each'),
  hasCores: function() {
    return (this.get('osCores') > 1 && this.get('vmCores') > 1);
  }.property('osCores'),

  osCores: function() {
    return this.get('utilizationCoresCgroups') && this.get('utilizationCoresCgroups').findBy('type', 'os').used.length;
  }.property('utilizationCoresCgroups.@each'),
  vmCores: function() {
    return this.get('utilizationCoresCgroups') && this.get('utilizationCoresCgroups').findBy('type', 'vm').used.length;
  }.property('utilizationCoresCgroups.@each'),
  sixWindCores: function() {
    return this.get('utilizationCoresCgroups') && this.get('utilizationCoresCgroups').findBy('type', '6Wind').used.length;
  }.property('utilizationCoresCgroups.@each'),

  scuUtilizationCgroups: function() {
    return this.get('utilization.scu.cgroups');
  }.property('utilization.scu.cgroups.@each'),

  contentionCgroups: function() {
    return this.get('contention.cgroups');
  }.property('contention.cgroups.@each'),
  osContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', 'os');
  }.property('contentionCgroups'),
  vmContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', 'vm');
  }.property('contentionCgroups'),
  sixWindContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', '6Wind');
  }.property('contentionCgroups'),

  scuOsUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', 'os');
  }.property('scuUtilizationCgroups'),
  scuTooltip: function() {
    return '<strong> SCU Usage </strong>' + '<br>' +
    '<strong>System:</strong> ' + this.get('utilization.scu.system.value') + ' out of ' + this.get('utilization.scu.system.max') + '<br>' +
    ((!!this.get('scuOsUtilization.max'))?'<strong>OS: </strong>' + this.get('scuOsUtilization.value') + ' out of ' + this.get('scuOsUtilization.max'):'') + '<br>' +
    ((!!this.get('scu6WindUtilization.max'))?'<strong> 6Wind: </strong>' + this.get('scu6WindUtilization.value') + ' out of ' + this.get('scu6WindUtilization.max'):'') + '<br>' +
    ((!!this.get('scuVmUtilization.max'))?'<strong>VM: </strong>' + this.get('scuVmUtilization.value') + ' out of ' + this.get('scuVmUtilization.max'):'') + '<br>' +
    ((!!this.get('scuUnallocated'))?'<strong> Unallocated:</strong> ' + this.get('scuUnallocated').toFixed(2):'');
  }.property('utilization.scu.system.value', 'utilization.scu.system.max', 'scuOsUtilization.max', 'scu6WindUtilization.max', 'scuUnallocated'),
  contentionTooltip: function() {
    return this.get('contentionMessage') + '<br>' +
    ((!!this.get('osContention.max'))?'<strong> OS Contention </strong>' + this.get('osContention.value') + ' out of ' + this.get('osContention.max'):'') + '<br>' +
    ((!!this.get('vmContention.max'))?'<strong> VM Contention </strong>' + this.get('vmContention.value') + ' out of ' + this.get('vmContention.max'):'') + '<br>' +
    ((!!this.get('sixWindContention.max'))?'<strong> 6Wind Contention </strong>' + this.get('sixWindContention.value') + ' out of ' + this.get('sixWindContention.max'):'');
  }.property('contentionMessage', 'vmContention.max', 'osContention.max', 'sixWindContention.max'),
  scuUnallocated: function() {
    return this.get('utilization.scu.system.max') - this.get('utilization.scu.cgroups').reduce(function(previousValue, item) { return previousValue + item.max; }, 0);
  }.property('utilization.scu.system.max', 'utilization.scu.cgroups.@each'),
  scuValues: function() {
    var returnArray = [];
    if (this.get('scuUtilizationCgroups')) {
      this.get('scuUtilizationCgroups').forEach(function(item, index, enumerable) {
        returnArray.push({
          min: item.min,
          max: item.max,
          value: item.value,
          sortOrder: typeToSortOrder(item.type)
        });
      });
      returnArray.push({
        min: 0,
        max: this.get('scuUnallocated').toFixed(2),
        value: this.get('scuUnallocated').toFixed(2),
        color: "progress-neutral",
        sortOrder: 9999
      });
    }
    return returnArray.sortBy('sortOrder');
  }.property('scuUtilizationCgroups', 'scuUnallocated'),

  contentionValues: function() {
    var returnArray = [];
    if (this.get('contentionCgroups')) {
      this.get('contentionCgroups').forEach(function(item, index, enumerable) {
        returnArray.push({
          min: item.min,
          max: item.max,
          value: item.value,
          sortOrder: typeToSortOrder(item.type)
        });
      });
    }
    return returnArray;
  }.property('contentionCgroups'),

  scuVmUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', 'vm');
  }.property('scuUtilizationCgroups'),
  scu6WindUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', '6wind');
  }.property('scuUtilizationCgroups'),

  nodeActionsAreAvailable: function() {
    return this.get('nodeActions') && this.get('nodeActions').filterBy('isListItem', true).length > 0;
  }.property('nodeActions.@each'),

  updateKibana: function() {
    if (!frames['allLogsFrame'] || !frames['allLogsFrame'].angular) return;
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    var nodeId = ((this.get('id'))?this.get('id').toString():'');
    var fieldId, newFieldId;
    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaNodesQuery').push('host_id: \"'+nodeId+'\"');
      fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
      newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaNodesQuery').join(' OR ') + ")"
      }, fieldId);
      this.set('controllers.logBar.kibanaFieldIds.nodes', newFieldId);
      dashboard.refresh();
    } else {
      var inArray = Ember.$.inArray('host_id: \"'+nodeId+'\"', this.get('controllers.logBar.kibanaNodesQuery'));
      if (inArray !== -1) {
        this.get('controllers.logBar.kibanaNodesQuery').removeAt(inArray);
        fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
        newFieldId = filterSrv.set({
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
  maxMemory: function() {
    return Math.round(100 * parseFloat(readableSizeToBytes(this.get('utilization.memory')) ) / this.get('maxMemory'));
  }.property('utilization.memory', 'maxMemory'),
  percentOfMemory: function() {
    return Math.round(100 * parseFloat(readableSizeToBytes(this.get('utilization.memory')) ) / parseFloat( readableSizeToBytes(this.get('capabilities.memory_size'))));
  }.property('utilization.memory', 'memory.max'),
  percentOfMemoryWidth: function() {
    return 'width:'+this.get('percentOfMemory')+'%';
  }.property('percentOfMemory'),
  percentOfMemoryMessage: function() {
    return readableSize(this.get('utilization.memory')) + ' used out of ' + readableSize(this.get('capabilities.memory_size'));
  }.property('utilization.memory', 'capabilities.memory_size'),
  percentOfMemoryAvailable: function() {
    if (isNaN(this.get('percentOfMemory')) || this.get('maxMemory') <= 0) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfMemory', 'maxMemory'),

  // Computed properties
  isAgentInstalled: Ember.computed.bool('samControlled'),
  isMonitored: Ember.computed.equal('samControlled', Mode.MONITORED),
  isAssured: function() {
    switch(this.get('samControlled')) {
      case '2':
      case 2:
        return true;
      case '3':
      case 3:
        return true;
      case '4':
      case 4:
        return true;
      default:
       return false;
    }
  }.property('samControlled'),
  isSelectable: function() {
    return this.get('isAgentInstalled');
  }.property('isAgentInstalled'),
  nodeTypeMessage: function() {
    if (this.get('isAssured')) {
      return 'This is an assured node. Assured type: ' + codeToMode(this.get('samControlled')) + '. VMs with SLAs may be placed here.';
    } else if (this.get('isMonitored')) {
      return 'This is a monitored node. SAA will monitor this node, but VMs with SLAs may not be placed here.';
    } else {
      return 'This is not an assured node. VMs with SLAs may not be placed here.';
    }
  }.property('samControlled'),
  isOn: Ember.computed.equal('status.operational', Operational.ON),
  cpuFrequency: function() {
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
  scheduledMessage: function() {
    if (this.get('isScheduled')) {
      return 'VMs will be placed on this node\'s socket ' + this.get('schedulerMark') + '.';
    } else {
      return 'This node is not set for VM placement.';
    }
  }.property('schedulerMark', 'isScheduled'),
  isHealthy: function() {
    return (this.get('status.health') === Health.SUCCESS) || (this.get('status.health') === Health.INFO);
  }.property('status.health'),
  isUnhealthy: Ember.computed.not('isHealthy'),
  healthMessage: function() {
    if (!this.get('isAgentInstalled') && isEmpty(this.get('status.short_message'))) {
      return 'Not under ' + application.get('title') + ' control';
    }
    if (isEmpty(this.get('status.short_message'))) {
      // If status message is empty, just show health as a string
      return '<strong>Health</strong>: ' + priorityToType(this.get('status.health')).capitalize();
    } else {
      return this.get('status.short_message').trim().replace('!', '.').capitalize();
    }
  }.property('status.short_message', 'status.health', 'isAgentInstalled'),
  operationalMessage: function() {
    return '<strong>State</strong>: ' + codeToOperational(this.get('status.operational')).capitalize();
  }.property('status.operational'),
  nodeType: function() {
    var services = this.get('cloudServices').mapBy('name');
    if (services.length < 1) return 'generic';
    if (services.indexOf('assured-scu-vcpu') !== -1) return 'assured-scu-vcpu';
    if (services.indexOf('networking') !== -1) return 'networking';
    if (services.indexOf('storage') !== -1) return 'storage';
    return 'generic';
  }.property('cloudServices'),
  servicesClass: function() {
    return 'icon-' + this.get('nodeType');
  }.property('nodeType'),
  servicesMessage: function() {
    if (!this.get('cloudServices')) return null;
    return '<strong>Services:</strong><br>' + this.get('cloudServices').map(function(item, index, enumerable) {
      return item.name.toString().capitalize() + ': ' + overallHealth(item.health, item.operational).capitalize();
    }).join('<br>');
  }.property('cloudServices'),

  isTrustRegistered: Ember.computed.bool('trustNode'),
  isTrusted: Ember.computed.equal('status.trust_status.trust', Trust.TRUSTED),
  isUntrusted: Ember.computed.equal('status.trust_status.trust', Trust.UNTRUSTED),
  isTrustUnknown: Ember.computed.not('status.trust_status.trust'),

  isTrustAgentInstalled: Ember.computed.equal('status.trust_status.trust_config', TrustConfig.TRUE),
  isTrustAgentNotInstalled: Ember.computed.equal('status.trust_status.trust_config', TrustConfig.FALSE),
  isTrustAgentUnknown: Ember.computed.equal('status.trust_status.trust_config', TrustConfig.UNKNOWN),

  isTrustAgentNotInstalledOrUnknown: function() {
    return this.get('isTrustAgentNotInstalled') || this.get('isTrustAgentUnknown') || !(this.get('isTrustAgentInstalled'));
  }.property('isTrustAgentNotInstalled', 'isTrustAgentUnknown'),

  isTrustRegisteredMessage: function() {
    if (this.get('isTrustRegistered')) {
      return 'Currently registered with Trust Server' + this.get('trustAgentMessage');
    } else {
      return 'Not registered with Trust Server' + this.get('trustAgentMessage');
    }
  }.property('isTrustRegistered'),

  trustMessage: function() {
    var message = 'Trust Status: ' + trustToString(this.get('status.trust_status.trust')).capitalize();
    message += '<br>' + 'BIOS: ' + trustToString(this.get('status.trust_status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + trustToString(this.get('status.trust_status.trust_details.vmm')).capitalize();
    if (this.get('isUntrusted')) message += '<br><em>Note: Check PCR Logs tab for details.</em>';
    message +=  this.get('trustAgentMessage');
    return message;
  }.property('status.trust_status.trust'),

  trustAgentMessage: function() {
    var message = '<hr style="margin:2px">';
    message += '<ul class="hover-list">';
      message += '<li>Trust Config = ' + codeToTrustConfig(this.get('status.trust_status.trust_config')).capitalize() + '</li>';
      message += '<ul class="hover-list">';
        message += '<li> TPM Enabled = ' + codeToTrustConfig(this.get('status.trust_status.trust_config_details.tpm_enabled')).capitalize() + '</li>';
        message += '<li> Tboot Measured Launch = ' + codeToTrustConfig(this.get('status.trust_status.trust_config_details.tboot_measured_launch')).capitalize() + '</li>';
        message += '<li> Trust Agent </li>';
        message += '<ul>';
          message += '<li> Installed = ' + codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_installed')).capitalize() + '</li>';
          message += '<li> Running = ' + codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_running')).capitalize() + '</li>';
          message += '<li> Paired = ' + codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_paired')).capitalize() + '</li>';
          message += '<li> Actual Version = ' + na(this.get('status.trust_status.trust_config_details.tagent_actual_version')) + '</li>';
          message += '<li> Expected Version = ' + na(this.get('status.trust_status.trust_config_details.tagent_expected_version')) + '</li>';
        message += '</ul>';
      message += '</ul>';
    message += '</ul>';

    if (!this.get('isTrustAgentInstalled')) { return message; } else { return ''; }
  }.property('status.trust_status.trust_config_details.tagent_expected_version', 'status.trust_status.trust_config_details.tagent_actual_version', 'status.trust_status.trust_config_details.tagent_paired', 'status.trust_status.trust_config_details.tagent_running', 'status.trust_status.trust_config_details.tagent_installed', 'status.trust_status.trust_config_details.tboot_measured_launch', 'status.trust_status.trust_config_details.tpm_enabled', 'status.trust_status.trust_config_details.trust_config'),

  computeMessage: function() {
    if (isEmpty(this.get('utilization.scus.total.current'))) {
      return '<strong>SAA Compute Units</strong>: N/A';
    } else {
      return 'SAA Compute Units: ' + this.get('utilization.scus.total.current') + ' out of ' + this.get('utilization.scus.total.max') + ' SCU';
    }
  }.property('utilization.scus.total.current', 'utilization.scus.total.max'),
  computeWidth: function() {
    if (this.get('utilization.scus.total.current') === 0 || isEmpty(this.get('utilization.scus.total.current'))) {
      return 'display:none;';
    } else {
      var percent = rangeToPercentage(this.get('utilization.scus.total.current'), 0, this.get('utilization.scus.total.max'));
      return 'width:' + percent + '%;';
    }
  }.property('utilization.scus.total.current', 'utilization.scus.total.max'),
  computeExists: Ember.computed.notEmpty('utilization.scu.system.value'),

  hasContention: Ember.computed.notEmpty('contention.system.llc.value'),
  contentionFormatted: function() {
    return Math.round(this.get('contention.system.llc.value') * 100) / 100;
  }.property('contention.system.llc.value'),
  contentionMessage: function() {
    if (isEmpty(this.get('contention.system.llc.value'))) {
      return '<strong>System LLC Contention</strong>: N/A';
    } else {
      var message = 'Overall LLC Contention: ' + this.get('contention.system.llc.value') + ' (' + this.get('contention.system.llc.label') + ')';
      var sockets = this.get('contention.sockets');
      if (!Ember.isArray(sockets) || sockets.length === 0) return message;
      return message + '<br>' + sockets.map(function(socket) {
        return 'Socket ' + socket.socket_number + ' Contention: ' + socket.llc.value + ' (' + socket.llc.label + ')';
      }).join('<br>');
    }
  }.property('contention'),
  contentionWidth: function() {
    if (this.get('contention.system.llc.value') === 0 || isEmpty(this.get('contention.system.llc.value'))) {
      return 'display:none;';
    } else {
      var percent = rangeToPercentage(this.get('contention.system.llc.value'), 0, 50);
      return 'width:' + percent + '%;';
    }
  }.property('contention.system.llc.value'),
  socketsEnum: function() {
    var socketsEnum = [];
    for (var i = 0; i < this.get('capabilities.sockets'); i++) {
      socketsEnum.push(i);
    }
    return socketsEnum;
  }.property('capabilities.sockets'),

  // Icons for list view table
  servicesIcon: function() {
    return '<i class="icon-' + this.get('nodeType') + '" title="' + this.get('servicesMessage') + '"></i>';
  }.property('nodeType', 'servicesMessage'),
  trustIcon: function() {
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
  scheduledIcon: function() {
    // TODO: scheduledMessage
    if (this.get('isScheduled')) {
      return '<i class="icon-magnet"></i>';
    } else {
      return '';
    }
  }.property('isScheduled'),

  // Observers
  graphObserver: function() {
    return graphs.graph(this.get('id'), this.get('name'), 'node', this.get('capabilities.sockets'));
  }.observes('isExpanded'),
  graphTimeAgoValue: '-1h',
  isGraphTimeAgoHour: function() {
    return this.get('graphTimeAgoValue') === '-1h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoDay: function() {
    return this.get('graphTimeAgoValue') === '-24h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoWeek: function() {
    return this.get('graphTimeAgoValue') === '-168h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoMonth: function() {
    return this.get('graphTimeAgoValue') === '-672h';
  }.property('graphTimeAgoValue'),

  actions: {
    exportTrustReport: function(model) {
      this.get('controllers.nodes').send('exportTrustReport', model);
    },
    graphTimeAgo: function(timeAgo) {
      this.set('graphTimeAgoValue', timeAgo);
      graphs.graph(this.get('id'), this.get('name'), 'node', this.get('capabilities.sockets'), timeAgo);
    }
  }

});
