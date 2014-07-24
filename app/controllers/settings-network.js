import Ember from 'ember';
import Network from '../utils/mappings/network';
import network from '../models/network';

export default Ember.Controller.extend({
  isActionPending: false,
  networkTypeText: function() {
    if (this.get('networkType.setting') == Network.NEUTRON) {
      return 'Neutron';
    } else if (this.get('networkType.setting') == Network.NOVA) {
      return 'Nova';
    }
  }.property('networkType.setting'),
  actions: {
    save: function() {
      var self = this;
      var externalIpChanged = network.get('external.address') != network.get('serverExternal.address');
      var externalChangedToDynamic = (network.get('external.dhcp') && network.get('external.dhcp') != network.get('serverExternal.dhcp'));
      if (externalChangedToDynamic) {
        var verify = confirm('You have changed your external interface to use DHCP, so your IP address may change, disconnecting this application, and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.set('isActionPending', true);
          network.save().then(function() {
            self.set('isActionPending', false);
          }, function() {
            self.set('isActionPending', false);
          });
        }
      } else if (externalIpChanged) {
        var verify = confirm('You have changed your external interface\'s IP address, so this application will become disconnected and you will have to navigate to the new location. Are you sure you want to proceed?');
        if (verify) {
          this.set('isActionPending', true);
          network.save().then(function() {
            self.set('isActionPending', false);
          }, function() {
            self.set('isActionPending', false);
          });
          /* The following could be done if the netconfig API response didn't timeout
          network.save().then(function(json) {
            window.location =  window.location.protocol + '//' + json.external.address + '/#/settings/network';
          });
          */
        }
      } else {
        this.set('isActionPending', true);
        network.save().then(function() {
          self.set('isActionPending', false);
        }, function() {
          self.set('isActionPending', false);
        });
      }
    },
    cancel: function() {
      network.check();
    }
  }
});
