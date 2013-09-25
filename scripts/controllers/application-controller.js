App.ApplicationController = Ember.ArrayController.extend({
  buildVersionBinding: 'App.Build.firstObject.version',
  buildDateBinding: 'App.Build.firstObject.date',
  //buildVersionBinding: 'App.Build.firstObject.version',
  //buildDateBinding: 'App.build.date',
  loggedInBinding: 'App.state.loggedIn',
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  init: function () {
    this._super();
    this.autoRefresh();
  },
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
      if (App.mtWilson.get('isInstalled') === true) {
        this.store.find('trustNode', undefined, true).then(function() {
          this.store.find('node', undefined, true);
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
    stopTimer: function () {
      clearInterval(App.application.get('timerId'));
      App.application.set('timerId', null);
      console.log('Paused timer');
    },
    startTimer: function () {
      if (!App.application.get('timerId')) {
        App.application.timer();
        console.log('Unpaused timer');
      } else {
        console.log('Timer is already running.');
      }
    }
  },

  // TODO: Consider using alternative method, such as ember-auth
  initModels: function() {
    // Load data from APIs
    App.mtWilson.check().then(function() {
      if (App.mtWilson.get('isInstalled') === true) {
        this.store.find('trustNode').then(function() {
          this.store.find('node');
        });
      } else {
        this.store.find('node');
      }
      this.store.find('vm');
    }, function() {
      this.store.find('node');
      this.store.find('vm');
    });
    this.store.find('flavor');
    this.store.find('sla');
    App.users = this.store.find('user');
    var promises = [App.nova.check(), App.openrc.check(), App.quantum.check(), App.network.check(), App.build.find(), App.settingsLog.fetch(), App.users];
    return Ember.RSVP.all(promises);
  },
  autoRefresh: function () {
    if (App.application.get('isEnabled') && App.state.get('loggedIn')) {
      this.refreshNodes();
      this.refreshVms();
      this.store.find('flavor', undefined, true);
      this.store.find('sla', undefined, true);
    }
    Ember.run.later(this, 'autoRefresh', 30000);
  }
});
