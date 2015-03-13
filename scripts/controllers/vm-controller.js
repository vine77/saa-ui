App.VmController = Ember.ObjectController.extend({
  needs: ['vms', 'logBar'],
  isExpanded: false,
  isSelected: false,
  isActionPending: false,
  isSelectable: true,
  cores: function() {
    return this.get('utilization.cores.system.used') && this.get('utilization.cores.system.used.length');
  }.property('utilization.cores.system.used.@each'),
  isHealthy: function() {
    return (this.get('status.health') == App.SUCCESS) || (this.get('status.health') == App.INFO);
  }.property('status.health'),
  isUnhealthy: Ember.computed.not('isHealthy'),
  healthMessage: function () {
    var healthMessage = '';
    if (this.get('isSlaMissing')) healthMessage += "Warning: This VM is on an assured node, but is missing an SLA, which breaks the node's ability to control resource usage.<br>";
    if (App.isEmpty(this.get('status.short_message')) && App.isEmpty(this.get('status.long_message'))) {
      // If both short and long messages are empty, show health as message
      healthMessage +=  'Health: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else if (App.isEmpty(this.get('status.long_message'))) {  // Short message only
      healthMessage +=  this.get('status.short_message').capitalize();
    } else {  // Default to long message
      healthMessage +=  this.get('status.long_message').capitalize();
    }
    return healthMessage;
  }.property('status.long_message', 'status.short_message'),
  operationalMessage: function () {
    var operationalMessage = '';
    if (this.get('isSlaMissing')) operationalMessage += 'VM is missing an SLA.<br>';
    operationalMessage += 'State: ' + App.codeToOperational(this.get('status.operational')).capitalize();
    return operationalMessage;
  }.property('status.operational'),
  isUntrusted: Ember.computed.equal('status.trust', App.UNTRUSTED),
  isTrusted: Ember.computed.equal('status.trust', App.TRUSTED),
  isUnregistered: Ember.computed.equal('status.trust', App.UNREGISTERED),
  isTrustUnknown: Ember.computed.not('status.trust'),
  trustMessage: function () {
    var message = 'Trust Status: ' + App.trustToString(this.get('status.trust')).capitalize();
    message += '<br>' + 'BIOS: ' + App.trustToString(this.get('status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + App.trustToString(this.get('status.trust_details.vmm')).capitalize();
    return message;
  }.property('status.trust_details', 'status.trust_details'),
  slaUnknown: Ember.computed.equal('status.sla_status', 0),
  slaNotViolated: Ember.computed.equal('status.sla_status', 1),
  slaViolatedWarning: Ember.computed.equal('status.sla_status', 2),
  slaViolatedError: Ember.computed.equal('status.sla_status', 3),
  isSlaMissing: function () {
    return Ember.isEmpty(this.get('sla')) && this.get('node.isAssured');
  }.property('sla', 'node.samControlled'),
  isAssuredCoresPhysical: function() {
    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return false;
    return !Ember.isEmpty(this.get('sla.slos').findBy('sloType', 'assured-cores-physical'));
  }.property('sla.slos.@each.sloType'),
  slaIconClass: function() {
    var slaClasses = ['icon-large'];
    if (this.get('sla.isDefault')) {
      slaClasses.push('icon-info-sign', 'info');
    } else {
      if (this.get('slaUnknown') || this.get('slaNotViolated')) {
        if (this.get('slaUnknown')) slaClasses.push('inset');
        if (this.get('slaNotViolated')) slaClasses.push('success');
        if (this.get('isAssuredCoresPhysical')) {
          slaClasses.push('icon-pushpin');
        } else {
          slaClasses.push('icon-trophy');
        }
      } else {
        if (this.get('slaViolatedWarning')) slaClasses.push('icon-warning-sign', 'warning');
        if (this.get('slaViolatedError')) slaClasses.push('icon-remove-sign', 'error');
      }
    }
    return slaClasses.join(' ');
  }.property('status.sla_status', 'sla.slos.@each.sloType', 'sla.isDefault'),
  slaMessage: function () {
    var slaMessages = [];
    if (this.get('slaName')) slaMessages.push('SLA: ' + this.get('slaName'));
    if (App.isEmpty(this.get('status.sla_messages'))) {
      var slaStatus = '';
      if (this.get('slaNotViolated')) {
        slaStatus = 'Not violated';
      } else if (this.get('slaViolatedWarning')) {
        slaStatus = 'Violated (Warning)';
      } else if (this.get('slaViolatedError')) {
        slaStatus = 'Violated (Error)';
      } else {
        slaStatus = 'Unknown';
      }
      slaMessages.push('SLA Status: ' + slaStatus);
    } else {
      var messages = this.get('status.sla_messages').map(function (item, index, enumerable) {
        if (item.slice(-1) === '.') item = item.slice(0, -1);
        return item.capitalize();
      });
      slaMessages.push(messages.join('; '));
    }
    if (this.get('sla.isDefault')) {
      slaMessages.push('This VM is using a default SLA');
    }
    return slaMessages.join('<br>');
  }.property('status.sla_messages'),
  hasContention: function() {
    if (App.isEmpty(this.get('contention.system.llc.value'))) {
      return false;
    } else {
      return true;
    }
  }.property('contention.system.llc.value'),
  contentionFormatted: function () {
    return Math.round(this.get('contention.system.llc.value') * 100) / 100;
  }.property('contention.system.llc.value'),
  contentionMessage: function () {
    var message = 'Overall Cache Contention: ';
    if (App.isEmpty(this.get('contention.system.llc.value'))) {
      return messsage + 'N/A';
    } else {
      return message + this.get('contention.system.llc.value');
    }
  }.property('contention.system.llc.value'),
  contentionWidth: function () {
    if (this.get('contention.system.llc.value') === 0 || App.isEmpty(this.get('contention.system.llc.value'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('contention.system.llc.value'), 0, 50);
      return "width:"+percent+"%;";
    }
  }.property('contention.system.llc.value'),
  contentionValueExists: function () {
    return typeof this.get('contention.system.llc.value') !== 'undefined' && this.get('contention.system.llc.value') !== null;
  }.property('contention.system.llc.value'),
  isOn: function () {
    return (this.get('status.operational') === App.ON);
  }.property('status.operational'),
  isVictim: Ember.computed.gte('status.victim', App.INFO),
  isAggressor: Ember.computed.gte('status.aggressor', App.INFO),
  notNoisy: function () {
    return (!this.get('isVictim') && !this.get('isAggressor'));
  }.property('isVictim', 'isAggressor'),
  noisyMessage: function () {
    var messages = [];
    if (!this.get('isAggressor') && !this.get('isVictim')) {
      return 'This VM is not an aggressor or a victim.';
    }
    if (this.get('isAggressor')) messages.push('This VM is an aggressor.');
    if (this.get('isVictim')) messages.push('This VM is a victim.');
    messages.push('Note: See details for affected VMs.');
    return messages.join('<br>');
  }.property('isVictim', 'isAggressor'),

  // Compute SCU allocation floor/ceiling computed properties
  hasCompute: function () {
    return !Ember.isEmpty(this.get('scuTotal')) && !Ember.isEmpty(this.get('suFloor'));
  }.property('scuTotal', 'suFloor'),
  suFloor: Ember.computed.alias('capabilities.scu_allocated_min'),
  suCeiling: Ember.computed.alias('capabilities.scu_allocated_max'),
  isRange: function () {
    if (Ember.isEmpty(this.get('suFloor')) || Ember.isEmpty(this.get('suCeiling'))) return false;
    return this.get('suFloor') !== this.get('suCeiling');
  }.property('suFloor', 'suCeiling'),
  suRange: function () {
    if (Ember.isEmpty(this.get('suFloor'))) {
      return null;
    } else if (this.get('suFloor') === this.get('suCeiling')) {
      return parseFloat(this.get('suFloor')).toFixed(1);
    } else {
      return parseFloat(this.get('suFloor')).toFixed(1) + '-' + parseFloat(this.get('suCeiling')).toFixed(1);
    }
  }.property('suFloor', 'suCeiling'),
  allocationMin: function () {
    if (Ember.isEmpty(this.get('capabilities.scu_allocated_min'))) return 0;
    return 100 * parseFloat(this.get('capabilities.scu_allocated_min')) / parseFloat(this.get('capabilities.scu_allocated_max'));
  }.property('capabilities.scu_allocated_min', 'capabilities.scu_allocated_max'),
  allocationMinWidth: function () {
    return 'width:' + this.get('allocationMin') + 'px;';
  }.property('allocationMin'),
  allocationCurrent: function () {
    if (Ember.isEmpty(this.get('scuTotal'))) return 0;
    return 100 * parseFloat(this.get('scuTotal')) / parseFloat(this.get('capabilities.scu_allocated_max'));
  }.property('scuTotal', 'capabilities.scu_allocated_max'),
  allocationCurrentWidth: function () {
    return 'width:' + this.get('allocationCurrent') + 'px;';
  }.property('allocationCurrent'),
  allocationSuccess: function () {
    return Math.min(this.get('allocationMin'), this.get('allocationCurrent'));
  }.property('allocationMin', 'allocationCurrent'),
  allocationSuccessWidth: function () {
    return 'width:' + this.get('allocationSuccess') + 'px;';
  }.property('allocationSuccess'),
  allocationMessage: function () {
    var message = '';
    if (this.get('isRange')) {
      message += '<strong>Total: ' + this.get('scuTotal') + '</strong><br>';
      message += 'Non-bursting: ' + this.get('utilizationCurrent') + '<br>';
      message += 'Bursting: ' + this.get('utilizationBurst') + '<br>';
      message += 'Min Allocated: ' + this.get('capabilities.scu_allocated_min') + '<br>';
      message += 'Burst Allocated: ' + this.get('capabilities.scu_allocated_max');
    } else {
      return '<strong>Total: ' + this.get('scuTotal') + '</strong><br>' + 'Allocated: ' + this.get('capabilities.scu_allocated_min');
    }
    return message;
  }.property('isRange', 'scuTotal', 'utilizationCurrent', 'utilizationBurst', 'capabilities.scu_allocated_min', 'capabilities.scu_allocated_max'),
  utilizationBurst: function() {
    var currentUtilization = this.get('utilization.scu.compute') + this.get('utilization.scu.misc');
    var burst =  this.get('capabilities.scu_allocated_min') - currentUtilization;
    if (Ember.isEmpty(burst)) burst = 0;
    return burst;
  }.property('utilizationCurrent', 'capabilities.scu_allocated_min', 'utilization.scu.compute', 'utilization.scu.misc'),
  utilizationCurrent: function() {
    var total = this.get('utilization.scu.compute') + this.get('utilization.scu.misc');
    if (Ember.isEmpty(total)) total = 0;
    return Math.max(0, total).toFixed(2);
  }.property('utilization.scu.compute','utilization.scu.misc', 'utilizationBurst'),
  utilizationBurstWidth: function() {
    if (Ember.isEmpty(this.get('capabilities.scu_allocated_max'))) return null;
    var percent = 100 * parseFloat(this.get('utilizationBurst')) / parseFloat(this.get('capabilities.scu_allocated_max'));
    return 'width:' + percent.toFixed(0) + 'px;';
  }.property('utilizationBurst', 'capabilities.scu_allocated_max'),
  utilizationCurrentWidth: function() {
    if (Ember.isEmpty(this.get('capabilities.scu_allocated_max'))) return null;
    var percent = 100 * parseFloat(this.get('utilizationCurrent')) / parseFloat(this.get('capabilities.scu_allocated_max'));
    return 'width:' + percent.toFixed(0) + 'px;';
  }.property('utilizationCurrent', 'capabilities.scu_allocated_max'),
  utilizationBurstLeft: function() {
    if (Ember.isEmpty(this.get('capabilities.scu_allocated_max'))) return null;
    if (!this.get('isRange')) {
      // Current
      var percent = 100 * parseFloat(this.get('utilizationCurrent')) / parseFloat(this.get('capabilities.scu_allocated_max'));
      return 'left:' + percent.toFixed(0) + 'px;';
    } else {
      // Max of current and scu_allocated_min
      var left = Math.max(this.get('utilizationCurrent'), this.get('capabilities.scu_allocated_min'));
      var percent = (100 * left / parseFloat(this.get('capabilities.scu_allocated_max'))) + 1;
      return 'left:' + percent.toFixed(0) + 'px;';
    }
  }.property('isRange', 'capabilities.scu_allocated_max', 'utilizationCurrent'),
  utilizationBurstStyle: function() {
    return this.get('utilizationBurstWidth') + this.get('utilizationBurstLeft');
  }.property('utilizationBurstWidth', 'utilizationBurstLeft'),

  //utilizationSunburstExists: function() {
    //return this.get
  //}

  utilizationSunburst: function () {
    var self = this;
    return  {
     "name": "scu_chart",
     "children": [
      {
       "name": "Allocated",
       "fill_type": "blue",
       "size": self.get('capabilities.scu_allocated_min'),
       "description": "Minimum",
       "children": [
        {
         "name": "Utilization",
         "size": self.get('utilizationCurrent'),
         "fill_type": "light-green",
         "children": [
          {
            "name": "Miscellaneous",
            "size": self.get('utilization.scu.misc'),
            "fill_type": "yellow",
            "description": "Utilization"
          },
          {
            "name": "Compute",
            "size": self.get('utilization.scu.compute'),
            "fill_type": "dark-green",
            "description": "Utilization"
          }
         ]
        },
        {
          "name": "Not Utilized",
          "size": self.get('capabilities.scu_allocated_min') - self.get('utilizationCurrent'),
          "fill_type": "gray"
        }
       ]
      },
      {
        "name": "Allocated",
        "fill_type": "blue",
        "size": self.get('capabilities.scu_allocated_max'),
        "description": "Maximum",
        "children": [
          {
            "name": "Burst",
            "fill_type": "red",
            "size": self.get('utilizationBurst')
          },
          {
            "name": "Not Bursting",
            "fill_type": "gray",
            "size": self.get('capabilities.scu_allocated_max') - self.get('utilizationBurst')
          }
        ]
      }
     ]
    };
  }.property('utilizationCurrent', 'capabilities.scu_allocated_min', 'capabilities.scu_allocated_max'),

  // Observers
  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isExpanded'),

  updateKibana: function() {
    if (!frames['allLogsFrame'] || !frames['allLogsFrame'].angular) return;
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;

    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaVmsQuery').push('vm_id: \"'+this.get('id').toString()+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.vms') !== null)?this.get('controllers.logBar.kibanaFieldIds.vms'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaVmsQuery').join(' OR ') + ")"
      }, fieldId);

      this.set('controllers.logBar.kibanaFieldIds.vms', newFieldId);
      dashboard.refresh();

    } else {
      var inArray = $.inArray('vm_id: \"'+this.get('id').toString()+'\"', this.get('controllers.logBar.kibanaVmsQuery'));
      if (inArray !== -1) {
        this.get('controllers.logBar.kibanaVmsQuery').removeAt(inArray);

        var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.vms') !== null)?this.get('controllers.logBar.kibanaFieldIds.vms'):undefined);
        var newFieldId = filterSrv.set({
          type:'querystring',
          mandate:'must',
          query:"(" + this.get('controllers.logBar.kibanaVmsQuery').join(' OR ') + ")"
        }, fieldId);
        this.set('controllers.logBar.kibanaFieldIds.vms', newFieldId);

        if (this.get('controllers.logBar.kibanaVmsQuery').length < 1) {
          filterSrv.remove(this.get('controllers.logBar.kibanaFieldIds.vms'));
          this.set('controllers.logBar.kibanaFieldIds.vms', null);
        }
        dashboard.refresh();
      }
    }
  }.observes('isSelected'),
  detailedInstantiationNodes: function () {
    var instantiationNodes = this.get('model.vmInstantiationDetailed.instantiationNodes');
    var instantiationNodesController = Ember.ArrayController.create({
      content: instantiationNodes,
      sortProperties: ['selected'],
      sortAscending: false
    });
    return instantiationNodesController;
  }.property('model.vmInstantiationDetailed.instantiationNodes.@each'),
  simpleInstantiationNodes: function () {
    var instantiationNodes = this.get('model.vmInstantiationSimple.rankedNodes');
    var instantiationNodesController = Ember.ArrayController.create({
      content: instantiationNodes,
      sortProperties: ['selected'],
      sortAscending: false
    });
    return instantiationNodesController;
  }.property('model.vmInstantiationSimple.rankedNodes.@each'),

  /* TODO: Does this need to be added to polling?
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
  }
  */
  graphTimeAgoValue: '-1h',
  isGraphTimeAgoHour: function() {
    return this.get('graphTimeAgoValue') == '-1h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoDay: function() {
    return this.get('graphTimeAgoValue') == '-24h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoWeek: function() {
    return this.get('graphTimeAgoValue') == '-168h';
  }.property('graphTimeAgoValue'),
  isGraphTimeAgoMonth: function() {
    return this.get('graphTimeAgoValue') == '-672h';
  }.property('graphTimeAgoValue'),

  actions: {
    exportTrustReport: function (model) {
      this.get('controllers.vms').send('exportTrustReport', model);
    },
    graphTimeAgo: function(timeAgo) {
      this.set('graphTimeAgoValue', timeAgo);
      App.graphs.graph(this.get('id'), this.get('id'), 'vm', undefined, timeAgo);
    }
  }

});

App.VmsVmController = App.VmController.extend();
