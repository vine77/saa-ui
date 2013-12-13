App.SettingsLogController = Ember.Controller.extend({
  unavailableSpaceWidth: function () {
    var percentage = (this.get('model.configuredSize') == 0) ? 0 : (this.get('model.actualSize')/this.get('model.configuredSize')) * 100;
    return 'width:' + percentage + '%;';
  }.property('model.configuredSize', 'model.actualSize'),
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
      $('#form-actions i.loading').removeClass('hide');
      this.store.getById('logSetting', modelId).save().then(function () {
        $('#form-actions i.loading').addClass('hide');
        App.event('Successfully updated  log settings.', App.SUCCESS);
      }, function (xhr) {
        $('#form-actions i.loading').addClass('hide');
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
