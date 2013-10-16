App.NodesColumnsController = App.ColumnsController.extend({
  content: [{
    description: 'Services',
    sortBy: 'nodeType',
    icon: 'icon-cloud'
  }, {
    description: 'State (Health/Operational State)',
    sortBy: 'state',
    icon: 'icon-off'
  }, {
    description: 'Trust Status',
    sortBy: 'isTrusted',
    icon: 'icon-lock'
  }, {
    description: 'Assured',
    sortBy: 'isAssured',
    icon: 'icon-trophy'
  }, {
    title: 'Hostname',
    sortBy: 'name'
  }, {
    title: '# of VMs',
    sortBy: 'vmInfo.count'
  }, {
    title: 'CPU',
    sortBy: 'capabilities.cpu_frequency'
  }, {
    title: 'SU',
    description: 'The SAM Unit (SU) is a measure of compute consumption on the host server',
    sortBy: 'utilization.gips_current'
  }, {
    title: 'Throughput',
    description: 'CPU instructions per cycle',
    sortBy: 'utilization.ipc'
  }, {
    title: 'Memory',
    description: 'Memory utilization',
    sortBy: 'utilization.memory'
  }, {
    title: 'Contention',
    description: 'LLC cache contention',
    sortBy: 'contention.system.llc.value'
  }, {
    title: 'Actions'
  }]
});

