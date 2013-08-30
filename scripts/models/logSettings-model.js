App.SettingsLog = Ember.Object.extend({
  thresholdSize: null,
  maximumDays: null,
  configuredSize: null,
  actualSize: null,
  fetch: function () {
    var ajaxOptions = $.extend({
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
    }, App.ajaxSetup);
    $.ajax(ajaxOptions);
  },
  update: function () {
    // # Not settable:
    // * ThresholdSize: App.settingsLog.get('thresholdSize')
    // * ActualSize: App.settingsLog.get('actualSize')
    $('i.loading').removeClass('hide');
    var dataJson = {
      MaximumDays: App.settingsLog.get('maximumDays'),
      ConfiguredSize: App.settingsLog.get('configuredSize')
    };
    var ajaxOptions = $.extend({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/logsettings',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataJson),
      dataType: 'json',
      complete: function (jqXHR, textStatus) {
        $('i.loading').addClass('hide');
        if (jqXHR.status == 200) {
          App.event('Successfully updated  log settings.', App.SUCCESS);
        } else if (jqXHR.status == 422) {
            var responseMessage = jQuery.parseJSON(jqXHR.responseText);
            App.event(responseMessage.error_message, App.ERROR);
        } else {
          App.event('Error updating log settings.', App.ERROR);
        }
      }
    }, App.ajaxSetup);
    $.ajax(ajaxOptions);
  },
  deleteLogs: function () {
    $('i.loading').removeClass('hide');
    var ajaxOptions = $.extend({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/logs',
      type: 'DELETE',
      complete: function (jqXHR, textStatus) {
        if (jqXHR.status == 200) {
          App.event('Successfully deleted all log data.', App.SUCCESS);
        } else {
          App.event('Error updating log settings.', App.ERROR);
        }
        $('i.loading').removeClass('hide');
      }
    }, App.ajaxSetup);
    $.ajax(ajaxOptions);
  }
});

App.settingsLog = App.SettingsLog.create();
