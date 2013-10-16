App.ApplicationController = Ember.Controller.extend({
  needs: 'status',
  isAutoRefreshEnabled: true,
  buildVersionBinding: 'App.Build.firstObject.version',
  buildDateBinding: 'App.Build.firstObject.date',
  loggedIn: true,  // TODO: Update authentication bindings
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  init: function () {
    this._super();
    this.autoRefresh();
  },
  isHealthy: function () {
    var health = this.get('controllers.status.health');
    return health === App.SUCCESS || health === App.INFO || health === App.WARNING;
  }.property('controllers.status.health'),
  isConfigured: function () {
    return App.nova.get('exists') && App.openrc.get('exists') && App.quantum.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists', 'App.quantum.exists'),
  isEnabled: function () {
    return this.get('isHealthy') && this.get('isConfigured');
  }.property('isHealthy', 'isConfigured'),
  horizonUrl: function() {
    return 'http://' +window.location.hostname + '/horizon';
  }.property(),
  logsUrl: function() {
    return 'http://' + window.location.hostname + '/kibana/index.html#eyJzZWFyY2giOiIoQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHk6XCJXYXJuaW5nK1wiIE9SIEBmaWVsZHMuc3lzbG9nX3NldmVyaXR5OlwiRXJyb3JcIiBPUiBAZmllbGRzLnN5c2xvZ19zZXZlcml0eTpcIkNyaXRpY2FsXCIpIiwiZmllbGRzIjpbIkBzb3VyY2VfaG9zdCIsIkBtZXNzYWdlIiwiQGZpZWxkcy5jYXRlZ29yeSIsIkBmaWVsZHMuc3lzbG9nX3NldmVyaXR5Il0sIm9mZnNldCI6MCwidGltZWZyYW1lIjoiYWxsIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM2ODgyODA0ODYzMX0=';
  }.property(),
  graphsUrl: function() {
    // Node Data (Graphite): port 85
    return 'http://' + window.location.hostname + ':85';
  }.property(),
  isDrawerExpanded: false,
  autoRefresh: function () {
    // TODO: Add authentication check to polling
    if (this.get('isEnabled') && this.get('isAutoRefreshEnabled')) {
      this.store.find('slo', undefined, true);
      this.store.find('sla', undefined, true);
      this.store.find('flavor', undefined, true);
      this.store.find('vm', undefined, true);
      if (App.mtWilson.get('isInstalled')) this.store.find('trustNode', undefined, true);
      this.store.find('node', undefined, true);
    }
    if (this.get('isAutoRefreshEnabled')) Ember.run.later(this, 'autoRefresh', 30000);
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
        this.store.find('trustNode', undefined, true).then(function() {
          self.store.find('node', undefined, true);
        });
      } else {
        this.store.find('node', undefined, true);
      }
    },
    refreshVms: function () {
      this.store.find('vm', undefined, true);
    },
    bypassLogin: function () {
      App.nova.set('exists', true);
      App.openrc.set('exists', true);
      App.quantum.set('exists', true);
      App.state.set('loggedIn', true);
      App.session.set('bypass', true);
      this.transitionToRoute('dashboard');
    },
    clearConsole: function () {
      console.clear();
    },
    disableAutoRefresh: function () {
      this.set('isAutoRefreshEnabled', false);
      console.log('Disabled auto-refresh');
    },
    enableAutoRefresh: function () {
      this.set('isAutoRefreshEnabled', true);
      console.log('Enabled auto-refresh');
    }
  }
});
