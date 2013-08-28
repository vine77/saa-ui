App.ApplicationController = Ember.ArrayController.extend({
  buildVersionBinding: 'App.Build.firstObject.version',
  buildDateBinding: 'App.Build.firstObject.date',
  //buildVersionBinding: 'App.Build.firstObject.version',
  //buildDateBinding: 'App.build.date',
  loggedInBinding: 'App.state.loggedIn',
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  horizonUrl: function() {
    return 'http://' +window.location.hostname + '/horizon';
  }.property(),
  logsUrl: function() {
    // Kibana: port 5601
    //return 'http://' + window.location.hostname + ':5601';
    //return 'http://' + window.location.hostname + '/kibana/index.html#eyJzZWFyY2giOiIiLCJmaWVsZHMiOlsiQHNvdXJjZV9ob3N0IiwiQG1lc3NhZ2UiLCJAZmllbGRzLnN5c2xvZ19wcm9ncmFtIiwiQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHkiXSwib2Zmc2V0IjowLCJ0aW1lZnJhbWUiOiJhbGwiLCJncmFwaG1vZGUiOiJjb3VudCIsInRpbWUiOnsidXNlcl9pbnRlcnZhbCI6MH0sInN0YW1wIjoxMzY4ODI4MDQ4NjMxfQ==';
    return 'http://' + window.location.hostname + '/kibana/index.html#eyJzZWFyY2giOiIoQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHk6XCJXYXJuaW5nK1wiIE9SIEBmaWVsZHMuc3lzbG9nX3NldmVyaXR5OlwiRXJyb3JcIiBPUiBAZmllbGRzLnN5c2xvZ19zZXZlcml0eTpcIkNyaXRpY2FsXCIpIiwiZmllbGRzIjpbIkBzb3VyY2VfaG9zdCIsIkBtZXNzYWdlIiwiQGZpZWxkcy5zeXNsb2dfcHJvZ3JhbSIsIkBmaWVsZHMuc3lzbG9nX3NldmVyaXR5Il0sIm9mZnNldCI6MCwidGltZWZyYW1lIjoiYWxsIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM2ODgyODA0ODYzMX0=';
  }.property(),
  graphsUrl: function() {
    // Node Data (Graphite): port 85
    return 'http://' + window.location.hostname + ':85';
  }.property(),
  isDrawerExpanded: false,
  expandDrawer: function (target) {
    //$('#drawer').find('a[data-target=drawer- ' + target + ']').click();
    //$('drawer').find('a[data-target=drawer- ' + target + ']').tab('show');
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
    App.Node.all().clear();
    if (App.mtWilson.get('isInstalled') === true) {
      App.TrustNode.find().then(function() {
        App.Node.find();
      });
    } else {
      App.Node.find();
    }
  },
  refreshVms: function () {
    App.Vm.all().clear();
    App.Vm.find();
  },
  bypassLogin: function () {
    App.nova.set('exists', true);
    App.openrc.set('exists', true);
    App.state.set('loggedIn', true);
    App.session.set('bypass', true);
    this.transitionToRoute('dashboard');
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
    },
    function() {
      if (App.application.get('isEnabled')) {
        App.Node.find();
        App.Vm.find();
      }
    });
    App.users = App.User.find();
    var promises = [App.nova.check(), App.openrc.check(), App.quantum.check(), App.network.check(), App.build.find(), App.users];
    return Ember.RSVP.all(promises);
  }  
});