App.NodesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  itemController: 'node',
  sortProperty: 'name',
  multipleNodesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  totalVms: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vmInfo.count') > 0) ? item.get('vmInfo.count') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vmInfo.count'),
  totalVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vcpus.used') > 0) ? item.get('vcpus.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vcpus.used'),
  maxVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var max = (item.get('vcpus.max') > 0) ? item.get('vcpus.max') : 0;
      return previousValue + max;
    }, 0);
  }.property('model.@each.vcpus.max'),
  totalVcpusMessage: function () {
    var maxVcpus = (this.get('maxVcpus') == 0) ? 'N/A' : this.get('maxVcpus');
    return this.get('totalVcpus') + ' out of ' + maxVcpus + ' vCPUs';
  }.property('totalVcpus', 'maxVcpus'),
  totalVcpusWidth: function () {
    var percentage = (this.get('maxVcpus') == 0) ? 0 : (this.get('totalVcpus')/this.get('maxVcpus')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalVcpus', 'maxVcpus'),
  totalRam: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('memory.used') > 0) ? item.get('memory.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.memory.used'),
  maxRam: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var max = (item.get('memory.max') > 0) ? item.get('memory.max') : 0;
      return previousValue + max;
    }, 0);
  }.property('model.@each.memory.max'),
  totalRamMessage: function () {
    return App.readableSize(this.get('totalRam') * 1048576) + ' out of ' + App.readableSize(this.get('maxRam') * 1048576);
  }.property('totalRam', 'maxRam'),
  totalRamWidth: function () {
    var percentage = (this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalRam', 'maxRam'),

  // Actions
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    refresh: function () {
      if (!this.get('isUpdating')) {
        if (App.mtWilson.get('isInstalled') === true) {
          this.store.find('trustNode', undefined, true);
          this.store.find('node', undefined, true);
        } else {
          this.store.find('node', undefined, true);
        }
      }
    },
    reboot: function (node) {
      var confirmed = confirm('Are you sure you want to reboot node "' + node.get('name') + '"?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reboot',
          node: this.store.getById('node', node.get('id'))
        }).save().then(function () {
          node.set('status.operational', App.REBOOTING);
          node.get('stateManager').transitionTo('rootState.loaded.saved');
          App.event('Successfully started rebooting node "' + node.get('name') + '"', App.SUCCESS);
        }, function () {
          App.event('Failed to reboot node "' + node.get('name') + '"', App.ERROR);
        });
      }
    },
    unregister: function (node) {
      var confirmed = confirm('Note: You must uninstall the SAM node agent before doing the unregister action, or the node will be re-register once the SAM agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + ' and disappear from this list of nodes. ');
      if (confirmed) {
        action = this.store.createRecord('action', {
          node: this.store.find('node', node.get('id')),
          name: "unregister"
        }).then( function () {
          App.event('Successfully unregistered node "' + node.get('name') + '"', App.SUCCESS);
        }, function () {
          App.event('Failed to unregister node "' + node.get('name') + '"', App.ERROR);
        });
        action.save();
      }
    },
    schedule: function (node, socketNumber) {
      socketNumber = Ember.isEmpty(socketNumber) ? 0 : parseInt(socketNumber.toFixed());
      var confirmed = confirm('Are you sure you want all future VMs to be placed on node "' + node.get('name') + '"?');
      if (confirmed) {
        action = this.store.createRecord('action', {
          node: this.store.find('node', node.get('id')),
          name: "scheduler_mark",
          options: {
            scheduler_mark: socketNumber,
            scheduler_persistent: true
          }
        }).then( function () {
          // Unset all other nodes
          this.store.all('node').filterProperty('isScheduled', true).forEach(function (item, index) {
            item.set('schedulerMark', null);
            item.get('stateManager').transitionTo('rootState.loaded.saved');
          });
          // Set this node for VM placement
          node.set('schedulerMark', 0);
          node.set('schedulerPersistent', true);
          node.get('stateManager').transitionTo('rootState.loaded.saved');
          App.event('Successfully set node "' + node.get('name') + '" for VM placement', App.SUCCESS);
        }, function () {
          App.event('Failed to set node "' + node.get('name') + '" for VM placement', App.ERROR);
        });
        action.save();
      }
    },
    unschedule: function (node) {
      var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
      if (confirmed) {
        action = this.store.createRecord('action', {
          node: this.store.find('node', node.get('id')),
          name: "scheduler_unmark"
        }).then( function () {
          node.set('schedulerMark', null);
          node.get('stateManager').transitionTo('rootState.loaded.saved');
          App.event('Successfully unset node "' + node.get('name') + '" for VM placement', App.SUCCESS);
        }, function () {
          App.event('Failed to unset node "' + node.get('name') + '" for VM placement', App.ERROR);
        });
        action.save();
      }
    },
    trustFingerprint: function (node) {
      var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
      if (confirmed) {
        trustMle = this.store.createRecord('trustMle', {
          node: this.store.find('node', node.get('id'))
        });
        trustMle.get('transaction').commit();
        trustMle.get('store').commit();
        trustMle.on('becameError', function () {
          var errorMessage = (trustMle.get('error')) ? trustMle.get('error') : 'An error occured while fingerprinting node. Please try again.';
          App.event(errorMessage, App.ERROR);
          trustMle.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
          trustMle.deleteRecord();
        });
        trustMle.on('becameInvalid', function () {
          var errorMessage = (trustMle.get('error')) ? trustMle.get('error') : 'An error occured while fingerprinting node. Please try again.';
          App.event(errorMessage, App.WARNING);
          trustMle.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
          trustMle.deleteRecord();
        });
        trustMle.on('didCreate', function () {
          // TODO: Work around for zombie record with null id. Only when json-api-serializer extract is: //this.extractMany.apply(this, json, type, records);
          /*
          App.TrustMle.find().forEach( function(item, index, enumerable) {
            if ((item.get('id') == null)) {
              item.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
              item.deleteRecord();
            }
          });
          */
          App.event('Successfully fingerprinted node ' + node.get('name') + '.', App.SUCCESS);
        });
      }
    },
    addTrust: function (node) {
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        trustNode = this.store.createRecord('trustNode', {
          node: this.store.find('node', node.get('id'))
        });
        trustNode.get('transaction').commit();
        trustNode.get('store').commit();
        trustNode.on('becameError', function () {
          var errorMessage = (trustNode.get('error')) ? trustNode.get('error') : 'An error occured while trusting node. Please try again.';
          App.event(errorMessage, App.ERROR);
          trustNode.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
          trustNode.deleteRecord();
        });
        trustNode.on('becameInvalid', function () {
          var errorMessage = (trustNode.get('error')) ? trustNode.get('error') : 'An error occured while trusting node. Please try again.';
          App.event(errorMessage, App.WARNING);
          trustNode.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
          trustNode.deleteRecord();
        });
        trustNode.on('didCreate', function () {
          App.event('Successfully trusted node "' + node.get('name') + '"', App.SUCCESS);
        });
      }
    },
    removeTrust: function (node) {
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        App.event('Successfully unregistered node "' + node.get('name') + '" as trusted', App.SUCCESS);
        node.get('trustNode').deleteRecord();
        node.get('transaction').commit();
        node.get('store').commit();
      }
      node.on('becameError', function () {
          var errorMessage = (node.get('error')) ? node.get('error') : 'An error occured while removing trust.';
          App.event(errorMessage, App.ERROR);
      });
    },
    exportTrustReport: function (reportContent){
      this.store.find('nodeTrustReport', reportContent.get('id')).then(function (nodeTrustReport) {
        if (nodeTrustReport !== null && (nodeTrustReport.get('attestations.length') > 0)) {
          var title = "SAM Node Trust Report";
          var subtitle = reportContent.get('name') + ' ('+reportContent.get('ids.ip_address')+')';
          var rowContent = [];
          rowContent.push("item.get('attestation_time_formatted')");
          rowContent.push("((item.get('trust_status'))?'The node was booted and was found attested as trusted.':'The node was booted and failed to be found attested as trusted.')");
          rowContent.push("item.get('trust_message')");
          App.pdfReport(nodeTrustReport, rowContent, title, subtitle, 'attestations');
        } else {
          App.event('No trust attestation logs were found for this node.', App.WARNING);
        }
      }, function () {
        App.event('Failed to load node trust report', App.ERROR);
      });
    },
    trustReportModal: function (model) {
      var controller = this;
      modal = Ember.View.create({
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
      }).appendTo('body');
    }
  }
});
