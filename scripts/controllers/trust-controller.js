App.TrustController = Ember.Controller.extend({
  needs: ['application'],
  isInstalledBinding: 'App.mtWilson.isInstalled',
  isInstallingBinding: 'App.mtWilson.isInstalling',
  ipAddressBinding: 'App.mtWilson.ipAddress',
  actions: {
    install: function () {
      // Start Mt. Wilson install
      App.mtWilson.send('install');
      App.mtWilson.checkPeriodically();
    }
  },
  checkInstall: function () {
    App.mtWilson.check();
  },
  isInstalledChanged: function () {
    var applicationController = this.get('controllers.application');
    var currentPath = applicationController.get('currentPath');
    if ((this.get('isInstalled') == true) && (currentPath == 'trust.index')) {
      var router = this.get('target');
      router.transitionTo('trust.mles');
    }
  }.observes('isInstalled')
});
