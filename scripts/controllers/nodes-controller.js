App.NodesColumnsController = App.ColumnsController.extend({
  content: [{
    description: 'State (Health/Operational State)',
    sortBy: 'state',
    icon: 'icon-off'
  }, {
    description: 'Trust Status',
    sortBy: 'isTrusted',
    icon: 'icon-lock'
  }, {
    description: 'Node Type (Assured, Monitored, Unmonitored)',
    sortBy: 'samControlled',
    icon: 'icon-trophy'
  }, {
    title: 'Hostname',
    sortBy: 'name',
    sortAscending: true
  }, {
    title: 'VMs',
    sortBy: 'vmInfo.count'
  }, {
    title: 'Capacity',
    sortBy: 'cpuSort'
  }, {
    title: 'Allocated',
    description: 'Maximum measured capacity is in SCUs (Service Compute Units) or cores (depending on node mode), while the chart indicates how much of that capacity is used.',
    sortBy: 'utilization.scu.system.allocated'
  }, {
    title: 'RAM Used',
    description: 'Physical memory used by VMs and applications.',
    sortBy: 'utilization.memory.used'
  },{
    title: 'N. Load',
    description: '<strong>Normalized load</strong> is Linux load average divided by the number of CPUs visible to OS (including hyperthreading).' +
      '<ul>' +
        '<li><strong>Green (0-1)</strong> indicates there is no contention for CPU resources.</li>' +
        '<li><strong>Orange (1-2)</strong> indicates there is some contention for CPU resources, but the system may still be operating within acceptable range.</li>' +
        '<li><strong>Red (2+)</strong> indicates that there is considerable contention for CPU resources and the system may be operating sub-optimally and action should be taken by the system administrator.</li>' +
      '</ul>',
    sortBy: 'utilization.normalized_load'
  }, {
    title: 'Contention',
    description: 'LLC cache contention',
    sortBy: 'contention.llc.system.value'
  }, {
    title: 'Actions'
  }]
});

