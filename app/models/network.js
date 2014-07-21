import Ember from 'ember';
import Health from '../utils/mappings/health';

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
    $('i.loading').removeClass('hide');
    return Ember.$.ajax({
      url: (App.getApiDomain()) + '/api/v2/netconfig',
      type: 'POST',
      data: JSON.stringify(networkData),
      dataType: 'json',
      contentType: 'application/json',
      complete: function(xhr) {
        App.log(xhr.status + ' response from POST /api/v2/netconfig: ' + xhr.statusText);
      },
      success: function(data) {
        $('i.loading').addClass('hide');
        // Update network config info (e.g. for DHCP)
        App.network.set('route', data.route);
        App.network.set('management', data.management);
        App.network.set('external', data.external);
        App.network.set('dns', data.dns);
        App.network.set('other', data.other);
        App.network.set('serverExternal', Ember.$.extend(true, {}, data.external));
        App.event('Network configuration saved successfully.', Health.SUCCESS);
      },
      error: function(xhr) {
        $('i.loading').addClass('hide');
        App.xhrError(xhr, 'Network configuration was not saved.');
      }
    });
  },
  check: function() {
    return Ember.$.ajax({
      url: (App.getApiDomain()) + '/api/v2/netconfig',
      type: 'GET',
      dataType: 'json',
      complete: function(xhr) {
        App.log(xhr.status + ' response from GET /api/v2/netconfig: ' + xhr.statusText);
      },
      success: function(data) {
        // Load network config info
        App.network.set('route', data.route);
        App.network.set('management', data.management);
        App.network.set('external', data.external);
        App.network.set('dns', data.dns);
        App.network.set('other', data.other);
        App.network.set('serverExternal', Ember.$.extend(true, {}, data.external));
        App.event('Successfully loaded network configuration details.', Health.SUCCESS, false);
      },
      error: function(xhr) {
        App.event('Network configuration details could not be loaded.', Health.ERROR, false);
        App.log('ERROR ' + xhr.status + ' from GET /api/v2/netconfig: ' + xhr.statusText);
      }
    });
  }
}).create();