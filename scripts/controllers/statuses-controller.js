App.StatusesController = Ember.Controller.extend({
  needs: ['application', 'status1', 'status2', 'status3', 'status4', 'status5', 'status6', 'status7', 'status8', 'status9', 'status10', 'status11', 'status12', 'status13', 'status14', 'status15', 'status16', 'status17', 'status18', 'status19', 'status20', 'logBar'],
  init: function () {
    this.set('model', this.store.all('status'));
  },
  // Properties
  connected: false,
  isUpdating: false,
  loggedIn: Ember.computed.alias('controllers.application.loggedIn'),
  loggingStatus: function () {
    return this.store.getById('status', 'logging_storage');
  }.property('model.@each.health'),
  logsAreVisible: function() {
    var loggingStatus = this.get('loggingStatus.health');
    if (loggingStatus === App.SUCCESS || loggingStatus === App.INFO || loggingStatus === App.WARNING) {
      return true;
    } else {
      return false;
    }
  }.property('loggingStatus', 'model.@each'),
  systemStatus: function () {
    return this.store.getById('status', 'system');
  }.property('model.@each'),
  health: function() {
    return (this.get('systemStatus')) ? this.get('systemStatus').get('health') : null;
  }.property('systemStatus.health'),
  statusClass: function () {
    return (!this.get('health')) ? 'alert-warning' : 'alert-' + App.priorityToType(this.get('health'));
  }.property('health'),
  isConfigPresent: function () {
    var samConfigFiles = this.get('model').findBy('id', 'sam_config_files');
    return (samConfigFiles) ? samConfigFiles.get('health') !== App.UNKNOWN : false;
  }.property('model.@each.health'),
  statusErrorMessages: function () {
    return this.store.all('status').filterBy('isNotification');
  }.property('model.@each.health', 'model.@each.isNotification'),
  breadcrumbs: function () {
    if (this.get('controllers.application.currentPath').indexOf('statuses') === -1) return [];
    var paths = this.get('controllers.application.currentPath').split('.');
    paths = paths.slice(paths.indexOf('statuses') + 1, -1);
    var models = paths.map(function (item, index, enumberable) {
      return this.get('controllers.' + item).get('model');
    }, this);
    var breadcrumbs = [];
    models.forEach(function (item, index, enumerable) {
      breadcrumbs.pushObject({
        name: item.get('name'),
        route: 'status' + (index + 1)
      });
    });
    return breadcrumbs;
  }.property('controllers.application.currentPath', 'controllers.status1.model', 'controllers.status2.model', 'controllers.status3.model', 'controllers.status4.model', 'controllers.status5.model'),

  // Functions
  updateCurrentStatus: function () {
    var self = this;
    // Update status and check connectivity every 10 seconds
    Ember.run.later(this, 'updateCurrentStatus', 10000);
    if (!this.get('isUpdating') && this.get('controllers.application.isAutoRefreshEnabled')) {
      this.set('isUpdating', true);
      return this.store.findAll('status').then(function (status) {
        self.set('connected', true);
        self.set('isUpdating', false);
      }, function (error) {
        self.set('isUpdating', false);
        self.set('connected', false);
        return new Ember.RSVP.reject();
      });
    }
  }
});

App.StatusController = Ember.ObjectController.extend({
  level: null,
  childRoute: function () {
    return 'status' + (this.get('level') + 1);
  }.property('level')
});

App.Status1Controller = App.StatusController.extend();
App.Status2Controller = App.StatusController.extend();
App.Status3Controller = App.StatusController.extend();
App.Status4Controller = App.StatusController.extend();
App.Status5Controller = App.StatusController.extend();
App.Status6Controller = App.StatusController.extend();
App.Status7Controller = App.StatusController.extend();
App.Status8Controller = App.StatusController.extend();
App.Status9Controller = App.StatusController.extend();
App.Status10Controller = App.StatusController.extend();
App.Status11Controller = App.StatusController.extend();
App.Status12Controller = App.StatusController.extend();
App.Status13Controller = App.StatusController.extend();
App.Status14Controller = App.StatusController.extend();
App.Status15Controller = App.StatusController.extend();
App.Status16Controller = App.StatusController.extend();
App.Status17Controller = App.StatusController.extend();
App.Status18Controller = App.StatusController.extend();
App.Status19Controller = App.StatusController.extend();
App.Status20Controller = App.StatusController.extend();