App.NodesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  needs: ['nodesColumns', 'application', 'quota', 'node'],
  itemController: 'node',
  sortProperty: 'name',
  sortAscending: true,
  filterProperties: ['name'],
  isMatch: function (record) {
    if (!this.get('selectedTenant')) return true;
    if (Ember.isEmpty(record.get('tenants'))) return false;
    return record.get('tenants').contains(this.get('selectedTenant'));
  },
  isMatchObserves: ['selectedTenant'],
  selectedTenant: null,
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
  totalPhysicalMemory: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (App.readableSizeToBytes(item.get('utilization.memory.used')) > 0) ? App.readableSizeToBytes(item.get('utilization.memory.used')) : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each'),
  totalRamGibibyte: function() {
    return App.readableSize(this.get('totalRam') * 1048576);
  }.property('totalRam'),
  maxRam: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('memory.max') > 0) ? item.get('memory.max') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.memory.max'),
  maxPhysicalMemory: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (App.readableSizeToBytes(item.get('capabilities.memory_size')) > 0) ? App.readableSizeToBytes(item.get('capabilities.memory_size')) : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each'),
  totalRamMessage: function () {
    return App.readableSize(this.get('totalRam') * 1048576) + ' out of ' + App.readableSize(this.get('maxRam') * 1048576);
  }.property('totalRam', 'maxRam'),
  totalPhysicalMemoryMessage: function () {
    return App.readableSize(this.get('totalPhysicalMemory') * 1048576) + ' out of ' + App.readableSize(this.get('maxPhysicalMemory') * 1048576);
  }.property('totalPhysicalMemory', 'maxPhysicalMemory'),
  totalRamWidth: function () {
    var percentage = (this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalRam', 'maxRam'),
  totalPhysicalMemoryWidth: function () {
    var percentage = (this.get('maxPhysicalMemory') == 0) ? 0 : (this.get('totalPhysicalMemory')/this.get('maxPhysicalMemory')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalPhysicalMemory', 'maxPhysicalMemory'),
  percentOfRam: function () {
    return Math.round((this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100);
  }.property('totalRam', 'maxRam'),
  percentOfPhysicalMemory: function () {
    return Math.round((this.get('maxPhysicalMemory') == 0) ? 0 : (this.get('totalPhysicalMemory')/this.get('maxPhysicalMemory')) * 100);
  }.property('totalPhysicalMemory', 'maxPhysicalMemory'),

  numberOfPages: function () {
    return Math.ceil(this.get('length')/this.get('listView.pageSize'));
  }.property('listView.pageSize', 'length'),
  isFirstPage: Ember.computed.equal('listView.currentPage', 1),
  isLastPage: function () {
    return this.get('listView.currentPage') === this.get('numberOfPages');
  }.property('listView.currentPage', 'numberOfPages'),
  visibleRows: function () {
    return Math.min(this.get('listView.pageSize'), this.get('length'));
  }.property('listView.pageSize', 'length'),

  allScuVmCapabilities: function () {
    return this.get('model').filterBy('isAssuredScuVm').filterBy('capabilities.max_scu_per_core').mapBy('capabilities.max_scu_per_core');
  }.property('model.@each'),
  allScuVcpuCapabilities: function () {
    return this.get('model').filterBy('isAssuredScuVcpu').filterBy('capabilities.max_scu_per_core').mapBy('capabilities.max_scu_per_core');
  }.property('model.@each'),
  allCoreCapabilities: function () {
    return this.get('model').filterBy('isAssuredCoresPhysical').filterBy('utilization.cores.system.max').mapBy('utilization.cores.system.max');
  }.property('model.@each'),

  maxScuVmCapabilities: function () {
    if (this.get('allScuVmCapabilities.length') > 0) {
      return Math.max.apply(null, this.get('allScuVmCapabilities'));
    } else {
      return 0;
    }
  }.property('allScuVmCapabilities'),
  minScuVmCapabilities: function () {
    if (this.get('allScuVmCapabilities.length') > 0) {
      return Math.min.apply(null, this.get('allScuVmCapabilities'));
    } else {
      return 0;
    }
  }.property('allScuVmCapabilities'),
  medianScuVmCapabilities: function () {
    if (this.get('allScuVmCapabilities.length') > 0) {
      return this.get('allScuVmCapabilities').reduce(function(previousValue, item, index, enumerable) {
        return previousValue + item;
      }, 0) / this.get('allScuVmCapabilities').get('length');
    } else {
      return 0;
    }
  }.property('allScuVmCapabilities'),

  maxScuVcpuCapabilities: function () {
    if (this.get('allScuVcpuCapabilities.length') > 0) {
      return Math.max.apply(null, this.get('allScuVcpuCapabilities'));
    } else {
      return 0;
    }
  }.property('allScuVcpuCapabilities'),
  minScuVcpuCapabilities: function () {
    if (this.get('allScuVcpuCapabilities.length') > 0) {
      return Math.min.apply(null, this.get('allScuVcpuCapabilities'));
    } else {
      return 0;
    }
  }.property('allScuVcpuCapabilities'),

  medianScuVcpuCapabilities: function () {
    if (this.get('allScuVcpuCapabilities.length') > 0) {
      return App.median(this.get('allScuVcpuCapabilities')).toFixed();
    } else {
      return 0;
    }
  }.property('allScuVcpuCapabilities'),

  maxCoreCapabilities: function () {
    if (this.get('allCoreCapabilities.length') > 0) {
      return Math.max.apply(null, this.get('allCoreCapabilities')).toFixed();
    } else {
      return 0;
    }
  }.property('allCoreCapabilities'),
  minCoreCapabilities: function () {
    if (this.get('allCoreCapabilities.length') > 0) {
      return Math.min.apply(null, this.get('allCoreCapabilities')).toFixed();
    } else {
      return 0;
    }
  }.property('allCoreCapabilities'),
  medianCoreCapabilities: function () {
    if (this.get('allCoreCapabilities.length') > 0) {
      return App.median(this.get('allCoreCapabilities')).toFixed();
    } else {
      return 0;
    }
  }.property('allCoreCapabilities'),

  // Actions
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.filterBy('isSelectable').everyProperty('isSelected');
      this.filterBy('isSelectable').setEach('isSelected', !isEverythingSelected);
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

    // Individual actions
    expand: function (model) {
      var item = this.findBy('id', model.get('id'));
      if (!model.get('isExpanded')) {
        this.transitionToRoute('nodesNode', item);
      } else {
        this.transitionToRoute('nodes');
      }
    },
    exportTrustReport: function (model) {
      model.set('isActionPending', true);
      this.store.find('nodeTrustReport', model.get('id')).then(function (nodeTrustReport) {
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
      }, function (xhr) {
        model.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to load node trust report.');
      });
    },
    reboot: function (node) {
      node.set('isActionPending', true);
      node.set('isRebooting', true);
      var confirmed = confirm('Are you sure you want to reboot node "' + node.get('name') + '"?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          name: 'reboot',
          node: this.store.getById('node', node.get('id'))
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          node.set('isRebooting', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          node.set('isRebooting', false);
          App.xhrError(xhr, 'Failed to reboot node "' + node.get('name') + '".');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
        node.set('isRebooting', false);
      }
    },
    unregister: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Note: You must uninstall the assurance node agent before doing the unregister action, or the node will be re-register once the agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + '.');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "unregister"
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unregister node "' + node.get('name') + '".');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    setMonitored: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to set the agent mode of node "' + node.get('name') + '" to monitored?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "set_agent_mode",
          options: {
            agent_mode: App.MONITORED
          }
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set the agent mode of node "' + node.get('name') + '" to monitored.');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    setAssuredCores: function(node, mode) {
      this.send('setAssured', node, App.ASSURED_CORES_PHYSICAL);
    },
    setAssuredVm: function(node, mode) {
      this.send('setAssured', node, App.ASSURED_SCU_VM);
    },
    setAssuredVcpu: function(node, mode) {
      this.send('setAssured', node, App.ASSURED_SCU_VCPU);
    },
    setAssured: function (node, mode) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to set the agent mode of node "' + node.get('name') + '" to ' + App.codeToMode(mode) + '?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "set_agent_mode",
          options: {
            agent_mode: mode
          }
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set agent mode of node "' + node.get('name') + '" to assured.');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    unschedule: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_unmark"
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
          //node.set('schedulerMark', null);
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to unset node "' + node.get('name') + '" for VM placement.');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    addTrust: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        var newTrustNode = this.store.createRecord('trustNode', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustNode.save().then(function () {
           node.set('isActionPending', false);
          App.event('Successfully trusted node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          node.set('isActionPending', false);
          newTrustNode.deleteRecord();
          App.xhrError(xhr, 'An error occured while registering node"' + node.get('name') + '" as trusted.');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    trustFingerprint: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
      if (confirmed) {
        var newTrustMle = this.store.createRecord('trustMle', {
          node: this.store.getById('node', node.get('id'))
        });
        newTrustMle.save().then(function (model) {
          node.set('isActionPending', false);
          App.event('Successfully fingerprinted node "' + node.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          node.set('isActionPending', false);
          newTrustMle.deleteRecord();
          App.xhrError(xhr, 'An error occured while fingerprinting node "' + node.get('name') + '".');
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    configureTrustAgent: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to configure the trust agent for node "' + node.get('name') + '"?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          name: 'trust_agent_config',
          node: this.store.getById('node', node.get('id'))
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to configure the trust agent for node "' + node.get('name') + '".');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    schedule: function (node, socketNumber) {
      var parentController = this;
      node.set('isActionPending', true);
      socketNumber = Ember.isEmpty(socketNumber) ? 0 : parseInt(socketNumber.toFixed());
      var confirmed = confirm('Are you sure you want all future VMs to be placed on node "' + node.get('name') + '" (socket ' + socketNumber + ')?');
      if (confirmed) {
        var action = this.store.createRecord('action', {
          node: this.store.getById('node', node.get('id')),
          name: "scheduler_mark",
          options: {
            scheduler_mark: socketNumber,
            scheduler_persistent: true
          }
        });
        action.save().then(function (action) {
          node.set('isActionPending', false);
          App.event(action.get('message'), action.get('health'));
        }, function (xhr) {
          node.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to set node "' + node.get('name') + '" for VM placement.');
          action.rollback();
        });
      } else {
        node.set('isActionPending', false);
      }
    },
    removeTrust: function (node) {
      node.set('isActionPending', true);
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        var trustNode = node.get('trustNode');
        trustNode.deleteRecord();
        trustNode.save().then(function () {
          node.set('isActionPending', false);
          App.event('Successfully unregistered node "' + node.get('name') + '" as trusted.', App.SUCCESS);
        }, function (xhr) {
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
