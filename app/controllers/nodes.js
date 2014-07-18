import Ember from 'ember';
import FilterableMixin from '../mixins/filterable';
import SortableMixin from '../mixins/sortable';

export default Ember.ArrayController.extend(FilterableMixin, SortableMixin, {
  needs: ['nodesColumns', 'application', 'quota', 'node'],
  itemController: 'node',
  sortProperty: 'name',
  sortAscending: true,
  filterProperties: ['name'],
  totalVms: function() {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function(previousValue, item, index, enumerable) {
      var count = (item.get('vmInfo.count') > 0) ? item.get('vmInfo.count') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vmInfo.count'),
  totalVcpus: function() {
    if (this.get('model') === undefined) return null;
    return this.get('model').rejectBy('samControlled', 0).reduce(function(previousValue, item, index, enumerable) {
      var count = (item.get('vcpus.used') > 0) ? item.get('vcpus.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vcpus.used'),
  maxVcpus: function() {
    if (this.get('model') === undefined) return null;
    return this.get('model').rejectBy('samControlled', 0).reduce(function(previousValue, item, index, enumerable) {
      var max = (item.get('vcpus.max') > 0) ? item.get('vcpus.max') : 0;
      return previousValue + max;
    }, 0);
  }.property('model.@each.vcpus.max'),
  totalVcpusMessage: function() {
    var maxVcpus = (this.get('maxVcpus') == 0) ? 'N/A' : this.get('maxVcpus');
    return this.get('totalVcpus') + ' out of ' + maxVcpus + ' vCPUs';
  }.property('totalVcpus', 'maxVcpus'),
  totalVcpusWidth: function() {
    var percentage = (this.get('maxVcpus') == 0) ? 0 : (this.get('totalVcpus')/this.get('maxVcpus')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalVcpus', 'maxVcpus'),
  totalRam: function() {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function(previousValue, item, index, enumerable) {
      var count = (item.get('memory.used') > 0) ? item.get('memory.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.memory.used'),
  totalRamGibibyte: function() {
    return App.readableSize(this.get('totalRam') * 1048576);
  }.property('totalRam'),
  maxRam: function() {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function(previousValue, item, index, enumerable) {
      var count = (item.get('memory.max') > 0) ? item.get('memory.max') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.memory.max'),
  totalRamMessage: function() {
    return App.readableSize(this.get('totalRam') * 1048576) + ' out of ' + App.readableSize(this.get('maxRam') * 1048576);
  }.property('totalRam', 'maxRam'),
  totalRamWidth: function() {
    var percentage = (this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalRam', 'maxRam'),
  percentOfRam: function() {
    return Math.round((this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100);
  }.property('totalRam', 'maxRam'),

  numberOfPages: function() {
    return Math.ceil(this.get('length')/this.get('listView.pageSize'));
  }.property('listView.pageSize', 'length'),
  isFirstPage: Ember.computed.equal('listView.currentPage', 1),
  isLastPage: function() {
    return this.get('listView.currentPage') === this.get('numberOfPages');
  }.property('listView.currentPage', 'numberOfPages'),
  visibleRows: function() {
    return Math.min(this.get('listView.pageSize'), this.get('length'));
  }.property('listView.pageSize', 'length'),

  allScuCapabilities: function() {
    return this.get('model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').mapBy('capabilities.max_scu_per_core');
  }.property('model.@each'),
  maxScuCapabilities: function() {
    return Math.max.apply(null, this.get('allScuCapabilities'));
  }.property('allScuCapabilities'),
  minScuCapabilities: function() {
    return Math.min.apply(null, this.get('allScuCapabilities'));
  }.property('allScuCapabilities'),
  averageScuCapabilities: function() {
    return this.get('allScuCapabilities').reduce(function(previousValue, item, index, enumerable) {
      return previousValue + item;
    }, 0) / this.get('allScuCapabilities').get('length');
  }.property('allScuCapabilities'),


  // Actions
  actions: {
    selectAll: function() {
      var isEverythingSelected = this.filterBy('isSelectable').everyProperty('isSelected');
      this.filterBy('isSelectable').setEach('isSelected', !isEverythingSelected);
    },
    refresh: function() {
      if (!this.get('isUpdating')) {
        if (App.mtWilson.get('isInstalled') === true) {
          this.store.find('trustNode');
          this.store.find('node');
        } else {
          this.store.find('node');
        }
      }
    },

    // Individual actions
    expand: function(model) {
      var item = this.findBy('id', model.get('id'));
      if (!model.get('isExpanded')) {
        this.transitionToRoute('nodesNode', item);
      } else {
        this.transitionToRoute('nodes');
      }
    },
    exportTrustReport: function(model) {
      model.set('isActionPending', true);
      this.store.find('nodeTrustReport', model.get('id')).then(function(nodeTrustReport) {
        if (nodeTrustReport !== null && (nodeTrustReport.get('attestations.length') > 0)) {
          var title = 'Node Trust Report';
          var subtitle = model.get('name') + ' ('+ model.get('ids.ip_address') + ')';
          var rowContent = [];
          rowContent.push("item.get('attestation_time_formatted')");
          rowContent.push("item.get('report_message')");
          App.pdfReport(nodeTrustReport, rowContent, title, subtitle, 'attestations');
        } else {
          App.event('No trust attestation logs were found for this node.', App.WARNING);
        }
        model.set('isActionPending', false);
      }, function(xhr) {
        model.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to load node trust report.');
      });
    },
    reboot: function(node) {
      node.set('isActionPending', true);
      node.set('isRebooting', true);
      var confirmed = confirm('Are you sure you want to reboot node "' + node.get('name') + '"?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reboot',
          node: this.store.getById('node', node.get('id'))
        }).save().then(function() {
          node.set('isActionPending', false);
          node.set('isRebooting', false);
          App.event('Successfully started rebooting node "' + node.get('name') + '".', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          node.set('isRebooting', false);
          App.xhrError(xhr, 'Failed to reboot node "' + node.get('name') + '".');
        });
      } else {
        node.set('isActionPending', false);
        node.set('isRebooting', false);
      }
    },
    unregister: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Note: You must uninstall the SAA node agent before doing the unregister action, or the node will be re-register once the SAA agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + '.');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "unregister"
        }).save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully unregistered node "' + node.get('name') + '".', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unregister node "' + node.get('name') + '".');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    setMonitored: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Warning: The node will be rebooted. Are you sure you want to set the agent mode of node "' + node.get('name') + '" to monitored?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "set_agent_mode",
          options: {
            agent_mode: App.MONITORED
          }
        }).save().then(function(action) {
          node.set('isActionPending', false);
          App.event('Successfully set the agent mode of node "' + node.get('name') + '" to monitored.', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set the agent mode of node "' + node.get('name') + '" to monitored.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    setAssured: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Warning: The node will be rebooted. Are you sure you want to set the agent mode of node "' + node.get('name') + '" to assured?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "set_agent_mode",
          options: {
            agent_mode: App.ASSURED
          }
        }).save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully set agent mode of node "' + node.get('name') + '" to assured.', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set agent mode of node "' + node.get('name') + '" to assured.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    unschedule: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_unmark"
        }).save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully unset node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          node.set('schedulerMark', null);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unset node "' + node.get('name') + '" for VM placement.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    addTrust: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        var newTrustNode = this.store.createRecord('trustNode', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustNode.save().then(function() {
           node.set('isActionPending', false);
          App.event('Successfully trusted node "' + node.get('name') + '".', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          newTrustNode.deleteRecord();
          App.xhrError(xhr, 'An error occured while registering node"' + node.get('name') + '" as trusted.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    trustFingerprint: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
      if (confirmed) {
        var newTrustMle = this.store.createRecord('trustMle', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustMle.save().then(function(model) {
          node.set('isActionPending', false);
          App.event('Successfully fingerprinted node "' + node.get('name') + '".', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          newTrustMle.deleteRecord();
          App.xhrError(xhr, 'An error occured while fingerprinting node "' + node.get('name') + '".');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    configureTrustAgent: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to configure the trust agent for node "' + node.get('name') + '"?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'trust_agent_config',
          node: this.store.getById('node', node.get('id'))
        }).save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully configured the trust agent for node "' + node.get('name') + '".', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to configure the trust agent for node "' + node.get('name') + '".');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    schedule: function(node, socketNumber) {
      var parentController = this;
      node.set('isActionPending', true);
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
        }).save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully set node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          // Unset all other nodes
          parentController.filterBy('isScheduled').setEach('schedulerMark', null);
          // Set this node for VM placement
          node.set('schedulerMark', socketNumber);
          node.set('schedulerPersistent', true);
        }, function(xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set node "' + node.get('name') + '" for VM placement.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    removeTrust: function(node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        var trustNode = node.get('trustNode');
        trustNode.deleteRecord();
        trustNode.save().then(function() {
          node.set('isActionPending', false);
          App.event('Successfully unregistered node "' + node.get('name') + '" as trusted.', App.SUCCESS);
        }, function(xhr) {
          node.set('isActionPending', false);
          node.rollback();
          App.xhrError(xhr, 'An error occured while unregistering node "' + node.get('name') + '" as trusted.');
        });
      } else {
        node.set('isActionPending', false);
      }
    }
  }
});
