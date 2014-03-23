App.VmController = Ember.ObjectController.extend({
  needs: ['vms', 'logBar'],
  isExpanded: false,
  isSelected: false,
  isActionPending: false,

  isHealthy: function() {
    if ( (this.get('status.health') == 1) || (this.get('status.health') == 2) ) {
      return true;
    } else {
      return false;
    }
  }.property('status.health'),

  isUnhealthy: Ember.computed.not('isHealthy'),
  healthMessage: function () {
    var healthMessage = '';
    if (this.get('isSlaMissing')) healthMessage += 'VM is missing an SLA.<br>';
    if (App.isEmpty(this.get('status.short_message')) && App.isEmpty(this.get('status.long_message'))) {
      // If both short and long messages are empty, show health as message
      healthMessage +=  '<strong>Health</strong>: ' + App.priorityToType(this.get('status.health')).capitalize();
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
    operationalMessage += '<strong>State</strong>: ' + App.codeToOperational(this.get('status.operational')).capitalize();
    return operationalMessage;
  }.property('status.operational'),
  isUntrusted: Ember.computed.equal('status.trust_status.trust', App.UNTRUSTED),
  isTrusted: Ember.computed.equal('status.trust_status.trust', App.TRUSTED),
  isUnregistered: Ember.computed.equal('status.trust_status.trust', App.UNREGISTERED),
  isTrustUnknown: Ember.computed.not('status.trust_status.trust'),
  trustMessage: function () {
    var message = 'Trust Status: ' + App.trustToString(this.get('status.trust_status.trust')).capitalize();
    message += '<br>' + 'BIOS: ' + App.trustToString(this.get('status.trust_status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + App.trustToString(this.get('status.trust_status.trust_details.vmm')).capitalize();
    return message;
  }.property('status.trust_status.trust_details', 'status.trust_status.trust_details'),
  slaViolated: Ember.computed.equal('status.sla_status', 2),
  slaNotViolated: Ember.computed.equal('status.sla_status', 1),
  slaUnknown: Ember.computed.equal('status.sla_status', 0),
  isSlaMissing: function () {
    return Ember.isEmpty(this.get('sla')) && this.get('node.samControlled') === App.ASSURED;
  }.property('sla', 'node.samControlled'),
  slaMessage: function () {
    if (App.isEmpty(this.get('status.sla_messages'))) {
      var slaStatus = '';
      if (this.get('slaNotViolated')) {
        slaStatus = 'Not violated';
      } else if (this.get('slaViolated')) {
        slaStatus = 'Violated';
      } else {
        slaStatus = 'Unknown';
      }
      return 'SLA Status: ' + slaStatus;
    } else {
      var messages = this.get('status.sla_messages').map(function (item, index, enumerable) {
        if (item.slice(-1) === '.') item = item.slice(0, -1);
        return item.capitalize();
      });
      return messages.join('; ');
    }
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
    if (App.isEmpty(this.get('contention.system.llc.value'))) {
      return '<strong>Contention Not Available</strong>';
    } else {
      var message = 'Overall Cache Contention: ' + this.get('contention.system.llc.value');
      var vCPU = this.get('contention.threads');
      vCPUs.forEach(function (item, index, enumerable) {
        vCPU = item.get('contention.system.llc');
        message += '<br>' + 'vCPU Contention: ' + vCPU.get('contention.system.llc.value');
      });
      return message;
    }
  }.property('contention.system.llc.value'),
  contentionMessage: function () {
    if (App.isEmpty(this.get('contention.system.llc.value'))) {
      return '<strong>Contention Not Available</strong>';
    } else {
      var message = 'Overall Cache Contention: ' + this.get('contention.system.llc.value');
      var vCPUs = this.get('contention.threads');
      vCPUs.forEach(function (item, index, enumerable) {
        vCPU = item.llc;
        message += '<br>' + 'vCPU Contention: ' + vCPU.value;
      });
      return message;
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
    return !Ember.isEmpty(this.get('utilization.scu_total')) && !Ember.isEmpty(this.get('suFloor'));
  }.property('utilization.scu_total', 'suFloor'),
  suFloor: function () {
    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return null;
    var computeSlo = this.get('sla.slos').findBy('sloType', 'compute');
    var suRange = computeSlo && computeSlo.get('value');
    if (Ember.isEmpty(suRange)) {
      return null;
    } else if (suRange.indexOf(';') === -1) {
      return suRange;
    } else {
      return suRange.split(';')[0];
    }
  }.property('sla.slos.@each'),
  suCeiling: function () {
    if (Ember.isEmpty(this.get('sla')) || Ember.isEmpty(this.get('sla.slos'))) return null;
    var computeSlo = this.get('sla.slos').findBy('sloType', 'compute');
    var suRange = computeSlo && computeSlo.get('value');
    if (Ember.isEmpty(suRange)) {
      return null;
    } else if (suRange.indexOf(';') === -1) {
      return suRange;
    } else {
      return suRange.split(';')[1];
    }
  }.property('sla.slos.@each'),
  isRange: function () {
    if (Ember.isEmpty(this.get('suFloor'))) return false;
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
  suTotalRange: function () {
    if (Ember.isEmpty(this.get('suFloor'))) {
      return null;
    } else if (this.get('suFloor') === this.get('suCeiling')) {
      return (parseFloat(this.get('suFloor')) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    } else {
      return (parseFloat(this.get('suFloor')) * parseInt(this.get('capabilities.cores'))).toFixed(1) + '-' + (parseFloat(this.get('suCeiling')) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    }
  }.property('suFloor', 'suCeiling', 'capabilities.cores'),
  allocationMin: function () {
    if (Ember.isEmpty(this.get('capabilities.scu_allocated_min'))) return 0;
    return 100 * parseFloat(this.get('capabilities.scu_allocated_min')) / parseFloat(this.get('capabilities.scu_allocated_max'));
  }.property('capabilities.scu_allocated_min', 'capabilities.scu_allocated_max'),
  allocationMinWidth: function () {
    return 'width:' + this.get('allocationMin') + 'px;';
  }.property('allocationMin'),
  allocationCurrent: function () {
    if (Ember.isEmpty(this.get('utilization.scu_total'))) return 0;
    return 100 * parseFloat(this.get('utilization.scu_total')) / parseFloat(this.get('capabilities.scu_allocated_max'));
  }.property('utilization.scu_total', 'capabilities.scu_allocated_max'),
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
    if (this.get('isRange')) {
    return '<strong>Current: ' + this.get('utilization.scu_total') + '</strong><br>' + 'Min: ' + this.get('capabilities.scu_allocated_min') + '<br>' + 'Burst: ' + this.get('capabilities.scu_allocated_max');
    } else {
    return '<strong>Current: ' + this.get('utilization.scu_total') + '</strong><br>' + 'Allocated: ' + this.get('capabilities.scu_allocated_min');
    }
  }.property('capabilities.scu_allocated_min', 'capabilities.scu_allocated_max', 'utilization.scu_total', 'isRange'),

  // Observers
  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isSelected', 'isExpanded'),

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
  }.property('model.vmInstantiationDetailed.instantiationNodes'),
  simpleInstantiationNodes: function () {
    var instantiationNodes = this.get('model.vmInstantiationSimple.rankedNodes');
    var instantiationNodesController = Ember.ArrayController.create({
      content: instantiationNodes,
      sortProperties: ['selected'],
      sortAscending: false
    });
    return instantiationNodesController;
  }.property('model.vmInstantiationSimple.rankedNodes'),

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

  actions: {
    exportTrustReport: function (model) {
      this.get('controllers.vms').send('exportTrustReport', model);
    }
  }

});

App.VmsVmController = App.VmController.extend();
