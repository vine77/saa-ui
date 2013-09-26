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
      var statusCheck = function (status, self) {
        var newStatus = status;
        if (self.get('health') !== newStatus.get('health')) self.set('health', newStatus.get('health'));
        if (status.get('health') !== App.SUCCESS && !Ember.isEmpty(status.get('messages'))) {
          App.application.set('systemStatus', App.Status.find('current'));
          if (App.priorityToType(status.get('health')) == 'unknown') {
            var statusStyle = 'alert-info';
          } else {
            var statusStyle = 'alert-' + App.priorityToType(status.get('health'));
          }
          App.application.set('statusStyle', statusStyle);
          App.application.set('status', false);
        } else {
          App.application.set('status', true);
        }
      };
      if (!App.Status.find('current').get('isLoaded')) {
        App.Status.find('current').then(function (status) {
          statusCheck(status, self);
        });
      } else {
        if (App.Status.find('current').get('stateManager.currentPath') !== 'rootState.loaded.saved') App.Status.find('current').get('stateManager').transitionTo('rootState.loaded.saved');
        App.Status.find('current').reload().then(function (status) {
          statusCheck(status, self);
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
  status: true,
  systemStatus: undefined,
  statusMessages: function () {
    return this.get('systemStatus.messages')
  }.property('systemStatus'),
  statusErrorMessages: function () {
    return this.get('statusMessages').filter(function (item, index, enumerable) {
      return item.get('health') > App.SUCCESS;
    });
  }.property('statusMessages.@each'),
  statusStyle: null
});
App.application = App.Application.create();
App.application.timer();
