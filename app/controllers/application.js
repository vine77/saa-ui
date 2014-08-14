import Ember from 'ember';
import Health from '../utils/mappings/health';
import mtWilson from '../models/mt-wilson';
import nova from '../models/nova';
import openrc from '../models/openrc';
import quantum from '../models/quantum';
import keystone from '../models/keystone';

export default Ember.Controller.extend({
  needs: ['statuses', 'build', 'login', 'vms'],
  isAutoRefreshEnabled: true,
  loggedIn: Ember.computed.alias('controllers.login.loggedIn'),
  isReadycloud: Ember.computed.alias('controllers.build.isReadycloud'),
  isMtWilsonInstalledBinding: Ember.computed.alias('mtWilson.isInstalled'),
  isMtWilsonSupportedBinding: Ember.computed.alias('mtWilson.isSupported'),
  init: function() {
    this._super();
    this.autoRefresh();
    this.resizeHandler();
    Ember.$(window).bind('resize', Ember.$.proxy(this.get('resizeHandler'), this));
  },
  width: null,
  height: null,
  resizeHandler: function() {
    this.set('width', Ember.$(window).width());
    this.set('height', Ember.$(window).height());
  },
  isFramed: function() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }.property(),
  isHealthy: function() {
    var health = this.get('controllers.statuses.health');
    return health === Health.SUCCESS || health === Health.INFO || health === Health.WARNING;
  }.property('controllers.statuses.health'),
  isConfigured: function() {
    return nova.get('exists') && openrc.get('exists');
  }.property('nova.exists', 'openrc.exists'),
  isEnabled: function() {
    return this.get('isHealthy') && this.get('isConfigured');
  }.property('isHealthy', 'isConfigured'),
  baseUrl: function() {
    return '//' + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
  }.property(),
  isHorizonAvailable: false,
  horizonUrl: function() {
    return this.get('baseUrl') + '/horizon';
  }.property(),
  fuelUrl: function() {
    return this.get('baseUrl') + '/fuel';
  }.property(),
  logsUrl: function() {
    return this.get('baseUrl') + '/kibana3/index.html#/dashboard/file/logs.json';
  }.property(),
  helpUrl: function() {
    return this.get('baseUrl') + '/docs/api/';
  }.property(),
  graphsUrl: function() {
    if (window.location.protocol === 'https:') {
      return 'https://' + window.location.hostname + ':86';
    } else {
      return 'http://' + window.location.hostname + ':85';
    }
  }.property(),
  isDrawerExpanded: false,
  autoRefresh: function() {
    Ember.run.later(this, 'autoRefresh', 20000);
    if (this.get('loggedIn') && this.get('isEnabled') && this.get('isAutoRefreshEnabled')) {
      nova.check();
      openrc.check();
      quantum.check();
      keystone.check();
      this.store.find('slo');
      this.store.find('sla');
      this.store.find('flavor');
      var self = this;
      this.store.find('vm').then(function(vms) {
        if (self.get('currentPath') == 'app.data.vms.vmsVm.index') {
          var currentVm = self.get('controllers.vms').findBy('isExpanded', true) && self.get('controllers.vms').findBy('isExpanded', true).get('id');
          self.store.find('vm', currentVm).then(function(record) {
            record.reload();
          });
          self.store.find('vmInstantiationDetailed', currentVm).then(function(record) {
            record.reload();
          });
          self.store.find('vmInstantiationSimple', currentVm).then(function(record) {
            record.reload();
          });
        }
      });
      if (mtWilson.get('isInstalled')) {
        this.store.find('trustMle');
        this.store.find('trustNode');
      }
      this.store.find('node');
      this.store.find('action');
    }
  },

  // Actions
  actions: {
    expandDrawer: function(target) {
      this.set('isDrawerExpanded', true);
    },
    hideDrawer: function() {
      Ember.$('#drawer ul.nav-tabs > li').removeClass('active');
      this.set('isDrawerExpanded', false);
    },
    loadFrame: function(target) {
      var iframe = Ember.$('#drawer-' + target + '-all > iframe');
      if (iframe.attr('src') === undefined) {
        iframe.attr('src', this.get(target + 'Url'));
      }
    },
    // Debug Toolbar actions
    refreshNodes: function() {
      var self = this;
      if (mtWilson.get('isInstalled')) {
        this.store.find('trustNode').then(function() {
          self.store.find('node');
        });
      } else {
        this.store.find('node');
      }
    },
    refreshVms: function() {
      this.store.find('vm');
    },
    clearConsole: function() {
      console.clear();
    },
    disableAutoRefresh: function() {
      this.set('isAutoRefreshEnabled', false);
    },
    enableAutoRefresh: function() {
      this.set('isAutoRefreshEnabled', true);
    }
  }
});
