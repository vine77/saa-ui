App.SettingsNetworkController = Ember.Controller.extend({
  actions: {
    save: function () {
      var externalIpChanged = App.network.get('external.address') != window.location.hostname;
      var externalChangedToDynamic = (App.network.get('external.dhcp') && App.network.get('external.dhcp') != App.network.get('serverExternal.dhcp'));
      if (externalChangedToDynamic) {
        var verify = confirm('You have changed your external interface to use DHCP, so your IP address may change, disconnecting this application, and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          App.network.save();
        }
      } else if (externalIpChanged) {
        var verify = confirm('You have changed your external interface\'s IP address, so this application will become disconnected and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          App.network.save();
          /* The following could be done if the netconfig API response didn't timeout
          App.network.save().then(function (json) {
            window.location =  window.location.protocol + '//' + json.external.address + '/#/settings/network';
          });
          */
        }
      } else {
        App.network.save();
      }
    },
    cancel: function () {
      App.network.check();
    }
  }
});
