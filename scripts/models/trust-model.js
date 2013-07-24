App.Trust = Ember.Object.extend({
  isInstalled: false,
  isInstalling: false,
  isSupported: true,
  ipAddress: '',
  check: function () {
    hash = {
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/mtwilson/install',
      type: 'GET',
      dataType: "json",
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from GET /api/v1/mtwilson/install: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            // Mt. Wilson is installed
            App.mtWilson.set('isInstalled', true);
            App.mtWilson.set('isInstalling', false);
            break;
          case 404:
            // Mt. Wilson is not installed
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
            break;
          case 410:
            // Mt. Wilson is not installed
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
            App.mtWilson.set('isSupported', false);
            break;
          case 503:
            // Mt. Wilson install is in progress
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', true);
            break;
          default:
            // Unhandled response code
        }
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  },
  checkPeriodically: function () {
    // If Mt. Wilson is installing, recheck status periodically
    if (App.mtWilson.get('isInstalling')) {
      App.mtWilsonCheck = setInterval(function () {
        if (App.mtWilson.get('isInstalling')) {
          App.mtWilson.check();
        } else {
          clearInterval(App.mtWilsonCheck);
        }
      }, 10000);
    }
  },
  install: function () {
    // Start Mt. Wilson install
    App.mtWilson.set('isInstalling', true);
    hash = {
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/mtwilson/install',
      type: 'POST',
      dataType: "json",
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from POST /api/v1/mtwilson/install: ' + xhr.statusText);
        switch (xhr.status) {
          case 201:
            // Mt. Wilson install successfully started.
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', true);
            App.event('Trust Server install successfully started.', App.SUCCESS);
            break;
          case 409:
            // Mt. Wilson install can't be started.  Mt. Wilson is already installed.
            App.mtWilson.set('isInstalled', true);
            App.mtWilson.set('isInstalling', false);
            App.event('Trust Server is already installed.', App.WARNING);
            break;
          case 412:
            // Mt. Wilson install can't be started.  Please set the management IP address first.
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
            App.event('Please set the management IP address before attempting to install Trust Server.', App.ERROR);
            break;
          case 410:
            // Mt. Wilson is not supported
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
            App.mtWilson.set('isSupported', false);
            App.event('Trust Server is not supported', App.ERROR);
            break;
          case 503:
            // Mt. Wilson install can't be started.  Mt. Wilson install is in progress.
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', true);
            App.event('A Trust Server install is already in progress.', App.WARNING);
            break;
          case 500:
            // Mt. Wilson install failed to start.
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
          default:
            // Unhandled response code
            App.event('Trust Server install failed to start.', App.ERROR);
            App.mtWilson.set('isInstalled', false);
            App.mtWilson.set('isInstalling', false);
        }
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    $.ajax(hash);
  }
});

App.mtWilson = App.Trust.create();
