App.Network = Ember.Object.extend({
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
  actions: {
    save: function () {
      var networkData = {
        route: App.network.get('route'),
        management: App.network.get('management'),
        external: App.network.get('external'),
        dns: App.network.get('dns'),
        other: App.network.get('other')
      };
      $('i.loading').removeClass('hide');
      hash = {
        url: '/api/v1/netconfig',
        type: 'POST',
        data: JSON.stringify(networkData),
        dataType: 'json',
        contentType: 'application/json',
        complete: function (xhr) {
          App.log(xhr.status + ' response from POST /api/v1/netconfig: ' + xhr.statusText);
        },
        success: function (data) {
          $('i.loading').addClass('hide');
          // Update network config info (e.g. for DHCP)
          App.network.set('route', data.route);
          App.network.set('management', data.management);
          App.network.set('external', data.external);
          App.network.set('dns', data.dns);
          App.event('Network configuration saved successfully.', App.SUCCESS);
        },
        error: function (xhr) {
          $('i.loading').addClass('hide');
          App.event('Network configuration was not saved.', App.ERROR);
        }
      };
      hash = $.extend(hash, App.ajaxSetup);
      $.ajax(hash);
    }
  },
  check: function () {
    hash = {
      url: '/api/v1/netconfig',
      type: 'GET',
      dataType: 'json',
      complete: function (xhr) {
        App.log(xhr.status + ' response from GET /api/v1/netconfig: ' + xhr.statusText);
      },
      success: function (data) {
        // Load network config info
        App.network.set('route', data.route);
        App.network.set('management', data.management);
        App.network.set('external', data.external);
        App.network.set('dns', data.dns);
        App.network.set('other', data.other);
        App.event('Successfully loaded network configuration details.', App.SUCCESS, false);
      },
      error: function (xhr) {
        App.event('Network configuration details could not be loaded.', App.ERROR, false);
        App.log('ERROR ' + xhr.status + ' from GET /api/v1/netconfig: ' + xhr.statusText);
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  }
  
});
App.network = App.Network.create();
