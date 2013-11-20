App.VmController = Ember.ObjectController.extend({
  needs: ["logBar"],
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

  // Compute SU allocation floor/ceiling computed properties
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
      return null
    } else if (this.get('suFloor') === this.get('suCeiling')) {
      return parseFloat(this.get('suFloor')).toFixed(1);
    } else {
      return parseFloat(this.get('suFloor')).toFixed(1) + '-' + parseFloat(this.get('suCeiling')).toFixed(1);
    }
  }.property('suFloor', 'suCeiling'),
  suTotalRange: function () {
    if (Ember.isEmpty(this.get('suFloor'))) {
      return null
    } else if (this.get('suFloor') === this.get('suCeiling')) {
      return (parseFloat(this.get('suFloor')) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    } else {
      return (parseFloat(this.get('suFloor')) * parseInt(this.get('capabilities.cores'))).toFixed(1) + '-' + (parseFloat(this.get('suCeiling')) * parseInt(this.get('capabilities.cores'))).toFixed(1);
    }
  }.property('suFloor', 'suCeiling', 'capabilities.cores'),
  allocationMin: function () {
    if (Ember.isEmpty(this.get('suFloor'))) return 0;
    return 100 * parseFloat(this.get('suFloor')) / parseFloat(this.get('suCeiling'));
  }.property('suFloor', 'suCeiling'),
  allocationMinWidth: function () {
    return 'width:' + this.get('allocationMin') + 'px;';
  }.property('allocationMin'),
  allocationCurrent: function () {
    if (Ember.isEmpty(this.get('utilization.su_current'))) return 0;
    return 100 * parseFloat(this.get('utilization.su_current')) / parseFloat(this.get('suCeiling'));
  }.property('utilization.su_current', 'suCeiling'),
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
    return '<strong>Current: ' + this.get('utilization.su_current') + '</strong><br>' + 'Min: ' + this.get('suFloor') + '<br>' + 'Burst: ' + this.get('suCeiling');
    } else {
    return '<strong>Current: ' + this.get('utilization.su_current') + '</strong><br>' + 'Allocated: ' + this.get('suFloor');
    }
  }.property('suFloor', 'suCeiling', 'utilization.su_current', 'isRange'),

  // Observers
  graphObserver: function () {
     return App.graphs.graph(this.get('id'), this.get('id'), 'vm');
  }.observes('isSelected', 'isExpanded'),

  updateKibana: function() {
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
          var title = 'vm-trust-report-' + reportContent.get('vmName');
          var subtitle = reportContent.get('vmName');
          var rowContent = [];
          rowContent.push("item.get('vmAttestationNode.attestationTimeFormatted')");
          rowContent.push("item.get('vmAttestationNode.reportMessage')");
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

App.VmsVmController = App.VmController.extend();
