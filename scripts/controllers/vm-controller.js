App.VmController = Ember.ObjectController.extend({
  isExpanded: false,
  isSelected: false,
  status: function() {
    return Ember.$.extend({
      isHealthy: (function (self) {
        return self.get('model.status.health') === App.SUCCESS;
      })(this),
      isUnhealthy: (function (self) {
        return self.get('model.status.health') >= App.INFO;
      })(this),
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
      isTrusted: (function (self) {
        return self.get('model.status.trust') === App.TRUSTED;
      })(this),
      isNotTrusted: (function (self) {
        return self.get('model.status.trust') === App.UNTRUSTED;
      })(this),
      isTrustUnknown: (function (self) {
        return !self.get('model.status.trust');
      })(this),
      trustMessage:(function(self) {
        var message = 'Trust Status: ' + App.trustToString(self.get('model.status.trust')).capitalize();
        message += '<br>' + 'BIOS: ' + App.trustToString(self.get('model.status.trust_details.bios')).capitalize();
        message += '<br>' + 'VMM: ' + App.trustToString(self.get('model.status.trust_details.vmm')).capitalize();
        return message;
      })(this),
      slaViolated: (function(self) {
        return self.get('model.status.sla_status') === 2;
      })(this),
      slaNotViolated: (function(self) {
        return self.get('model.status.sla_status') === 1;
      })(this),
      slaUnknown: (function(self) {
        return self.get('model.status.sla_status') === 0;
      })(this),
      slaMessage: (function(self) {
        if (App.isEmpty(self.get('model.status.sla_messages'))) {
          var slaStatus = '';
          if (self.get('model.status.sla_status') === 1) {
            slaStatus = 'Not violated';
          } else if (self.get('model.status.sla_status') === 2) {
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
  isVictim: Ember.computed.gte('status.victim', App.INFO),
  isAggressor: Ember.computed.gte('status.aggressor', App.INFO),
  noisyMessage: function () {
    var messages = [];
    if (!this.get('isAggressor') && !this.get('isVictim')) {
      return 'This VM is not an aggressor or a victim.';
    }
    if (this.get('isAggressor')) {
      messages.push('This VM is an aggressor.');
      if (!Ember.isEmpty(this.get('victims'))) {
        messages.push('Its victim(s) are: ' + this.get('victims').mapBy('name').join(', '));
      }
    }
    if (this.get('isVictim')) {
      messages.push('This VM is a victim.');
      if (!Ember.isEmpty(this.get('aggressors'))) {
        messages.push('Its aggressor(s) are: ' + this.get('aggressors').mapBy('name').join(', '));
      }
    }
    return messages.join('<br>');
  }.property('isVictim', 'isAggressor', 'victims', 'aggressors'),

  // Observers
  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isSelected', 'isExpanded'),
  kibanaId: null,
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    if (this.get('isSelected')) {
      this.set('kibanaId', filterSrv.set({type:'field',mandate:'either', field: "vm_id", query:JSON.stringify(this.get('id')) }) );
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
    },
    exportTrustReport: function (reportContent) {
      this.store.find('vmTrustReport', reportContent.get('id')).then(function (vmTrustReport) {
        reportContent = vmTrustReport;
        if ((vmTrustReport !== undefined) && (vmTrustReport !== null) && (reportContent.get('vmAttestations.length') > 0)) {
          var title = "SAM VM Trust Report";
          var subtitle = reportContent.get('vmName');
          var rowContent = [];
          rowContent.push("item.get('vmAttestationNode.attestationTimeFormatted')");
          rowContent.push("((item.get('vmAttestationNode.trustStatus'))?'VM was started on node '+item.get('vmAttestationNode.nodeName')+' ('+item.get('vmAttestationNode.ipAddress')+') that was attested as trusted. ':'VM was started on node that failed to be found attested as trusted.')");
          rowContent.push("item.get('vmAttestationNode.trustMessage')");
          App.pdfReport(reportContent, rowContent, title, subtitle, 'vmAttestations');
        } else {
          App.notify('Trust attestation logs were not found.');
        }
      }, function (xhr) {
        App.xhrError(xhr, 'Failed to load VM trust report.');
      });
    },
    trustReportModal: function(model){
      var controller = this;
        modal = Ember.View.extend({
          templateName: "vmTrustReport-modal",
          controller: controller,
          content: model,
          actions: {
            modalHide: function() {
              $('#modal').modal('hide');
              var context = this;
              //setTimeout(context.remove, 3000);
              this.remove(); //destroys the element
            }
          },
          didInsertElement: function () {
            $('#modal').modal('show');
          }
        }).create().appendTo('body');
    }
  }
});

App.VmsVmController = App.VmController.extend({});