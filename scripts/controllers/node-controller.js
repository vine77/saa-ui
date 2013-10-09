App.NodeController = Ember.ObjectController.extend({
  // Controller Properties
  isSelected: false,
  isExpanded: false,

  // Computed properties
  isAgentInstalled: function () {
    return Boolean(this.get('samControlled'));
  }.property('samControlled'),
  isAssured: function () {
    return this.get('samControlled') === 2;
  }.property('samControlled'),
  assuredMessage: function () {
    return (this.get('isAssured')) ? 'This is an assured node. VMs with SLAs may be placed here.' : 'This is not an assured node. VMs with SLAs may not be placed here.';
  }.property('samControlled'),
  isTrustRegistered: function () {
    return (this.get('trustNode.ipaddress')) ? true : false;
  }.property('trustNode.ipaddress'),
  isTrustRegisteredMessage: function () {
    if (this.get('trustNode.ipaddress')) {
      return 'Currently registered with Trust Server';
    } else {
      return 'Not registered with Trust Server';
    }
  }.property('trustNode.ipaddress'),
  isOn: function () {
    return (this.get('status.operational') === App.ON);
  }.property('status.operational'),
  cpuFrequency: function () {
    // MHz to GHz conversion
    var mhz = this.get('capabilities.cpu_frequency');
    if (!!mhz) {
      var ghz = mhz.split(' ')[0] / 1000;
      return ghz + 'GHz';
    } else {
      return '';
    }
  }.property('cpu_frequency'),
  isScheduled: function () {
    return !Ember.isNone(this.get('schedulerMark'));
  }.property('schedulerMark'),
  scheduledMessage: function () {
    if (this.get('isScheduled')) {
      return 'VMs will be placed on this node\'s socket ' + this.get('schedulerMark') + '.';
    } else {
      return 'This node is not set for VM placement.';
    }
  }.property('schedulerMark', 'isScheduled'),
  healthMessage: function () {
    var healthMessage = '';
    if (!this.get('isAgentInstalled') && (this.get('status.health') === App.UNKNOWN) || App.isEmpty(this.get('status.health'))) {
      return 'Not under ' + App.application.get('title') + ' control';
    }
    if (App.isEmpty(this.get('status.short_message')) && App.isEmpty(this.get('status.long_message'))) {
      // If both short and long messages are empty, show health as message
      healthMessage = '<strong>Health</strong>: ' + App.priorityToType(this.get('status.health')).capitalize();
    } else if (App.isEmpty(this.get('status.long_message'))) {  // Short message only
      healthMessage = this.get('status.short_message').capitalize();
    } else {  // Default to long message
      healthMessage = this.get('status.long_message').capitalize();
    }
    return healthMessage;
  }.property('status.health', 'status.long_message', 'status.short_message', 'isAgentInstalled'),

  // Observers
  graphObserver: function () {
    return App.graphs.graph(this.get('id'), this.get('name'), 'node');
  }.observes('isSelected', 'isExpanded'),

  // Actions
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
        this.transitionToRoute('nodesNode', model);
      } else {
        this.transitionToRoute('nodes');
      }
    }
  }

});
