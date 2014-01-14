App.SettingsUploadController = Ember.ArrayController.extend({
  needs: ['application'],
  isEnabledBinding: 'controllers.application.isEnabled',
  isConfiguredBinding: 'controllers.application.isConfigured',
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  quantumExistsBinding: 'App.quantum.exists',
  quantumSuccessBinding: 'App.quantum.success',
  isChangingFiles: false,
  isActionPending: false,
  showButtons: function () {
    return !this.get('isConfigured') || this.get('isChangingFiles');
  }.property('isConfigured', 'isChangingFiles'),
  actions: {
    uploadFiles: function () {
      var self = this;
      // Require all 3 files to be specified
      var allFilesSpecified = !!$('#novaForm').find('input[type=file]').val() && !!$('#openrcForm').find('input[type=file]').val() && !!$('#quantumForm').find('input[type=file]').val();
      if (!allFilesSpecified) {
        App.event('You must upload all three configuration files at the same time.');
        return;
      }
      // Prompt user with confirmation dialog if app is already configured
      var confirmUpload = true;
      if (this.get('isEnabled')) confirmUpload = confirm('Are you sure you want to upload new configuration files and restart ' + App.application.get('title') + '?');
      if (confirmUpload) {
        this.set('isActionPending', true);
        App.nova.upload().then(function () {
          return App.openrc.upload();
        }).then(function () {
          return App.quantum.upload();
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
        }, function () {
          self.set('isActionPending', false);
          App.event('Error uploading config files.', App.ERROR);
          $('.fileupload i').removeClass().addClass('icon-file');
          $('.fileupload').fileupload('reset');
          self.set('isChangingFiles', false);
          // Reset isConfigured state by re-checking file existence
          App.nova.check();
          App.openrc.check();
          App.quantum.check();
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
    uploadNova: function () {
      App.nova.upload();
    },
    uploadOpenrc: function () {
      App.openrc.upload();
    },
    uploadQuantum: function () {
      App.quantum.upload();
    },
    updateOverrides: function () {
      App.overrides.update();
    }
  }
});
