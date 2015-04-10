App.NodeController = Ember.ObjectController.extend({
  needs: ['nodes', 'logBar', 'application', 'vms'],
  isExpanded: false,
  isSelected: false,
  isActionPending: false,
  isRebooting: false,
  filteredCgroups: Ember.computed.filter('cgroups', function(cgroup) {
    return cgroup.get('type') !== 'node' && cgroup.get('type') !== 'vm';
  }),
  nodeActions: function() {
    return  [
      App.ActionController.create({
        name: 'Configure Trust Agent',
        method: 'configureTrustAgent',
        icon: 'icon-unlock-alt',
        disabledWhileRebooting: true,
        sortOrder: 0,
        node: this
      }),
      App.ActionController.create({
        name: 'Unregister',
        method: 'unregister',
        icon: 'icon-remove',
        disabledWhileRebooting: false,
        sortOrder: 1,
        node: this
      }),
      App.ActionController.create({
        name: 'Fingerprint',
        method: 'trustFingerprint',
        icon: 'icon-hand-up',
        disabledWhileRebooting: true,
        sortOrder: 2,
        node: this
      }),
      App.ActionController.create({
        name: 'Add Trust',
        method: 'addTrust',
        icon: 'icon-lock',
        disabledWhileRebooting: true,
        sortOrder: 3,
        node: this
      }),
      App.ActionController.create({
        name: 'Export Trust Report',
        method: 'exportTrustReport',
        icon: 'icon-external-link',
        disabledWhileRebooting: false,
        sortOrder: 4,
        node: this
      }),
      App.ActionController.create({
        name: 'Remove Trust',
        method: 'removeTrust',
        icon: 'icon-unlock',
        disabledWhileRebooting: true,
        sortOrder: 5,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to monitored',
        method: 'setMonitored',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 6,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to ' + App.codeToMode(App.ASSURED_SCU_VM),
        method: 'setAssuredVm',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 7,
        node: this
      }),
      App.ActionController.create({
        name: 'Change agent mode to ' + App.codeToMode(App.ASSURED_CORES_PHYSICAL),
        method: 'setAssuredCores',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 8,
        node: this
      }),
      App.ActionController.create({
        name: 'Place VMs on Socket',
        method: 'schedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: true,
        sortOrder: 9,
        node: this
      }),
      App.ActionController.create({
        name: 'Unset for VM placement',
        method: 'unschedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: false,
        sortOrder: 10,
        node: this
      })
    ];
  }.property('@each', 'App.mtWilson.isInstalled'),

  systemContention: function() {
    return this.get('contention.llc.system.value');
  }.property('contention.llc.system.value'),

  utilizationCoresCgroups: function() {
    return this.get('utilization.cores.cgroups');
  }.property('utilization.cores.cgroups.@each'),
  hasCores: function() {
    return (this.get('osCores') > 1 && this.get('vmCores') > 1);
  }.property('osCores'),

  osCores: function() {
    if (Ember.isEmpty(this.get('utilization.cores.cgroups'))) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', 'os')) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', 'os').used) return 0;
    return this.get('utilization.cores.cgroups').findBy('type', 'os').used.length;
  }.property('utilizationCoresCgroups.@each'),
  vmCores: function() {
    if (Ember.isEmpty(this.get('utilization.cores.cgroups'))) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', 'vm')) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', 'vm').used) return 0;
    return this.get('utilization.cores.cgroups').findBy('type', 'vm').used.length;
  }.property('utilizationCoresCgroups.@each'),
  sixWindCores: function() {
    if (Ember.isEmpty(this.get('utilization.cores.cgroups'))) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', '6Wind')) return 0;
    if (!this.get('utilization.cores.cgroups').findBy('type', '6Wind').used) return 0;
    return this.get('utilization.cores.cgroups').findBy('type', '6Wind').used.length;
  }.property('utilizationCoresCgroups.@each'),

  scuUtilizationCgroups: function() {
    return this.get('utilization.scu.cgroups');
  }.property('utilization.scu.cgroups.@each'),

  contentionCgroups: function() {
    return this.get('contention.llc.cgroups');
  }.property('contention.cgroups.@each'),
  osContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', 'os');
  }.property('contentionCgroups'),
  vmContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', 'vm');
  }.property('contentionCgroups'),
  sixWindContention: function() {
    return this.get('contentionCgroups') && this.get('contentionCgroups').findBy('type', '6Wind');
  }.property('contentionCgroups'),

  scuOsUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', 'os');
  }.property('scuUtilizationCgroups'),
  scuVmUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', 'vm');
  }.property('scuUtilizationCgroups'),
  scu6WindUtilization: function() {
    return this.get('scuUtilizationCgroups') && this.get('scuUtilizationCgroups').findBy('type', '6wind');
  }.property('scuUtilizationCgroups'),

  scuTooltip: function() {
    var messages = [];
    messages.push('System:  ' + this.get('scuTotal') + ' out of ' + this.get('utilization.scu.system.max'));
    if (!!this.get('scuOsUtilization.max')) { messages.push('OS: ' + this.get('scuOsUtilization.value') + ' out of ' + this.get('scuOsUtilization.max')); }
    if (!!this.get('scu6WindUtilization.max')) { messages.push('6Wind: </strong>' + this.get('scu6WindUtilization.value') + ' out of ' + this.get('scu6WindUtilization.max')); }
    if (!!this.get('scuVmUtilization.max')) { messages.push('VM: ' + this.get('scuVmUtilization.value') + ' out of ' + this.get('scuVmUtilization.max')); }
    if (!!this.get('scuUnallocated')) { messages.push('Unallocated: ' + App.stripFloat(this.get('scuUnallocated'))); }
    return messages.join('<br>');
  }.property('scuTotal', 'utilization.scu.system.max', 'scuOsUtilization.max', 'scu6WindUtilization.max', 'scuUnallocated'),
  scuPopoverCgroups: function() {
    var messages = [];
    if (!!this.get('scuOsUtilization.max')) {
      messages.pushObject({
        title: "OS",
        value: this.get('scuOsUtilization.value') + ' out of ' + this.get('scuOsUtilization.max'),
        current: this.get('scuOsUtilization.value'),
        max: this.get('scuOsUtilization.max')
      });
    }
    if (!!this.get('scu6WindUtilization.max')) {
      messages.pushObject({
        title: "6Wind",
        value: this.get('scu6WindUtilization.value') + ' out of ' + this.get('scu6WindUtilization.max'),
        current: this.get('scu6WindUtilization.value'),
        max: this.get('scu6WindUtilization.max')
      });
    }
    if (!!this.get('scuVmUtilization.max')) {
      messages.pushObject({
        title: "VM",
        value: this.get('scuVmUtilization.value') + ' out of ' + this.get('scuVmUtilization.max'),
        current: this.get('scuVmUtilization.value'),
        max: this.get('scuVmUtilization.max')
      });
    }
    return messages;
  }.property('scuVmUtilization.max', 'scu6WindUtilization.max', 'scuOsUtilization.max'),

  scuPopoverTitle: function() {
    var messages = [];
    messages.push('<strong>Overall Node Total:</strong> &#9;&#9;' + this.get('scuTotal') + ' out of ' + this.get('utilization.scu.system.max'));
    if (!!this.get('scuUnallocated')) { messages.push('<strong>Node Unallocated:</strong> &#9;&#9;' + App.stripFloat(this.get('scuUnallocated')) + ' out of ' + this.get('utilization.scu.system.max') ); }
    return messages.join('<br />');
  }.property('scuTotal', 'scuUnallocated', 'utilization.scu.system.max'),
  contentionPopoverCgroups: function() {
    var messages = [];
    if (!!this.get('osContention.max')) {
      messages.pushObject({
        title: "OS",
        value: this.get('osContention.value'),
        current: this.get('osContention.value'),
        max: this.get('osContention.max')
      });
    }
    if (!!this.get('vmContention.max')) {
      messages.pushObject({
        title: "VM",
        value: this.get('vmContention.value'),
        current: this.get('vmContention.value'),
        max: this.get('vmContention.max')
      });
    }
    if (!!this.get('sixWindContention.max')) {
      messages.pushObject({
        title: "6Wind",
        value: this.get('sixWindContention.value'),
        current: this.get('sixWindContention.value'),
        max: this.get('sixWindContention.max')
      });
    }
    return messages;
  }.property('contentionMessage', 'vmContention.max', 'osContention.max', 'sixWindContention.max'),

  contentionTooltip: function() {
    var messages = [];
    //messages.push(this.get('contentionMessage'));
    if (!!this.get('osContention.max')) { messages.push('OS: ' + this.get('osContention.value') ); }
    if (!!this.get('vmContention.max')) { messages.push('VM: ' + this.get('vmContention.value') ); }
    if (!!this.get('sixWindContention.max')) { messages.push('6Wind: ' + this.get('sixWindContention.value') ); }
    return messages.join('');
  }.property('contentionMessage', 'vmContention.max', 'osContention.max', 'sixWindContention.max'),

  contentionDetailsMessage: function() {
    var messages = [];
    if (!!this.get('osContention.max')) { messages.push('OS: ' + this.get('osContention.value')); }
    if (!!this.get('vmContention.max')) { messages.push('VM: ' + this.get('vmContention.value')); }
    if (!!this.get('sixWindContention.max')) { messages.push('6Wind: ' + this.get('sixWindContention.value')); }
    if (messages.length > 0) {
      return messages.join('<br>');
    } else {
      return 'No contention data available.'
    }
  }.property('contentionMessage', 'vmContention.max', 'osContention.max', 'sixWindContention.max'),

  scuUnallocated: function() {
    if (App.isEmpty(this.get('utilization.scu.system.max')) || App.isEmpty(this.get('utilization.scu.system.allocated'))) return 0;
    return Math.max(0, this.get('utilization.scu.system.max') - App.stripFloat(this.get('utilization.scu.system.allocated')));
  }.property('utilization.scu.system.max', 'utilization.scu.cgroups.@each'),

  scuValuesExist: function () {
    return typeof this.get('scuValues') !== 'undefined' && this.get('scuValues') !== null && this.get('scuValues').length > 0;
  }.property('scuValues.@each', 'scuValues'),

  scuValues: function() {
    var returnArray = [];
    if (this.get('scuUtilizationCgroups')) {
      this.get('scuUtilizationCgroups').forEach(function(item, index, enumerable) {
        var utilizationCurrent = App.stripFloat(item.compute + item.misc);
        var notUtilized = Math.max(0, App.stripFloat(item.max - utilizationCurrent));
        if (item.type == 'vm') {
          var guaranteed = item.min;
          var notUtilized = Math.max(0, App.stripFloat(item.min - utilizationCurrent));
        } else {
          var guaranteed = item.max;
          var notUtilized = Math.max(0, App.stripFloat(item.max - utilizationCurrent));
        }
        var ulitizationCurrentAvailable = !Ember.isEmpty(utilizationCurrent);
        returnArray.push({
          type: item.type.toUpperCase(),
          min: item.min,
          max: item.max,
          compute: item.compute,
          misc: item.misc,
          sortOrder: App.typeToSortOrder(item.type),
          utilizationCurrent: (ulitizationCurrentAvailable) ? utilizationCurrent : 0,
          notUtilized: notUtilized,
          guaranteed: guaranteed,
          ulitizationCurrentAvailable: ulitizationCurrentAvailable
        });
      });
    }
    return returnArray.sortBy('sortOrder');
  }.property('scuUtilizationCgroups.@each', 'scuUnallocated'),

  vmUtilization: function() {
    var vm = this.get('scuValues').findBy('type', 'VM');
    return Math.min(vm.utilizationCurrent, vm.min);
  }.property('scuValues.@each'),
  vmNotUtilized: function() {
    var vm = this.get('scuValues').findBy('type', 'VM');
    return Math.max(0, App.stripFloat(vm.min - this.get('vmUtilization')));
  }.property('scuValues.@each', 'vmUtilization'),
  vmBestEffortAllocation: function() {
    var vm = this.get('scuValues').findBy('type', 'VM');
    return vm && Math.max(0, App.stripFloat(vm.max - vm.min));
  }.property('scuValues.@each'),
  vmBestEffortUtilization: function() {
    var vm = this.get('scuValues').findBy('type', 'VM');
    return vm && Math.max(0, vm.utilizationCurrent - vm.min);
  }.property('scuValues.@each'),
  vmBestEffortNotUtilized: function() {
    var vm = this.get('scuValues').findBy('type', 'VM');
    return vm && Math.max(0, (this.get('vmBestEffortAllocation') - this.get('vmBestEffortUtilization')));
  }.property('scuValues.@each', 'vmBestEffortUtilization', 'vmBestEffortAllocation'),
  scuValuesGuaranteedSum: function() {
    return App.stripFloat(this.get('scuValues').reduce(function(previousValue, item, index, enumerable) {
      if (item.type == "VM") { return previousValue + item.min; }
      return previousValue + item.max;
    }, 0));
  }.property('scuValues.@each'),
  scuValuesUnallocated: function() {
    return Math.max(0, (this.get('utilization.scu.system.max') - this.get('scuValuesGuaranteedSum') - this.get('vmBestEffortAllocation')).toFixed(2));
  }.property('utilization.scu.system.max', 'scuValuesGuaranteedSum', 'vmBestEffortAllocation'),
  scuCgroupSunburst: function() {
    var self = this;
    var layout = {
      "name": "scu_chart",
      "children": []
    };
    var unallocatedSegment = {
      "name": "Unallocated",
      "fill_type": "gray",
      "size": App.stripFloat(self.get('scuValuesUnallocated'))
    }
    layout.children.push(unallocatedSegment);

    this.get('scuValues').forEach(function(item, index, enumerable) {
      var detailsChildren = {
        "name": "scu_chart_details",
        children: [
          {
            "name": "Compute",
            "fill_type": "dark-green",
            "size": item.compute
          },
          {
            "name": "Miscellaneous",
            "fill_type": "yellow",
            "size": item.misc
          }
        ]
      };

      if (item.type == "VM") {
        var vmUtilizationSegment = {
          "name": "VM Guaranteed",
          "description": "Allocation",
          "fill_type": "blue",
          "size": item.min,
          "children": [
            {
              "name": "VM Utilization",
              "fill_type": "light-green",
              "size": App.stripFloat(self.get('vmUtilization')),
              "detailsChildren": detailsChildren,
              "eventSiblingId": "VM"
            },
            {
              "name": "Not Utilized",
              "fill_type": "gray",
              "size": App.stripFloat(self.get('vmNotUtilized'))
            }
          ]
        };

        var vmBestEffortSegment = {
          "name": "VM Best Effort",
          "fill_type": "gray",
          "size": App.stripFloat(self.get('vmBestEffortAllocation')),
          "children": [
            {
              "name": "VM Utilization",
              "fill_type": "light-green",
              "size": App.stripFloat(self.get('vmBestEffortUtilization')),
              "detailsChildren": detailsChildren,
              "eventSiblingId": "VM"
            },
            {
              "name": "Not Utilized",
              "fill_type": "gray",
              "size": App.stripFloat(self.get('vmBestEffortNotUtilized'))
            }
          ]
        };
        layout.children.push(vmUtilizationSegment);
        layout.children.push(vmBestEffortSegment);

      } else {
        var segment = {
          "name": item.type,
          "fill_type": "blue",
          "description": "Allocation",
          "size": item.max,
          "children": [
            {
              "name": "Utilization",
              "fill_type": "light-green",
              "size": item.utilizationCurrent,
              "detailsChildren": detailsChildren
            },
            {
              "name": "Not Utilized",
              "fill_type": "gray",
              "size": item.notUtilized
            }
          ]
        };
        layout.children.push(segment);
      }

    });
    return layout;
  }.property('scuValues.@each', 'scuValues'),
  sunburstCacheValues: [
    { "value": "contention.system.llc.cache_usage.used", "label": "Cache Used" },
    { "value": "capabilities.scu_allocated_min", "label": "SCU Allocation" },
    { "value": "utilizationCurrent", "label": "SCU Utilization" },
    { "value": "utilization.memory", "label": "VMs Memory Allocation" }
  ],
  currentSunburstCacheValue: 'contention.system.llc.cache_usage.used',
  vmsExist: function() {
    return !Ember.isEmpty(this.get('vms'));
  }.property('vms.@each', 'vms', 'scuValues'),
  cacheSunburstAvailable: function() {
    var self = this;
    var vmData = this.get('controllers.vms').filterBy('node.id', self.get('id')).filter(function(item, index, enumerable) {
      if (item.get(self.get('currentSunburstCacheValue')) > -1) {
        return item.get(self.get('currentSunburstCacheValue'));
      }
    });
    var cgroupData = this.get('filteredCgroups').filter(function(cgroup, index, enumerable) {
      if (self.get('currentSunburstCacheValue') === 'utilizationCurrent') {
        cgroup.set('utilizationCurrent', cgroup.get('scuTotal'));
      }
      if (cgroup.get(self.get('currentSunburstCacheValue')) > -1) {
        return cgroup.get(self.get('currentSunburstCacheValue'));
      }
    });
    return (vmData.length > 0 || cgroupData.length > 0);
  }.property('vms', 'vms.@each', 'currentSunburstCacheValue', 'filteredCgroups', 'filteredCgroups.@each'),
  vmsCacheSunburst: function() {
    var self = this;
    var layout = {
      "name": "scu_chart",
      "units": "KiB",
      "children": []
    };
    var self = this;
    switch(self.get('currentSunburstCacheValue')) {
      case "utilization.memory":
        layout.units = "MiB";
        var memoryAllocatedTotal = 0;
        // Append VM segments
        this.get('controllers.vms').filterBy('node.id', self.get('id')).forEach( function(vm, index, enumerable) {
          var memoryAllocated = App.readableSizeToBytes(vm.get('utilization.memory')) / 1048576;
          var segment = {
            name: "VM",
            fill_type: "blue",
            description: 'Memory',
            size: ((memoryAllocated >= 0) ? App.stripFloat(memoryAllocated) : 0),
            route: "vmsVm",
            routeId: vm.get('id'),
            routeLabel: vm.get('name')
          }
          layout.children.push(segment);
          memoryAllocatedTotal = memoryAllocatedTotal + memoryAllocated;
        });
        // Append unallocated segment
        var segment = {
          name: "Unallocated",
          fill_type: "gray",
          description: "Memory",
          size: ((self.get('utilization.cloud.memory.max')) - memoryAllocatedTotal).toFixed(2)
        }
        layout.children.push(segment);
        break;
      case "contention.system.llc.cache_usage.used":
        layout.units = "KiB";
        // Append VM segments
        this.get('controllers.vms').filterBy('node.id', self.get('id')).forEach( function(vm, index, enumerable) {
          var segment = {
            name: "VM Cache Used",
            dynamic_color: App.rangeToColor(vm.get('contention.system.llc.value'), 0, 50, 25, 40),
            description: 'Contention: ' + vm.get('contention.system.llc.value'),
            size: ((vm.get('contention.system.llc.cache_usage.used') >= 0) ? App.stripFloat(vm.get('contention.system.llc.cache_usage.used')) : 0),
            route: "vmsVm",
            routeId: vm.get('id'),
            routeLabel: vm.get('name')
          }
          layout.children.push(segment);
        });
        // Append other cgroup segments
        this.get('filteredCgroups').forEach(function(cgroup) {
          var segment = {
            name: cgroup.get('type').toUpperCase(),
            dynamic_color: App.rangeToColor(cgroup.get('contention.system.llc.value'), 0, 50, 25, 40),
            description: 'Contention: ' + cgroup.get('contention.system.llc.value'),
            size: ((cgroup.get('contention.system.llc.cache_usage.used') >= 0) ? App.stripFloat(cgroup.get('contention.system.llc.cache_usage.used')) : 0)
          }
          layout.children.push(segment);
        });
        break;
      case "capabilities.scu_allocated_min":
        layout.units = "SCUs";
        //Append VM segments
        var minAllocatedTotal = 0;
        this.get('controllers.vms').filterBy('node.id', self.get('id')).forEach( function(vm, index, enumerable) {
          var segment = {
            name: "VM",
            description: "Allocation",
            fill_type: "blue",
            size: ((vm.get('capabilities.scu_allocated_min') >= -1) ? App.stripFloat(vm.get('capabilities.scu_allocated_min')) : 0),
            route: "vmsVm",
            routeId: vm.get('id'),
            routeLabel: vm.get('name')
          }
          layout.children.push(segment);
          minAllocatedTotal = minAllocatedTotal + vm.get('capabilities.scu_allocated_min');
        });
        // Append other cgroup segments
        this.get('filteredCgroups').forEach(function(cgroup) {
          var segment = {
            name: cgroup.get('type').toUpperCase(),
            description: "Allocation",
            fill_type: "blue",
            size: ((cgroup.get('capabilities.scu_allocated_min') >= -1) ? App.stripFloat(cgroup.get('capabilities.scu_allocated_min')) : 0),
          }
          layout.children.push(segment);
          minAllocatedTotal = minAllocatedTotal + cgroup.get('capabilities.scu_allocated_min');
        });
        // Append unallocated segment
        var segment = {
          name: "Unallocated",
          fill_type: "gray",
          size: (this.get('utilization.scu.system.max') - minAllocatedTotal).toFixed(2)
        }
        layout.children.push(segment);
        break;
      case "utilizationCurrent":
        layout.units = "SCUs";
        // Append VM segments
        var utilizationCurrentTotal = 0;
        this.get('controllers.vms').filterBy('node.id', self.get('id')).forEach( function(vm, index, enumerable) {
          var segment = {
            name: "VM",
            //dynamic_color: App.rangeToColor(vm.get('contention.system.llc.value'), 0, 50, 25, 40),
            fill_type: "light-green",
            description: "Utilization",
            size: ((vm.get('utilizationCurrent') >= -1) ? App.stripFloat(vm.get('utilizationCurrent')) : 0),
            route: "vmsVm",
            routeId: vm.get('id'),
            routeLabel: vm.get('name')
          };
          layout.children.push(segment);
          utilizationCurrentTotal = utilizationCurrentTotal + vm.get('utilizationCurrent');
        });
        // Append cgroup segments
        this.get('filteredCgroups').forEach(function(cgroup) {
          cgroup.set('utilizationCurrent', cgroup.get('scuTotal'));
          var segment = {
            name: cgroup.get('type').toUpperCase(),
            fill_type: "light-green",
            description: "Utilization",
            size: ((cgroup.get('utilizationCurrent') >= -1) ? App.stripFloat(cgroup.get('utilizationCurrent')) : 0)
          };
          layout.children.push(segment);
          utilizationCurrentTotal = +utilizationCurrentTotal + +cgroup.get('utilizationCurrent');
        });
        // Append unutilized segment
        var segment = {
          name: "Unutilized",
          fill_type: "gray",
          size: (this.get('utilization.scu.system.max') - utilizationCurrentTotal).toFixed(2)
        }
        layout.children.push(segment);
        break;
      default:
        break;
    }
    return layout;
  }.property('vms.@each', 'cgroupsTest.@each', 'currentSunburstCacheValue'),

  scuCurrentExceedsMax: function() {
    var returnVal = false;
    if (this.get('scuUtilizationCgroups')) {
      this.get('scuUtilizationCgroups').forEach(function(item, index, enumerable) {
        if (Number(item.value) > Number(item.max)) { returnVal = true; }
      });
    }
    return returnVal;
  }.property('scuUtilizationCgroups'),

  contentionValues: function() {
    var returnArray = [];
    if (this.get('contentionCgroups')) {
      this.get('contentionCgroups').forEach(function(item, index, enumerable) {
        returnArray.push({
          min: item.min,
          max: item.max,
          value: item.value,
          sortOrder: App.typeToSortOrder(item.type),
          type: item.type.toUpperCase(),
          currentExceedsMax: ((item.value > item.max)?true:false)
        });
      });
    }
    return returnArray;
  }.property('contentionCgroups'),
  contentionCurrentExceedsMax: function() {
    var returnVal = false;
    if (this.get('contentionCgroups')) {
      this.get('contentionCgroups').forEach(function(item, index, enumerable) {
        if (Number(item.value) > Number(item.max)) { returnVal = true; }
      });
    }
    return returnVal;
  }.property('contentionCgroups'),

  nodeActionsAreAvailable: function() {
    return this.get('nodeActions') && this.get('nodeActions').filterBy('isListItem', true).length > 0;
  }.property('nodeActions.@each'),

  updateKibana: function() {
    var self = this;
    if (!frames['allLogsFrame'] || !frames['allLogsFrame'].angular) return;
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    var nodeId = ((this.get('id'))?this.get('id').toString():'');

    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaNodesQuery').push('host_id: \"'+nodeId+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.nodes') !== null)?this.get('controllers.logBar.kibanaFieldIds.nodes'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaNodesQuery').join(' OR ') + ")"
      }, fieldId);

      this.set('controllers.logBar.kibanaFieldIds.nodes', newFieldId);
      dashboard.refresh();

    } else {

      var inArray = $.inArray('host_id: \"'+nodeId+'\"', this.get('controllers.logBar.kibanaNodesQuery'));
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

  maxMemory: function() {
    return parseFloat( App.readableSizeToBytes(this.get('capabilities.memory_size')));
  }.property('capabilities.memory_size'),
  memoryUsed: function() {
    return parseFloat(App.readableSizeToBytes(this.get('utilization.memory.used')));
  }.property('utilization.memory.used'),
  percentOfMemory: function () {
    return Math.round(100 * parseFloat(App.readableSizeToBytes(this.get('utilization.memory.used')) ) / this.get('maxMemory'));
  }.property('utilization.memory.used', 'maxMemory'),
  percentOfMemoryWidth: function () {
    return 'width:'+this.get('percentOfMemory')+'%';
  }.property('percentOfMemory'),
  percentOfMemoryMessage: function() {
    return App.readableSize(this.get('utilization.memory.used')) + ' used out of ' + App.readableSize(this.get('capabilities.memory_size'));
  }.property('utilization.memory.used', 'capabilities.memory_size'),
  percentOfMemoryAvailable: function () {
    if (isNaN(this.get('percentOfMemory')) || this.get('maxMemory') <= 0) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfMemory', 'maxMemory'),

  // Computed properties
  isAgentInstalled: Ember.computed.bool('status.mode'),
  isMonitored: Ember.computed.equal('status.mode', App.MONITORED),
  isAssuredScuVcpu: Ember.computed.equal('status.mode', App.ASSURED_SCU_VCPU),
  isAssuredScuVm: Ember.computed.equal('status.mode', App.ASSURED_SCU_VM),
  isAssuredCoresPhysical: Ember.computed.equal('status.mode', App.ASSURED_CORES_PHYSICAL),
  isSelectable: function() {
    return this.get('isAgentInstalled');
  }.property('isAgentInstalled'),
  nodeTypeMessage: function () {
    var nodeTypeMessage = 'This node is in ' + App.codeToMode(this.get('status.mode')) + ' mode.';
    if (this.get('isAssured')) {
      nodeTypeMessage += ' VMs with SLAs may be placed here.';
    } else {
      nodeTypeMessage += ' VMs with SLAs may not be placed here.';
    }
    return nodeTypeMessage;
  }.property('status.mode'),
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
  isHealthy: function() {
    return (this.get('status.health') == App.SUCCESS) || (this.get('status.health') == App.INFO);
  }.property('status.health'),
  isUnhealthy: Ember.computed.not('isHealthy'),
  healthMessage: function () {
    if (!this.get('isAgentInstalled') && App.isEmpty(this.get('status.short_message'))) {
      return 'Not under ' + App.application.get('title') + ' control';
    }
    if (App.isEmpty(this.get('status.short_message'))) {
      // If status message is empty, just show health as a string
      return 'Health: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else {
      return this.get('status.short_message').trim().replace('!', '.').capitalize();
    }
  }.property('status.short_message', 'status.health', 'isAgentInstalled'),
  operationalMessage: function () {
    return 'State: ' + App.codeToOperational(this.get('status.operational')).capitalize();
  }.property('status.operational'),
  nodeType: function () {
    var services = this.get('cloudServices').mapBy('name');
    if (services.length < 1) return 'generic';
    if (services.indexOf('assured-scu-vcpu') !== -1) return 'assured-scu-vcpu';
    if (services.indexOf('networking') !== -1) return 'networking';
    if (services.indexOf('storage') !== -1) return 'storage';
    return 'generic';
  }.property('cloudServices'),

  isTrustRegistered: Ember.computed.bool('trustNode'),
  isTrusted: Ember.computed.equal('status.trust_status.trust', App.TRUSTED),
  isUntrusted: Ember.computed.equal('status.trust_status.trust', App.UNTRUSTED),
  isTrustUnknown: Ember.computed.not('status.trust_status.trust'),

  isTrustAgentInstalled: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_TRUE),
  isTrustAgentNotInstalled: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_FALSE),
  isTrustAgentUnknown: Ember.computed.equal('status.trust_status.trust_config', App.TRUST_CONFIG_UNKNOWN),

  isTrustAgentNotInstalledOrUnknown: function() {
    return this.get('isTrustAgentNotInstalled') || this.get('isTrustAgentUnknown') || !(this.get('isTrustAgentInstalled'));
  }.property('isTrustAgentNotInstalled', 'isTrustAgentUnknown'),

  isTrustRegisteredMessage: function () {
    if (this.get('isTrustRegistered')) {
      return '<div class="tooltip-title">Currently registered with Trust Server</div>' + this.get('trustAgentMessage');
    } else {
      return '<div class="tooltip-title">Not registered with Trust Server</div>' + this.get('trustAgentMessage');
    }
  }.property('isTrustRegistered'),

  trustMessage: function () {
    var message = 'Trust Status: ' + App.trustToString(this.get('status.trust_status.trust')).capitalize();
    message += '<br>' + 'BIOS: ' + App.trustToString(this.get('status.trust_status.trust_details.bios')).capitalize();
    message += '<br>' + 'VMM: ' + App.trustToString(this.get('status.trust_status.trust_details.vmm')).capitalize();
    if (this.get('isUntrusted')) message += '<br><em>Note: Check PCR Logs tab for details.</em>';
    message +=  this.get('trustAgentMessage');
    return message;
  }.property('status.trust_status.trust'),

  trustAgentMessage: function() {
    var message = '<ul>';
      message += '<li>&bull; Trust Config: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config')).capitalize() + '&nbsp;&nbsp;&nbsp;&nbsp; &bull; TPM Enabled: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tpm_enabled')).capitalize() + '</li>';
      message += '<li>&bull; Tboot Measured Launch: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tboot_measured_launch')).capitalize() + '</li>';
      message += '<li>&bull; Trust Agent </li>';
      message += '<li>';
        message += '<ul>';
          message += '<li>&bull; Installed: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_installed')).capitalize() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &bull; Running: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_running')).capitalize() + '</li>';
          message += '<li>&bull; Paired: ' + App.codeToTrustConfig(this.get('status.trust_status.trust_config_details.tagent_paired')).capitalize() + '</li>';
          message += '<li>&bull; Version: ' + App.na(this.get('status.trust_status.trust_config_details.tagent_actual_version')) + ' (Expected version: ' + App.na(this.get('status.trust_status.trust_config_details.tagent_expected_version')) + ')</li>';
        message += '</ul>';
      message += '</li>';
    message += '</ul>';

    if (!this.get('isTrustAgentInstalled')) { return message; } else { return ''; }
  }.property('status.trust_status.trust_config_details.tagent_expected_version', 'status.trust_status.trust_config_details.tagent_actual_version', 'status.trust_status.trust_config_details.tagent_paired', 'status.trust_status.trust_config_details.tagent_running', 'status.trust_status.trust_config_details.tagent_installed', 'status.trust_status.trust_config_details.tboot_measured_launch', 'status.trust_status.trust_config_details.tpm_enabled', 'status.trust_status.trust_config_details.trust_config'),

  computeMessage: function() {
    var message = 'SAA Compute Units: ';
    if (App.isEmpty(this.get('scuTotal'))) return message + 'N/A';
    return message + this.get('scuTotal') + ' out of ' + this.get('utilization.scu.system.max') + ' SCU';
  }.property('scuTotal', 'utilization.scu.system.max'),
  computeWidth: function () {
    if (this.get('scuTotal') === 0 || App.isEmpty(this.get('scuTotal'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('utilization.scu.system.allocated'), 0, this.get('utilization.scu.system.max'));
      return 'width:' + percent + '%;';
    }
  }.property('scuTotal', 'utilization.scu.system.allocated', 'utilization.scu.system.max'),
  computeExists: Ember.computed.notEmpty('scuTotal'),

  hasContention: Ember.computed.notEmpty('systemContention'),
  contentionFormatted: function () {
    return Math.round(this.get('systemContention') * 100) / 100;
  }.property('contention.llc.system.value'),
  contentionMessage: function() {
    if (App.isEmpty(this.get('contention.llc.system.value'))) {
      return 'System LLC Cache Contention: N/A';
    } else {
      var message = 'Overall LLC Cache Contention: ' + this.get('systemContention');
      var sockets = this.get('contention.sockets');
      if (!Ember.isArray(sockets) || sockets.length === 0) return message;
      return message + '<br>' + sockets.map(function(socket) {
        return 'Socket ' + socket.socket_number + ' Contention: ' + socket.llc.value + ' (' + socket.llc.label + ')'
      }).join('<br>');
    }
  }.property('contention'),
  contentionWidth: function () {
    if (this.get('systemContention') === 0 || App.isEmpty(this.get('systemContention'))) {
      return 'display:none;';
    } else {
      percent = App.rangeToPercentage(this.get('systemContention'), 0, 50);
      return 'width:' + percent + '%;';
    }
  }.property('systemContention'),
  socketsEnum: function () {
    var socketsEnum = [];
    for (var i = 0; i < this.get('capabilities.sockets'); i++) {
      socketsEnum.push(i);
    }
    return socketsEnum;
  }.property('capabilities.sockets'),

  // Icons for list view table
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
  }.observes('isExpanded'),
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
      this.get('controllers.nodes').send('exportTrustReport', model);
    },
    graphTimeAgo: function(timeAgo) {
      this.set('graphTimeAgoValue', timeAgo);
      App.graphs.graph(this.get('id'), this.get('name'), 'node', this.get('capabilities.sockets'), timeAgo);
    },
    changeRoute: function(route, routeId) {
      this.transitionToRoute(route, routeId);
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
    return 'Health State: ' + App.priorityToType(this.get('health')).capitalize();
  }.property('health'),
  operationalMessage: function() {
    return 'Operational State: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational')

});

