App.SettingsUploadController = Ember.ArrayController.extend({
  needs: ['application', 'overrides'],
  isEnabledBinding: 'controllers.application.isEnabled',
  isConfiguredBinding: 'controllers.application.isConfigured',
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  keystoneConfExistsBinding: 'App.keystoneConf.exists',
  keystoneConfSuccessBinding: 'App.keystoneConf.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  quantumExistsBinding: 'App.quantum.exists',
  quantumSuccessBinding: 'App.quantum.success',
  keystoneExistsBinding: 'App.keystone.exists',
  keystoneSuccessBinding: 'App.keystone.success',
  isChangingFiles: false,
  isActionPending: false,
  networkType: {},
  isNeutronConfigRequired: function () {
    var isNeutronConfigRequired = this.get('networkType.setting') == App.NEUTRON
    return isNeutronConfigRequired;
  }.property('networkType.setting'),
  showButtons: function () {
    return !this.get('isConfigured') || this.get('isChangingFiles');
  }.property('isConfigured', 'isChangingFiles'),
  actions: {
    uploadFiles: function () {
      var self = this;
      // Require all 3 files to be specified
      var isNovaSpecified = !!$('#novaForm').find('input[type=file]').val();
      var isOpenrcSpecified = !!$('#openrcForm').find('input[type=file]').val();
      var isQuantumSpecified = !!$('#quantumForm').find('input[type=file]').val();
      var isKeystoneSpecified = !!$('#keystoneForm').find('input[type=file]').val();
      var isKeystoneConfSpecified = !!$('#keystoneConfForm').find('input[type=file]').val();
      var allFilesSpecified = false;
      if (this.get('isNeutronConfigRequired')) {
        allFilesSpecified = isNovaSpecified && isOpenrcSpecified && isQuantumSpecified;
      } else {
        allFilesSpecified = isNovaSpecified && isOpenrcSpecified;
      }
      if (!allFilesSpecified) {
        App.event('You must upload all required configuration files at the same time.');
        return;
      }
      // Prompt user with confirmation dialog if app is already configured
      var self = this;
      var confirmUpload = true;
      if (this.get('isEnabled')) confirmUpload = confirm('Are you sure you want to upload new configuration files and restart ' + App.application.get('title') + '?');
      if (confirmUpload) {
        this.set('isActionPending', true);
        this.get('networkType.content').save().then(function () {
          return App.nova.upload();
        }).then(function () {
          return App.openrc.upload();
        }).then(function () {
          if (self.get('isNeutronConfigRequired') && isQuantumSpecified) return App.quantum.upload();
        }).then(function () {
          if (isKeystoneSpecified) return App.keystone.upload();
        }).then(function () {
          if (isKeystoneConfSpecified) return App.keystoneConf.upload();
        }).then(function () {
          return App.nova.start();
        }).then(function () {
          self.set('isActionPending', false);
          App.event('<i class="loading"></i> <div> Successfully uploaded files. </div> Please wait while the application is restarted...', App.SUCCESS, undefined, undefined, true);
          setTimeout(function () {
            // Restart app for full reload and redirect to index
            document.location.href = '/';
            // TODO: Add Status API polling to determine when to reload app
          }, 60000);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'An error occurred while uploading config files.', App.ERROR);
          $('.fileupload i').removeClass().addClass('icon-file');
          $('.fileupload').fileupload('reset');
          self.set('isChangingFiles', false);
          // Reset isConfigured state by re-checking file existence
          App.nova.check();
          App.openrc.check();
          App.quantum.check();
          App.keystone.check();
          App.keystoneConf.check();
        });
      }
    },
    changeFiles: function () {
      $('.fileupload').fileupload('clear');
      this.set('isChangingFiles', true);
    },
    cancel: function () {
      $('.fileupload').fileupload('reset');
      this.set('isChangingFiles', false);
    },
    deleteFiles: function(type) {
      if (type == 'keystone') {
        //$('i.loading').removeClass('hide');
        return Ember.$.ajax({
          url: (App.getApiDomain()) + '/api/v2/configs/KeystoneCaCertFile',
          type: 'DELETE',
          success: function (data) {
            //$('i.loading').addClass('hide');
            App.event('Deleted Keystone CA certificate successfully.', App.SUCCESS);
            App.keystone.check();
          },
          error: function (xhr) {
            //$('i.loading').addClass('hide');
            App.xhrError(xhr, 'Failed to delete Keystone CA certificate.');
          }
        });
      }
    },
    updateOverrides: function() {
      this.store.getById('override', 'current').save().then( function(){
         App.event('Successfully updated configuration overrides.', App.SUCCESS);
      }, function(xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to override configuration values.');
      });
    }
  }
});
