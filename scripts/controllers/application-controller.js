App.ApplicationController = Ember.Controller.extend({
  needs: ['statuses', 'build', 'login'],
  isAutoRefreshEnabled: true,
  loggedIn: Ember.computed.alias('controllers.login.loggedIn'),
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  init: function () {
    var self = this;
    this._super();
    this.autoRefresh();
    this.resizeHandler();
    $(window).bind('resize', Ember.$.proxy(this.get('resizeHandler'), this));
    // Check link for OpenStack Horizon
    Ember.$.get('/horizon').then(function () {
      self.set('isHorizonAvailable', true);
    }, function () {
      Ember.$.get('/dashboard').then(function () {
        self.set('isHorizonAvailable', true);
        self.set('horizonUrl', '/dashboard');
      }, function () {
        self.set('isHorizonAvailable', false);
      });
    });
  },
  width: null,
  height: null,
  resizeHandler: function () {
    this.set('width', $(window).width());
    this.set('height', $(window).height());
  },
  isHealthy: function () {
    var health = this.get('controllers.statuses.health');
    return health === App.SUCCESS || health === App.INFO || health === App.WARNING;
  }.property('controllers.statuses.health'),
  isConfigured: function () {
    return App.nova.get('exists') && App.openrc.get('exists') && App.quantum.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists', 'App.quantum.exists'),
  isEnabled: function () {
    return this.get('isHealthy') && this.get('isConfigured');
  }.property('isHealthy', 'isConfigured'),
  isHorizonAvailable: false,
  horizonUrl: '/horizon',
  fuelUrl: function() {
    return 'http://' + window.location.hostname + ':8000';
  }.property(),
  logsUrl: function() {
    return '/kibana3/index.html#/dashboard/file/logs.json';
  }.property(),
  graphsUrl: function() {
    return 'http://' + window.location.hostname + ':85';
  }.property(),
  isDrawerExpanded: false,
  autoRefresh: function () {
    Ember.run.later(this, 'autoRefresh', 20000);
    if (this.get('loggedIn') && this.get('isEnabled') && this.get('isAutoRefreshEnabled')) {
      this.store.find('slo');
      this.store.find('sla');
      this.store.find('flavor');
      this.store.find('vm');
      if (App.mtWilson.get('isInstalled')) {
        this.store.find('trustMle');
        this.store.find('trustNode');
      }
      this.store.find('node');
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
