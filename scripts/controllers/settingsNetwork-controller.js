App.SettingsNetworkController = Ember.Controller.extend({
  actions: {
    save: function () {
      var hostnameMatches = false;
      if (App.network.get('external.address') == window.location.hostname) {
        hostnameMatches = true;
      }
      if (hostnameMatches) {
        App.network.save();
      } else {
        var verify = confirm('You have specified a different external IPv4 address than the current location. Are you sure you want to save and redirect?');
        if (verify == true) {
          var redirectIP = 'http://' + App.network.get('external.address');
          App.network.save().then(function (redirectIP) {
            window.location = redirectIP;
          });
        }
      }
    },
    cancel: function () {
      App.network.check();
    }
  }
});
