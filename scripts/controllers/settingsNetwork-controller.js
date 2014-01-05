App.SettingsNetworkController = Ember.Controller.extend({
  isActionPending: false,
  actions: {
    save: function () {
      var self = this;
      var externalIpChanged = App.network.get('external.address') != window.location.hostname;
      var externalChangedToDynamic = (App.network.get('external.dhcp') && App.network.get('external.dhcp') != App.network.get('serverExternal.dhcp'));
      if (externalChangedToDynamic) {
        var verify = confirm('You have changed your external interface to use DHCP, so your IP address may change, disconnecting this application, and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.set('isActionPending', true);
          App.network.save().then(function () {
            self.set('isActionPending', false);
          }, function () {
            self.set('isActionPending', false);
          });
        }
      } else if (externalIpChanged) {
        var verify = confirm('You have changed your external interface\'s IP address, so this application will become disconnected and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.set('isActionPending', true);
          App.network.save().then(function () {
            self.set('isActionPending', false);
          }, function () {
            self.set('isActionPending', false);
          });
          /* The following could be done if the netconfig API response didn't timeout
          App.network.save().then(function (json) {
            window.location =  window.location.protocol + '//' + json.external.address + '/#/settings/network';
          });
          */
        }
      } else {
        this.set('isActionPending', true);
        App.network.save().then(function () {
          self.set('isActionPending', false);
        }, function () {
          self.set('isActionPending', false);
        });
      }
    },
    cancel: function () {
      App.network.check();
    }
  }
});
