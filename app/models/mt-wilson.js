import Ember from 'ember';
import Health from '../utils/mappings/health';
import log from '../utils/log';
import getApiDomain from '../utils/get-api-domain';
import event from '../utils/event';

// TODO: Port to real model
export default Ember.Object.extend({
  isInstalled: false,
  isInstalling: false,
  isSupported: true,
  ipAddress: '',
  check: function() {
    var self = this;
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/mtwilson/install',
      type: 'GET',
      dataType: 'json'
    }).then(function(data, textStatus, xhr) {
      log(xhr.status + ' response from GET /api/v2/mtwilson/install: ' + xhr.statusText);
      // Mt. Wilson is installed
      self.set('isInstalled', true);
      self.set('isInstalling', false);
    }, function(xhr, textStatus, errorThrown) {
      log(xhr.status + ' response from GET /api/v2/mtwilson/install: ' + xhr.statusText);
      switch (xhr.status) {
        case 404:
          // Mt. Wilson is not installed
          self.set('isInstalled', false);
          self.set('isInstalling', false);
          break;
        case 410:
           // Mt. Wilson is not installed
          self.set('isInstalled', false);
          self.set('isInstalling', false);
          self.set('isSupported', false);
          break;
        case 503:
          // Mt. Wilson install is in progress
          self.set('isInstalled', false);
          self.set('isInstalling', true);
          break;
        default:
          // Unhandled response code
      }
    });
  },
  checkPeriodically: function() {
    // If Mt. Wilson is installing, recheck status periodically
    var self = this;
    if (this.get('isInstalling')) {
      this.mtWilsonTimer = setInterval(function() {
        if (self.get('isInstalling')) {
          self.check();
        } else {
          clearInterval(self.mtWilsonTimer);
        }
      }, 10000);
    }
  },
  install: function() {
    // Start Mt. Wilson install
    var self = this;
    this.set('isInstalling', true);
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/mtwilson/install',
      type: 'POST',
      dataType: 'json',
      complete: function(xhr, textStatus) {
        log(xhr.status + ' response from POST /api/v2/mtwilson/install: ' + xhr.statusText);
        switch (xhr.status) {
          case 201:
            // Mt. Wilson install successfully started.
            self.set('isInstalled', false);
            self.set('isInstalling', true);
            event('Trust Server install successfully started.', Health.SUCCESS);
            break;
          case 409:
            // Mt. Wilson install can't be started.  Mt. Wilson is already installed.
            self.set('isInstalled', true);
            self.set('isInstalling', false);
            event('Trust Server is already installed.', Health.WARNING);
            break;
          case 412:
            // Mt. Wilson install can't be started.  Please set the management IP address first.
            self.set('isInstalled', false);
            self.set('isInstalling', false);
            event('Please set the management IP address before attempting to install Trust Server.', Health.ERROR);
            break;
          case 410:
            // Mt. Wilson is not supported
            self.set('isInstalled', false);
            self.set('isInstalling', false);
            self.set('isSupported', false);
            event('Trust Server is not supported', Health.ERROR);
            break;
          case 503:
            // Mt. Wilson install can't be started.  Mt. Wilson install is in progress.
            self.set('isInstalled', false);
            self.set('isInstalling', true);
            event('A Trust Server install is already in progress.', Health.WARNING);
            break;
          case 500:
            // Mt. Wilson install failed to start.
            self.set('isInstalled', false);
            self.set('isInstalling', false);
            break;
          default:
            // Unhandled response code
            event('Trust Server install failed to start.', Health.ERROR);
            self.set('isInstalled', false);
            self.set('isInstalling', false);
        }
      }
    });
  },
  uninstall: function() {
    var self = this;
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/mtwilson/install',
      type: 'DELETE',
      dataType: 'json',
      complete: function(xhr, textStatus) {
        log(xhr.status + ' response from DELETE /api/v2/mtwilson/install: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            self.set('isInstalled', false);
            event('Trust Server successfully uninstalled.', Health.SUCCESS);
            break;
          case 500:
            event('Trust Server failed to uninstall.', Health.ERROR);
            break;
          default:
            event('Trust Server failed to uninstall.', Health.ERROR);
        }
      }
    });
  }
}).create();
