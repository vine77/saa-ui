import Ember from 'ember';
import mtWilson from '../../models/mt-wilson';

export default Ember.Controller.extend({
  isActionPending: false,
  isMtWilsonInstalled: Ember.computed.alias('mtWilson.isInstalled'),
  actions: {
    uninstall: function() {
      var self = this;
      var confirmedUninstall = confirm('Uninstalling the Trust Server should only be performed for diagnostic purposes. Are you sure you want to uninstall the Trust Server?');
      if (confirmedUninstall) {
        this.set('isActionPending', true);
        mtWilson.uninstall().then(function() {
          self.set('isActionPending', false);
        }, function() {
          self.set('isActionPending', false);
        });
      }
    }
  }
});
