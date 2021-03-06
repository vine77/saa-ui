App.ApplicationController = Ember.Controller.extend({
  needs: ['statuses', 'build', 'login', 'vms', 'trustMles'],
  isAutoRefreshEnabled: true,
  loggedIn: Ember.computed.alias('controllers.login.loggedIn'),
  isReadycloud: Ember.computed.alias('controllers.build.isReadycloud'),
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  init: function () {
    var self = this;
    this._super();
    this.autoRefresh();
    this.resizeHandler();
    $(window).bind('resize', Ember.$.proxy(this.get('resizeHandler'), this));
  },
  width: null,
  height: null,
  resizeHandler: function () {
    this.set('width', $(window).width());
    this.set('height', $(window).height());
  },
  isFramed: function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }.property(),
  isHealthy: function () {
    var health = this.get('controllers.statuses.health');
    return health === App.SUCCESS || health === App.INFO || health === App.WARNING;
  }.property('controllers.statuses.health'),
  isConfigured: function () {
    return App.nova.get('exists') && App.openrc.get('exists') && App.keystoneConf.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists', 'App.keystoneConf.exists'),
  isEnabled: function () {
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
  autoRefresh: function () {
    Ember.run.later(this, 'autoRefresh', 20000);
    if (this.get('isAutoRefreshEnabled') && this.get('loggedIn')) {
      App.nova.check();
      App.openrc.check();
      App.quantum.check();
      App.keystone.check();
      if (this.get('isEnabled')) {
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
        if (App.mtWilson.get('isInstalled')) {
          this.store.find('trustNode');
          this.store.find('trustMle').then(function(trustMles) {
            if (self.get('currentPath') == 'app.data.trust.mles.trust.mle') {
              var currentMle = self.get('controllers.trustMles').findBy('isExpanded', true) && self.get('controllers.trustMles').findBy('isExpanded', true).get('id');
              self.store.find('trustMle', currentMle).then(function(record) {
                record.reload();
              });
            }
          });
        }
        this.store.find('node');
        this.store.find('cgroup');
        this.store.find('action');
      }
    }
  },

  // Actions
  actions: {
    expandDrawer: function (target) {
      this.set('isDrawerExpanded', true);
    },
    hideDrawer: function () {
      $('#drawer ul.nav-tabs > li').removeClass('active');
      this.set('isDrawerExpanded', false);
    },
    expand: function(target) {
      Ember.$('#' + target).addClass('expanded');
      this.set(target.camelize() + 'Expanded', true);
    },
    contract: function(target) {
      Ember.$('#' + target).removeClass('expanded');
      this.set(target.camelize() + 'Expanded', false);
    },
    loadFrame: function (target) {
      var iframe = $('#drawer-' + target + '-all > iframe');
      if (iframe.attr('src') === undefined) {
        iframe.attr('src', this.get(target + 'Url'));
      }
    },
    updateCurrentPath: function () {
      App.set('currentPath', this.get('currentPath'));
    }.observes('currentPath'),
    // Debug Toolbar actions
    refreshNodes: function () {
      var self = this;
      if (App.mtWilson.get('isInstalled')) {
        this.store.find('trustNode').then(function() {
          self.store.find('node');
        });
      } else {
        this.store.find('node');
      }
    },
    refreshVms: function () {
      this.store.find('vm');
    },
    clearConsole: function () {
      console.clear();
    },
    disableAutoRefresh: function () {
      this.set('isAutoRefreshEnabled', false);
    },
    enableAutoRefresh: function () {
      this.set('isAutoRefreshEnabled', true);
    }
  }
});
