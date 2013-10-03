App.SettingsTrustController = Ember.Controller.extend({

  uninstall : function() {
    var confirmedUninstall = confirm('Uninstalling the Trust Server should only be performed for diagnostic purposes. Are you sure you want to uninstall the Trust Server?');
    if (confirmedUninstall) {
      App.mtWilson.uninstall();
    }
  }

});
