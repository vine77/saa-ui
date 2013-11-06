App.SettingsLogController = Ember.Controller.extend({
  actions: {
    deleteLogs: function() {
      verify = confirm('You are about to delete all log data. Are you sure you want to continue?');
      if (verify) {
        $('#reset-log-data i.loading').removeClass('hide');
        return Ember.$.ajax({
          url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/logs',
          type: 'DELETE'
        }).then(function () {
          App.event('Successfully deleted all log data.', App.SUCCESS);
          $('#reset-log-data i.loading').addClass('hide');
        }, function () {
          App.event('Error updating log settings.', App.ERROR);
          $('#reset-log-data i.loading').addClass('hide');
        });
      }
    },
    update: function (modelId) {
      $('#settable-values i.loading').removeClass('hide');
      this.store.getById('logSetting', modelId).save().then(function () {
        $('#settable-values i.loading').addClass('hide');
        App.event('Successfully updated  log settings.', App.SUCCESS);
      }, function (xhr) {
        $('#settable-values i.loading').addClass('hide');
        App.xhrError(xhr, 'Failed to update log settings.');
        //var responseMessage = jQuery.parseJSON(xhr.responseText);
        //App.event(responseMessage.error_message, App.ERROR);
      });
    },
    cancel: function (model) {
      model.rollback();
    }
  }
});
