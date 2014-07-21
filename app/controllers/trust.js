import Ember from 'ember';
import mtWilson from '../models/mtWilson';

export default Ember.Controller.extend({
  needs: ['application'],
  isInstalledBinding: 'mtWilson.isInstalled',
  isInstallingBinding: 'mtWilson.isInstalling',
  ipAddressBinding: 'mtWilson.ipAddress',
  actions: {
    install: function() {
      // Start Mt. Wilson install
      mtWilson.install();
      mtWilson.checkPeriodically();
    }
  },
  checkInstall: function() {
    mtWilson.check();
  },
  isInstalledChanged: function() {
    var applicationController = this.get('controllers.application');
    var currentPath = applicationController.get('currentPath');
    if ((this.get('isInstalled') == true) && (currentPath == 'app.data.trust.index')) {
      var router = this.get('target');
      router.transitionTo('trust.mles');
    }
  }.observes('isInstalled')
});
