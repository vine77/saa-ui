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
    title: 'VMs',
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
  needs: ['nodesColumns', 'application'],
  itemController: 'node',
  sortProperty: 'name',
  filterProperties: ['name'],
  totalVms: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vmInfo.count') > 0) ? item.get('vmInfo.count') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vmInfo.count'),
  totalVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').rejectBy('samControlled', 0).reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vcpus.used') > 0) ? item.get('vcpus.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vcpus.used'),
  maxVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').rejectBy('samControlled', 0).reduce(function (previousValue, item, index, enumerable) {
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
          this.store.find('trustNode');
          this.store.find('node');
        } else {
          this.store.find('node');
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
          App.event('Successfully started rebooting node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          App.xhrError(xhr, 'Failed to reboot node "' + node.get('name') + '".');
        });
      }
    },
    unregister: function (node) {
      var confirmed = confirm('Note: You must uninstall the SAM node agent before doing the unregister action, or the node will be re-register once the SAM agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + '.');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "unregister"
        }).save().then( function () {
          App.event('Successfully unregistered node "' + node.get('name') + '".', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          App.xhrError(xhr, 'Failed to unregister node "' + node.get('name') + '".');
        });
      }
    },
    schedule: function (node, socketNumber) {
      var self = this;
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
          App.event('Successfully set node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          // Unset all other nodes
          self.filterBy('isScheduled').setEach('schedulerMark', null);
          // Set this node for VM placement
          node.set('schedulerMark', socketNumber);
          node.set('schedulerPersistent', true);
        }, function (xhr) {
          App.xhrError(xhr, 'Failed to set node "' + node.get('name') + '" for VM placement.');
        });
      }
    },
    unschedule: function (node) {
      var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
      if (confirmed) {
        this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_unmark"
        }).save().then(function () {
          App.event('Successfully unset node "' + node.get('name') + '" for VM placement.', App.SUCCESS);
          node.set('schedulerMark', null);
        }, function (xhr) {
          App.xhrError(xhr, 'Failed to unset node "' + node.get('name') + '" for VM placement.');
        });
      }
    },
    trustFingerprint: function (node) {
      var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
      if (confirmed) {
        var newTrustMle = this.store.createRecord('trustMle', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustMle.save().then(function (model) {
          App.event('Successfully fingerprinted node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          newTrustMle.deleteRecord();
          App.xhrError(xhr, 'An error occured while fingerprinting node "' + node.get('name') + '".');
        });
      }
    },
    addTrust: function (node) {
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        var newTrustNode = this.store.createRecord('trustNode', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustNode.save().then(function () {
          App.event('Successfully trusted node "' + node.get('name') + '".', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          newTrustNode.deleteRecord();
          App.xhrError(xhr, 'An error occured while registering node"' + node.get('name') + '" as trusted.');
        });
      }
    },
    removeTrust: function (node) {
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        var trustNode = node.get('trustNode');
        trustNode.deleteRecord();
        trustNode.save().then(function () {
          App.event('Successfully unregistered node "' + node.get('name') + '" as trusted.', App.SUCCESS);
          node.reload();
        }, function (xhr) {
          node.rollback();
          App.xhrError(xhr, 'An error occured while unregistering node "' + node.get('name') + '" as trusted.');
        });
      }
    }
  }
});
