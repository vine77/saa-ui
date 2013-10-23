App.SettingsNetworkController = Ember.Controller.extend({
  actions: {
    save: function () {
      var externalIpChanged = (App.network.get('external.address') == window.location.hostname);
      var externalChangedToDynamic = (App.network.get('external.dhcp') && App.network.get('external.dhcp') != App.network.get('serverExternal.dhcp'));
      if (!externalIpChanged && !externalChangedToDynamic) {
        App.network.save();
      } else {
        var verify = confirm('You have specified a change to your external interface. Are you sure you want to save and redirect to the new IP address?');
        if (verify) {
          var redirectIp = 'http://' + App.network.get('external.address');
          App.network.save().then(function (json) {
            window.location =  window.location.protocol + '//' + json.external.address + '/#/settings/network';
          });
        }
      }
    },
    cancel: function () {
      App.network.check();
    }
  }
});
