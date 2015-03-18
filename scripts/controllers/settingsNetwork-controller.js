App.SettingsNetworkController = Ember.Controller.extend({
  configurationValues: [],
  networkOverrides: function() {
    return this.get('configurationValues').filter(function(item, index, enumerable) {
      return (item.section === 'ntp' || item.section === 'dns');
    });
  }.property('configurationValues.@each'),
  networkOverridesExist: Ember.computed.gt('networkOverrides.length', 0),
  isActionPending: false,
  networkTypeText: function () {
    if (this.get('networkType.setting') === App.NEUTRON) {
      return 'Neutron';
    } else if (this.get('networkType.setting') === App.NOVA) {
      return 'Nova';
    }
  }.property('networkType.setting'),
  actions: {
    updateNetworkOverrides: function() {
      var currentOverrides = this.store.getById('override', 'current');
      currentOverrides.set('configurationValues', this.get('configurationValues'));
      return currentOverrides.save().then(function() {
        App.event('Successfully updated configuration override values.', App.SUCCESS);
      }, function(xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to save configuration override values.');
      });
    },
    saveNetworkSettings: function() {
      var self = this;
      this.set('isActionPending', true);
      App.network.save().then(function() {
        self.set('isActionPending', false);
        self.send('updateNetworkOverrides');
      }, function() {
        self.set('isActionPending', false);
      });
    },
    save: function() {
      var self = this;
      var externalIpChanged = App.network.get('external.address') !== App.network.get('serverExternal.address');
      var externalChangedToDynamic = (App.network.get('external.dhcp') && App.network.get('external.dhcp') != App.network.get('serverExternal.dhcp'));
      if (externalChangedToDynamic) {
        var verify = confirm('You have changed your external interface to use DHCP, so your IP address may change, disconnecting this application, and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.send('saveNetworkSettings');
        }
      } else if (externalIpChanged) {
        var verify = confirm('You have changed your external interface\'s IP address, so this application will become disconnected and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.send('saveNetworkSettings');
          /* The following could be done if the netconfig API response didn't timeout
          App.network.save().then(function (json) {
            window.location =  window.location.protocol + '//' + json.external.address + '/#/settings/network';
          });
          */
        }
      } else {
        this.send('saveNetworkSettings');
      }
    },
    cancel: function () {
      var self = this;
      App.network.check();
      this.store.find('override', 'current').then(function(current) {
        current.reload();
        self.set('configurationValues', current.get('configurationValues'));
      });
    }
  }
});
