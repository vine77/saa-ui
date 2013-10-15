App.VmController = Ember.ObjectController.extend({
  isExpanded: false,
  isSelected: false,

  status: function() {
    return Ember.$.extend({
      isHealthy: Ember.computed.equal('model.status.health', App.SUCCESS),
      healthMessage: (function(self) {
        if (App.isEmpty(self.get('model.status.short_message')) && App.isEmpty(self.get('model.status.long_message'))) {
          // If both short and long messages are empty, show health as message
          return '<strong>Health</strong>: ' + App.priorityToType(self.get('model.status.health')).capitalize();
        } else if (App.isEmpty(self.get('model.status.long_message'))) {  // Short message only
          return self.get('model.status.short_message').capitalize();
        } else {  // Default to long message
          return self.get('model.status.long_message').capitalize();
        }
      })(this),
      operationalMessage: (function(self) {
        return '<strong>State</strong>: ' + App.codeToOperational(self.get('model.status.operational')).capitalize();
      })(this),
      isTrusted: Ember.computed.equal('model.status.trust', 2),
      isNotTrusted: Ember.computed.equal('model.status.trust', 1),
      isTrustUnknown: Ember.computed.not('model.status.trust'),
      trustMessage:(function(self) {
        var message = '';
        if (self.get('model.status.trust') === 0) {
          message = 'Trust Status: Unknown';
        } else if (self.get('model.status.trust') === 1) {
          message = 'Trust Status: Not Trusted';
        } else if (self.get('model.status.trust') === 2) {
          message = 'Trust Status: Trusted';
        }
        message += '<br>' + 'BIOS: ' + App.trustDetailsToString(self.get('model.status.trust_details.bios'));
        message += '<br>' + 'VMM: ' + App.trustDetailsToString(self.get('model.status.trust_details.vmm'));
        return message;
      })(this),
      slaViolated: (function(self) {
        return self.get('model.status.sla_status') === 1;
      })(this),
      slaNotViolated: (function(self) {
        return self.get('model.status.sla_status') === 0;
      })(this),
      slaUnknown: (function(self) {
        return Ember.isEmpty(self.get('model.status.sla_status'));
      })(this),
      slaMessage: (function(self) {
        if (App.isEmpty(self.get('model.status.sla_messages'))) {
          var slaStatus = '';
          if (self.get('model.status.sla_status') === 0) {
            slaStatus = 'Not violated';
          } else if (self.get('model.status.sla_status') === 1) {
            slaStatus = 'Violated';
          } else {
            slaStatus = 'Unknown';
          }
          return 'SLA Status: ' + slaStatus;
        } else {
          var messages = self.get('model.status.sla_messages').map(function (item, index, enumerable) {
            if (item.slice(-1) === '.') item = item.slice(0, -1);
            return item.capitalize();
          });
          return messages.join('; ');
        }
      })(this)
    }, this.get('model.status'));
  }.property('model.status'),
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

  // Observers
  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isSelected', 'isExpanded'),
  kibanaId: null,
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    if (this.get('isSelected')) {
      this.set('kibanaId', filterSrv.set({type:'querystring',mandate:'must',query:"vm_id"+":"+this.get('id')}));
      dashboard.refresh();
    } else {
      filterSrv.remove(this.get('kibanaId'));
      dashboard.refresh();
    }
  }.observes('isSelected'),

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

  // Actions
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
          this.transitionToRoute('vmsVm', model);
        } else {
          this.transitionToRoute('vms');
        }
    }
  }
});
