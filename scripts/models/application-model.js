App.Application = Ember.Object.extend({
  fullTitle: 'Intel® Service Assurance Manager',
  longTitle: 'Service Assurance Manager',
  //buildVersionBinding: 'App.Build.firstObject.version',
  //buildDateBinding: 'App.Build.firstObject.date',
  title: 'SAM',
  year: function () {
    return moment().format('YYYY')
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property(),
  health: App.SUCCESS,
  isEnabled: function () {
    return this.get('health') <= App.WARNING && App.nova.get('exists') && App.openrc.get('exists') && App.quantum.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists', 'App.quantum.exists', 'health'),
  timerId: null,
  timer: function () {
    var self = this;
    var timerInterval = 10000;
    var updateStatus = function () {
      if (App.state.get('loggedIn')) {
        // Update contextual graphs
        if (App.contextualGraphs.get('selectedNode')) {
          App.graphs.graph(App.contextualGraphs.get('selectedNode.id'), App.contextualGraphs.get('selectedNode.name'), 'node');
        }
        if (App.contextualGraphs.get('selectedNode')) {
          App.graphs.graph(App.contextualGraphs.get('selectedVm.id'), App.contextualGraphs.get('selectedVm.name'), 'vm');
        }
      }
      // Update SAM status
      if (!App.Status.find('current').get('isLoaded')) {
        App.Status.find('current').then(function (status) {
          App.application.set('systemStatus', App.Status.find('current'));
        });
      } else {
        if (App.Status.find('current').get('stateManager.currentPath') !== 'rootState.loaded.saved') App.Status.find('current').get('stateManager').transitionTo('rootState.loaded.saved');
        App.Status.find('current').reload().then(function (status) {
          App.application.set('systemStatus', App.Status.find('current'));
        });
      }
    };
    setTimeout(updateStatus, 1000);
    var timerId = setInterval(updateStatus, timerInterval);
    this.set('timerId', timerId);
  },
  samStarted: function () {
    return App.nova.get('exists') && App.openrc.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists'),
  systemStatus: undefined,
  statusMessages: function () {
    return this.get('systemStatus.messages')
  }.property('systemStatus'),
  statusErrorMessages: function () {
    var statusMessages = this.get('statusMessages');
    return (!statusMessages) ? undefined : statusMessages.filter(function (item, index, enumerable) {
      return item.get('health') > App.SUCCESS;
    });
  }.property('statusMessages.@each'),
  statusStyle: function () {
    if (!this.get('systemStatus.health')) {
      var statusStyle = 'alert-info';
    } else {
      var statusStyle = 'alert-' + App.priorityToType(this.get('systemStatus.health'));
    }
  }.property('systemStatus.health')
});
App.application = App.Application.create();
App.application.timer();
