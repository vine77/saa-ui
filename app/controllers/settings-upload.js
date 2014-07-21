import Ember from 'ember';
import Health from '../utils/mappings/health';
import Network from '../utils/mappings/network';
import getApiDomain from '../utils/get-api-domain';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ArrayController.extend({
  needs: ['application', 'overrides'],
  isEnabledBinding: 'controllers.application.isEnabled',
  isConfiguredBinding: 'controllers.application.isConfigured',
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  quantumExistsBinding: 'App.quantum.exists',
  quantumSuccessBinding: 'App.quantum.success',
  keystoneExistsBinding: 'App.keystone.exists',
  keystoneSuccessBinding: 'App.keystone.success',
  isChangingFiles: false,
  isActionPending: false,
  networkType: {},
  isNeutronConfigRequired: function() {
    var isNeutronConfigRequired = this.get('networkType.setting') == Network.NEUTRON
    return isNeutronConfigRequired;
  }.property('networkType.setting'),
  showButtons: function() {
    return !this.get('isConfigured') || this.get('isChangingFiles');
  }.property('isConfigured', 'isChangingFiles'),
  actions: {
    uploadFiles: function() {
      var self = this;
      // Require all 3 files to be specified
      var isNovaSpecified = !!Ember.$('#novaForm').find('input[type=file]').val();
      var isOpenrcSpecified = !!Ember.$('#openrcForm').find('input[type=file]').val();
      var isQuantumSpecified = !!Ember.$('#quantumForm').find('input[type=file]').val();
      var isKeystoneSpecified = !!Ember.$('#keystoneForm').find('input[type=file]').val();
      var allFilesSpecified = false;
      if (this.get('isNeutronConfigRequired')) {
        allFilesSpecified = isNovaSpecified && isOpenrcSpecified && isQuantumSpecified;
      } else {
        allFilesSpecified = isNovaSpecified && isOpenrcSpecified;
      }
      if (!allFilesSpecified) {
        if (this.get('isNeutronConfigRequired')) {
          event('You must upload all 4 configuration files at the same time.');
        } else {
          event('You must upload all two configuration files at the same time.');
        }
        return;
      }
      // Prompt user with confirmation dialog if app is already configured
      var self = this;
      var confirmUpload = true;
      if (this.get('isEnabled')) confirmUpload = confirm('Are you sure you want to upload new configuration files and restart ' + App.application.get('title') + '?');
      if (confirmUpload) {
        this.set('isActionPending', true);
        this.get('networkType.content').save().then(function() {
          return App.nova.upload();
        }).then(function() {
          return App.openrc.upload();
        }).then(function() {
          if (self.get('isNeutronConfigRequired') && isQuantumSpecified) return App.quantum.upload();
        }).then(function() {
          if (isKeystoneSpecified) return App.keystone.upload();
        }).then(function() {
          return App.nova.start();
        }).then(function() {
          self.set('isActionPending', false);
          event('<i class="loading"></i> <div> Successfully uploaded files. </div> Please wait while the application is restarted...', Health.SUCCESS, undefined, undefined, true);
          setTimeout(function() {
            // Restart app for full reload and redirect to index
            document.location.href = '/';
            // TODO: Add Status API polling to determine when to reload app
          }, 60000);
        }, function(xhr) {
          self.set('isActionPending', false);
          xhrError(xhr, 'An error occurred while uploading config files.', Health.ERROR);
          Ember.$('.fileupload i').removeClass().addClass('icon-file');
          Ember.$('.fileupload').fileupload('reset');
          self.set('isChangingFiles', false);
          // Reset isConfigured state by re-checking file existence
          App.nova.check();
          App.openrc.check();
          App.quantum.check();
          App.keystone.check();
        });
      }
    },
    changeFiles: function() {
      Ember.$('.fileupload').fileupload('clear');
      this.set('isChangingFiles', true);
    },
    cancel: function() {
      Ember.$('.fileupload').fileupload('reset');
      this.set('isChangingFiles', false);
    },
    deleteFiles: function(type) {
      if (type == 'keystone') {
        //Ember.$('i.loading').removeClass('hide');
        return Ember.$.ajax({
          url: (getApiDomain()) + '/api/v2/configs/KeystoneCaCertFile',
          type: 'DELETE',
          success: function(data) {
            //Ember.$('i.loading').addClass('hide');
            event('Deleted Keystone CA certificate successfully.', Health.SUCCESS);
            App.keystone.check();
          },
          error: function(xhr) {
            //Ember.$('i.loading').addClass('hide');
            xhrError(xhr, 'Failed to delete Keystone CA certificate.');
          }
        });
      }
    },
    updateOverrides: function() {
      this.store.getById('override', 'current').save().then( function(){
         event('Successfully updated configuration overrides.', Health.SUCCESS);
      }, function(xhr) {
        xhrError(xhr, 'An error occurred while attempting to override configuration values.');
      });
    }
  }
});
