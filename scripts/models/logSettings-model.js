App.SettingsLog = Ember.Object.extend({
  thresholdSize: null,
  maximumDays: null,
  configuredSize: null,
  actualSize: null,
  deleteLogs: function () {
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
  },
  actions: {
    update: function () {
      // # Not settable:
      // * ThresholdSize: App.settingsLog.get('thresholdSize')
      // * ActualSize: App.settingsLog.get('actualSize')
      $('#settable-values i.loading').removeClass('hide');
      var dataJson = {
        MaximumDays: App.settingsLog.get('maximumDays'),
        ConfiguredSize: App.settingsLog.get('configuredSize')
      };
      return Ember.$.ajax({
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/logsettings',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataJson),
        dataType: 'json',
        complete: function (jqXHR, textStatus) {
          $('#settable-values i.loading').addClass('hide');
          if (jqXHR.status == 200) {
            App.event('Successfully updated  log settings.', App.SUCCESS);
          } else if (jqXHR.status == 422) {
              var responseMessage = jQuery.parseJSON(jqXHR.responseText);
              App.event(responseMessage.error_message, App.ERROR);
          } else {
            App.event('Error updating log settings.', App.ERROR);
          }
        }
      });
    }
  },
  fetch: function () {
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/logsettings',
      type: 'GET',
      dataType: 'json',
      complete: function (jqXHR, textStatus) {
        if (jqXHR.status == 200) {
          settings = jQuery.parseJSON(jqXHR.responseText);
          App.settingsLog.set('thresholdSize', settings.ThresholdSize);
          App.settingsLog.set('maximumDays', settings.MaximumDays);
          App.settingsLog.set('configuredSize', settings.ConfiguredSize);
          App.settingsLog.set('actualSize', settings.ActualSize);
        }
      }
    });
  }
});

App.settingsLog = App.SettingsLog.create();
