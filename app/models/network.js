import Ember from 'ember';
import Health from '../utils/mappings/health';
import log from '../utils/log';
import getApiDomain from '../utils/get-api-domain';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

// TODO: Port to real model
export default Ember.Object.extend({
  route: {
    gateway: ''
  },
  management: {
    mac: '',
    broadcast: '',
    netmask: '',
    address: '',
    active: true,
    dhcp: true
  },
  external: {
    mac: '',
    broadcast: '',
    netmask: '',
    address: '',
    active: true,
    dhcp: true
  },
  dns: {
    ns1: '',
    ns2: '',
    ns3: ''
  },
  other: {
    hostname: ''
  },
  serverExternal: {},
  save: function() {
    var networkData = {
      route: App.network.get('route'),
      management: App.network.get('management'),
      external: App.network.get('external'),
      dns: App.network.get('dns'),
      other: App.network.get('other')
    };
    Ember.$('i.loading').removeClass('hide');
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/netconfig',
      type: 'POST',
      data: JSON.stringify(networkData),
      dataType: 'json',
      contentType: 'application/json',
      complete: function(xhr) {
        log(xhr.status + ' response from POST /api/v2/netconfig: ' + xhr.statusText);
      },
      success: function(data) {
        Ember.$('i.loading').addClass('hide');
        // Update network config info (e.g. for DHCP)
        App.network.set('route', data.route);
        App.network.set('management', data.management);
        App.network.set('external', data.external);
        App.network.set('dns', data.dns);
        App.network.set('other', data.other);
        App.network.set('serverExternal', Ember.$.extend(true, {}, data.external));
        event('Network configuration saved successfully.', Health.SUCCESS);
      },
      error: function(xhr) {
        Ember.$('i.loading').addClass('hide');
        xhrError(xhr, 'Network configuration was not saved.');
      }
    });
  },
  check: function() {
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/netconfig',
      type: 'GET',
      dataType: 'json',
      complete: function(xhr) {
        log(xhr.status + ' response from GET /api/v2/netconfig: ' + xhr.statusText);
      },
      success: function(data) {
        // Load network config info
        App.network.set('route', data.route);
        App.network.set('management', data.management);
        App.network.set('external', data.external);
        App.network.set('dns', data.dns);
        App.network.set('other', data.other);
        App.network.set('serverExternal', Ember.$.extend(true, {}, data.external));
        event('Successfully loaded network configuration details.', Health.SUCCESS, false);
      },
      error: function(xhr) {
        event('Network configuration details could not be loaded.', Health.ERROR, false);
        log('ERROR ' + xhr.status + ' from GET /api/v2/netconfig: ' + xhr.statusText);
      }
    });
  }
}).create();
