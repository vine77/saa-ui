App.SettingsUploadController = Ember.ArrayController.extend({
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  quantumExistsBinding: 'App.quantum.exists',
  quantumSuccessBinding: 'App.quantum.success',
  actions: {
    uploadFiles: function () {
      $('i.loading').removeClass('hide');
      App.nova.upload().then(function () {
        return App.openrc.upload();
      }).then(function () {
        return App.quantum.upload();
      }).then(function () {
        return App.nova.start();
      }).then(function () {
        App.event('Successfully uploaded files. Please wait while the application is restarted...', App.SUCCESS, undefined, undefined, true);
        $('i.loading').addClass('hide');
        setTimeout(function () {
          document.location.href = '/';  // Restart app for full reload and redirect to index
        }, 30000);
      }, function () {
        $('i.loading').addClass('hide');
        App.event('Error uploading config files.', App.ERROR);
      });
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
