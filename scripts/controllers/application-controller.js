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
      App.TrustNode.find(undefined, true).then(function() {
        App.Node.find(undefined, true);
      });
    } else {
      App.Node.find(undefined, true);
    }
  },
  refreshVms: function () {
    App.Vm.find(undefined, true);
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
  },
  initModels: function() {
    // Load data from APIs
    App.mtWilson.check().then(function() {
      if (App.application.get('isEnabled')) {
        if (App.mtWilson.get('isInstalled') === true) {
          App.TrustNode.find().then(function() {
            App.Node.find();
          });
        } else {
          App.Node.find();
        }
        App.Vm.find();
      }
    }, function() {
      if (App.application.get('isEnabled')) {
        App.Node.find();
        App.Vm.find();
      }
    });
    App.Flavor.find();
    App.Sla.find();
    App.users = App.User.find();
    var promises = [App.nova.check(), App.openrc.check(), App.quantum.check(), App.network.check(), App.build.find(), App.settingsLog.fetch(), App.users];
    return Ember.RSVP.all(promises);
  },
  autoRefresh: function () {
    this.refreshNodes();
    this.refreshVms();
    App.Flavor.find(undefined, true);
    App.Sla.find(undefined, true);
    Ember.run.later(this, 'autoRefresh', 30000);
  }
});