App.ActionController = Ember.ObjectController.extend({
  isDisabled: function() {
    return this.get('node.isRebooting') && this.get('disabledWhileRebooting');
  }.property('node.@each', 'node.isRebooting'),
  isListItem: function() {
    switch (this.get('method')) {
      case 'exportTrustReport':
        return App.mtWilson.get('isInstalled');
      case 'removeTrust':
        return (App.mtWilson.get('isInstalled')) ? this.get('node.isTrustRegistered') : false;
      case 'addTrust':
        return (App.mtWilson.get('isInstalled')) ? !this.get('node.isTrustRegistered') : false;
      case 'trustFingerprint':
        return App.mtWilson.get('isInstalled');
      case 'configureTrustAgent':
        return App.mtWilson.get('isInstalled');
      case 'unschedule':
        return this.get('node.isScheduled');
      case 'schedule':
        return false;
      case 'unregister':
        return this.get('node.samRegistered');
      case 'setMonitored':
        return (this.get('node.isAgentInstalled') && (this.get('node.status.mode') !== App.MONITORED));
      case 'setAssuredVcpu':
        return (this.get('node.isAgentInstalled') && (this.get('node.status.mode') !== App.ASSURED_SCU_VCPU));
      case 'setAssuredVm':
        return (this.get('node.isAgentInstalled') && (this.get('node.status.mode') !== App.ASSURED_SCU_VM));
      case 'setAssuredCores':
        return (this.get('node.isAgentInstalled') && (this.get('node.status.mode') !== App.ASSURED_CORES_PHYSICAL));
      default:
        return false;
    }
  }.property('node.isAssured', 'node.isMonitored', 'node.samRegistered', 'node.isScheduled', 'node.isTrustRegistered'),

  additionalListItems: function() {
    var additionalListItems = [];
    if (this.get('method') == 'schedule') {
      if (this.get('node') && !this.get('node.isScheduled')) {
        this.get('node.socketsEnum').forEach( function(item, index, enumerable) {
          additionalListItems.push('<li {{bind-attr class="isDisabled:disabled"}}><a {{action "performAction" method contextNode '+item+'}}><i class="icon-magnet"></i> Place VMs on Socket '+item+'</a></li>');
        });
      }
    }
    if (additionalListItems.length > 0) {
      return Ember.View.extend({
        tagName: '',
        template: Ember.Handlebars.compile(additionalListItems.join(''))
      });
    } else {
      return false;
    }
  }.property('node.socketsEnum.@each', 'node.isScheduled'),

  actions: {
    performAction: function(method, contextNode, thirdArgument) {
      if (method == 'schedule' || method == 'setAssured') {
        contextNode.get('parentController').send(method, contextNode, thirdArgument);
      } else {
        contextNode.get('parentController').send(method, contextNode);
      }
    }
  }

});

App.PopoverCgroupController = Ember.ObjectController.extend({
  currentExceedsMax: function() {
    return (this.get('current') > this.get('max'));
  }.property('current', 'max')
});

App.ScuValueController = Ember.ObjectController.extend({
  hasBurst: function() {
    return !(this.get('min') === this.get('max'));
  }.property('min', 'max')
});

