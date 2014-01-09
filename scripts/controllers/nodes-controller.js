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
    description: 'Node Type (Assured, Monitored, Non-SAM)',
    sortBy: 'samControlled',
    icon: 'icon-trophy'
  }, {
    title: 'Hostname',
    sortBy: 'name'
  }, {
    title: 'VMs',
    sortBy: 'vmInfo.count'
  }, {
    title: 'CPU',
    sortBy: 'cpuSort'
  }, {
    title: 'SAM Units',
    description: 'The SAM Unit (SU) is a measure of compute consumption on the host server',
    sortBy: 'utilization.su_current'
  }, {
    title: 'IPC',
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
  needs: ['nodesColumns', 'application', 'quota'],
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
  totalRamGibibyte: function() {
    return App.readableSize(this.get('totalRam') * 1048576);
  }.property('totalRam'),
  maxRam: function () {
    return this.get('controllers.quota.ram');
  }.property('this.controllers.quota.ram'),
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
      var isEverythingSelected = this.everyProperty('isSelected');
      this.setEach('isSelected', !isEverythingSelected);
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
    }
  }
});
