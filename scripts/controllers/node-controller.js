App.NodeController = Ember.ObjectController.extend({
  needs: ["logBar"],
  // Controller Properties
  isSelected: false,
  isExpanded: false,
  isActionPending: false,
  updateKibana: function() {
    if (!frames['allLogsFrame'] || !frames['allLogsFrame'].angular) return;
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;

    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaNodesQuery').push('host_id: \"'+this.get('id').toString()+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaNodesQuery').join(' OR ') + ")"
      }, fieldId);

      this.set('controllers.logBar.kibanaFieldIds.nodes', newFieldId);
      dashboard.refresh();

    } else {
      var inArray = $.inArray('host_id: \"'+this.get('id').toString()+'\"', this.get('controllers.logBar.kibanaNodesQuery'));
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
  isAssured: Ember.computed.equal('samControlled', 2),
  isMonitored: Ember.computed.equal('samControlled', 1),
  nodeTypeMessage: function () {
    if (this.get('isAssured')) {
      return 'This is an assured node. VMs with SLAs may be placed here.';
    } else if (this.get('isMonitored')) {
      return 'This is a monitored node. SAM will monitor this node, but VMs with SLAs may not be placed here.';
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
  isHealthy: Ember.computed.equal('status.health', App.SUCCESS),
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
    message += '<br>' + 'BIOS: ' + App.trustToString(this.get('status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + App.trustToString(this.get('status.trust_details.vmm')).capitalize();
    if (this.get('status.trust') === App.UNTRUSTED) message += '<br><em>Note: Check PCR Logs tab for details.</em>';
    return message;
  }.property('status.trust'),

  computeMessage: function() {
    if (App.isEmpty(this.get('utilization.su_current'))) {
      return '<strong>SAM Units</strong>: N/A';
    } else {
      return 'SAM Units: ' + this.get('utilization.su_current') + ' out of ' + this.get('utilization.su_max') + ' SU';
    }
  }.property('utilization.su_current', 'utilization.su_max'),
  computeWidth: function () {
    if (this.get('utilization.su_current') === 0 || App.isEmpty(this.get('utilization.su_current'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('utilization.su_current'), 0, this.get('utilization.su_max'));
      return 'width:' + percent + '%;';
    }
  }.property('utilization.su_current', 'utilization.su_max'),
  computeExists: Ember.computed.notEmpty('utilization.su_current'),

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
  stateIcon: function () {
    if (this.get('isUnhealthy')) {
      // TODO: healthMessage
      var code = this.get('status.health');
      return '<i class="' + App.priorityToType(code) + ' ' + App.priorityToIconClass(code) + ' icon-large"></i>';
    } else {
      // TODO: operationalMessage
      var code = this.get('status.operational');
      return '<i class="' + App.codeToOperational(code) + ' ' + App.operationalToIconClass(code) + ' icon-large"></i>';
    }
  }.property('isUnhealthy', 'status.health', 'status.operational'),
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

  // Actions
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
        this.transitionToRoute('nodesNode', model);
      } else {
        this.transitionToRoute('nodes');
      }
    },
    exportTrustReport: function (reportContent) {
      var self = this;
      this.set('isActionPending', true);
      this.store.find('nodeTrustReport', reportContent.get('id')).then(function (nodeTrustReport) {
        if (nodeTrustReport !== null && (nodeTrustReport.get('attestations.length') > 0)) {
          var title = 'node-trust-report-' + reportContent.get('name');
          var subtitle = reportContent.get('name') + ' ('+reportContent.get('ids.ip_address')+')';
          var rowContent = [];
          rowContent.push("item.get('attestation_time_formatted')");
          rowContent.push("item.get('report_message')");
          App.pdfReport(nodeTrustReport, rowContent, title, subtitle, 'attestations');
        } else {
          App.event('No trust attestation logs were found for this node.', App.WARNING);
        }
        self.set('isActionPending', false);
      }, function (xhr) {
        self.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to load node trust report.');
      });
    },
    reboot: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to reboot node "' + node.get('name') + '"?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reboot',
          node: this.store.getById('node', node.get('id'))
        }).save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully started rebooting node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to reboot node "' + node.get('name') + '".');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    unregister: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Note: You must uninstall the SAM node agent before doing the unregister action, or the node will be re-register once the SAM agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + '.');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "unregister"
        }).save().then( function () {
          self.set('isActionPending', false);
          App.event('Successfully unregistered node "' + node.get('name') + '".', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unregister node "' + node.get('name') + '".');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    unschedule: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_unmark"
        }).save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully unset node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          node.set('schedulerMark', null);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unset node "' + node.get('name') + '" for VM placement.');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    addTrust: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        var newTrustNode = this.store.createRecord('trustNode', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustNode.save().then(function () {
           self.set('isActionPending', false);
          App.event('Successfully trusted node "' + node.get('name') + '".', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          self.set('isActionPending', false);
          newTrustNode.deleteRecord();
          App.xhrError(xhr, 'An error occured while registering node"' + node.get('name') + '" as trusted.');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    trustReportModal: function (model) {
      var controller = this;
      modal = Ember.View.extend({
        templateName: "nodeTrustReport-modal",
        controller: controller,
        content: model,
        modalHide: function() {
          $('#modal').modal('hide');
          var context = this;
          this.remove(); //destroys the element
        },
        didInsertElement: function (){
          $('#modal').modal('show');
        }
      }).create().appendTo('body');
    },
    trustFingerprint: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
      if (confirmed) {
        var newTrustMle = this.store.createRecord('trustMle', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustMle.save().then(function (model) {
          self.set('isActionPending', false);
          App.event('Successfully fingerprinted node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          self.set('isActionPending', false);
          newTrustMle.deleteRecord();
          App.xhrError(xhr, 'An error occured while fingerprinting node "' + node.get('name') + '".');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    schedule: function (node, socketNumber) {
      var self = this;
      var parentController = this.get('parentController');
      socketNumber = Ember.isEmpty(socketNumber) ? 0 : parseInt(socketNumber.toFixed());
      var confirmed = confirm('Are you sure you want all future VMs to be placed on node "' + node.get('name') + '" (socket ' + socketNumber + ')?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_mark",
          options: {
            scheduler_mark: socketNumber,
            scheduler_persistent: true
          }
        }).save().then( function () {
          self.set('isActionPending', false);
          App.event('Successfully set node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          // Unset all other nodes
          parentController.filterBy('isScheduled').setEach('schedulerMark', null);
          // Set this node for VM placement
          node.set('schedulerMark', socketNumber);
          node.set('schedulerPersistent', true);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set node "' + node.get('name') + '" for VM placement.');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    removeTrust: function (node) {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        var trustNode = node.get('trustNode');
        trustNode.deleteRecord();
        trustNode.save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully unregistered node "' + node.get('name') + '" as trusted.', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          self.set('isActionPending', false);
          node.rollback();
          App.xhrError(xhr, 'An error occured while unregistering node "' + node.get('name') + '" as trusted.');
        });
      } else {
        self.set('isActionPending', false);
      }
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
  }.property('operational'),

});