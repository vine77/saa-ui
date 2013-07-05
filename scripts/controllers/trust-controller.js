App.TrustController = Ember.Controller.extend({
  needs: ['application','trustDashboard', 'trustManagement', 'trustWhitelist'],
  isInstalledBinding: 'App.mtWilson.isInstalled',
  isInstallingBinding: 'App.mtWilson.isInstalling',
  ipAddressBinding: 'App.mtWilson.ipAddress',
  dashboardUrlBinding: 'controllers.trustDashboard.frameUrl',
  managementUrlBinding: 'controllers.trustManagement.frameUrl',
  whitelistUrlBinding: 'controllers.trustWhitelist.frameUrl',
  install: function () {
    // Start Mt. Wilson install
    App.mtWilson.install();
    App.mtWilson.checkPeriodically();
  },
  checkInstall: function () {
    App.mtWilson.check();
  },

  isInstalledChanged: function () {
    var applicationController = this.get('controllers.application');
    var currentPath = applicationController.get('currentPath');
    if ((this.get('isInstalled') == true) && (currentPath == 'trust.index')) {
      var router = this.get('target'); 
      router.transitionTo('trust.fingerprint');      
    }
  }.observes('isInstalled')

});
