App.Router.map(function () {
  this.resource('login');
  this.resource('tempPassword');
  this.resource('profile', {path: 'profiles/:user_id'});
  this.resource('modal');
  this.resource('dashboard');
  this.resource('help');
  this.resource('roles');
  this.resource('nodes', function () {
    this.resource('nodesNode', {path: '/:node_id'}, function () {
      this.route('graphs');
      this.route('vms');
    });
  });
  this.resource('vms', function () {
    this.resource('vmsVm', {path: '/:vm_id'}, function () {
      this.route('graphs');
    });
  });
  this.resource('data');
  this.resource('logs');
  this.resource('services', function () {
    this.resource('slas', function () {
      this.resource('sla', {path: '/:sla_id'});
    });
    this.resource('flavors', function () {
      this.resource('flavor', {path: '/:flavor_id'}, function () {
        this.route('vms');
      });
      this.route('create');
    });
  });
  this.resource('trust', function () {
    this.resource('trust.mles', {path: 'mles'}, function () {
     this.resource('trust.mle', {path: '/:trustMle_id'});
    });
    this.route('dashboard');
    //this.route('whitelistPortal');
    //this.route('management');
  });
  this.resource('settings', function () {
    this.route('upload');
    this.route('network');
    this.route('mailserver');
    this.route('users');
    this.route('dev');
    this.route('log');
    this.route('trust');
  });
});

// Use EnabledRoute for routes that require the app to be enabled (configured and healthy)
App.EnabledRoute = Ember.Route.extend({
  beforeModel: function () {
    // TODO: Make this check async-capable
    //if (!this.controllerFor('application').get('isEnabled')) this.transitionTo('index');
  }
});

// Loading route (when ajax requests are out)
App.LoadingRoute = Ember.Route.extend();

// Application
App.ApplicationRoute = Ember.Route.extend({
  init: function () {
    App.store = this.store;
    App.route = this;
  },
  setupController: function () {
    this.controllerFor('vms').set('model', this.store.find('vm'));
  },
  model: function () {
    var self = this;
    return this.controllerFor('status').updateCurrentStatus().then(function () {
      // Status API has responded
      return App.nova.check().then(function () {
        // SAM is configured
        self.store.find('slo');
        self.store.find('sla');
        self.store.find('flavor');
        self.store.find('vm');
        App.mtWilson.check().then(function () {
          if (App.mtWilson.get('isInstalled')) {
            self.store.find('trustNode');
            self.store.find('node');
          } else {
            self.store.find('node');
          }
        }, function () {
          self.store.find('node');
        }),
        self.store.find('user');
        App.openrc.check();
        App.quantum.check();
        App.network.check();
        App.build.find();
        App.settingsLog.fetch();
      }, function () {
        // SAM is not configured
        self.store.find('user');
        App.openrc.check();
        App.quantum.check();
        App.network.check();
        App.build.find();
        App.settingsLog.fetch();
        // Don't block loading if SAM is not configured
        return new Ember.RSVP.Promise(function (resolve, reject) { resolve(); });
      });

    }, function () {
      // Status API is not responding
      var confirmed = confirm('The Status API is not responding. Would you like to try to load the application again?');
      if (confirmed) {
        location.reload();
      }
      // Block loading if Status API fails
      return new Ember.RSVP.Promise(function (resolve, reject) { reject(); });
    });
  },
  setupController: function (controller, model) {
    // Set models for these controllers on app load (instead of waiting for route transitions)
    this.controllerFor('slas').set('model', this.store.all('sla'));
    this.controllerFor('flavors').set('model', this.store.all('flavor'));
    this.controllerFor('vms').set('model', this.store.all('vm'));
    this.controllerFor('nodes').set('model', this.store.all('node'));
  },
  actions: {
    logout: function() {
      // TODO: Migrate Sunil's authentication code
      /*
      var cleanup = function() {
        location.href = '/';
      };
      App.session.deleteRecord();
      var handlers = {'didDelete' : {postFun:cleanup, nextRoute:'login'}};
      App.modelhelper.doTransaction(App.session, this.controller, this, handlers);
      */
    },
    showModal: function (modalName, controllerName) {
      App.ModalView.create({
        templateName: 'modals/' + modalName,
        controller: this.controllerFor(controllerName)
      }).append();
    }
  }
});

// TODO: Migrate Sunil's authentication code
/*
// Index
App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    var route = App.state.get('route');
    var context = App.state.get('context');
    if (context != null) {
      this.transitionTo(route, context);
    } else {
      this.transitionTo(route);
    }
  }
});
*/

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('dashboard');
  }
});

App.LoginRoute = Ember.Route.extend({
  actions: {
    login: function () {
      this.controller.createSession(this);
    }
  }
});

App.TempPasswordRoute = Ember.Route.extend({
  actions: {
    generate_password: function() {
      this.controller.generatePassword(this);
    }
  }
});

App.ProfileRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  },
  setupController: function(controller, model) {
    if (!model.get('isLoaded')) {
      // TODO: Migrate Sunil's authentication code. Can't use model.on()
      model.on('didLoad', function() {
        model.off('didLoad');
        controller.initFields(model);
      });
    } else {
      controller.initFields(model);
    }
    if (controller.getMailServer) {
      var mail_controller = this.controllerFor('settings.mailserver');
      var mail_server = this.store.find('mailserver', 'default');
      mail_controller.set('model', mail_server);
      // TODO: Migrate Sunil's authentication code. Can't use model.on()
      mail_server.on('didLoad', function() {
        mail_controller.initFields(mail_server);
      });
      mail_controller.set('standalone', false);
    }
    this._super(controller, model);
  },
  actions: {
    save: function () {
      this.controller.saveProfile(this);
    },
    test_email: function() {
      this.controller.sendTestEmail(this);
    },
    reset: function() {
      this.controller.resetProfile(this);
    }
  }
});


// Nodes
App.NodesIndexRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('nodes').setEach('isExpanded', false);
  }
});
App.NodesNodeRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('nodes').setEach('isExpanded', false);
    this.controllerFor('nodes').findBy('id', model.get('id')).set('isExpanded', true);
  },
  actions: {
    closeDetails: function() {
      this.transitionTo('nodes');
    }
  }
});

// VMs
App.VmsIndexRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('vms').setEach('isExpanded', false);
  }
});
App.VmsVmRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('vms').setEach('isExpanded', false);
    this.controllerFor('vms').findBy('id', model.get('id')).set('isExpanded', true);
  },
  actions: {
    closeDetails: function() {
      this.transitionTo('vms');
    }
  }
});

// Services
App.ServicesIndexRoute = App.EnabledRoute.extend({
  beforeModel: function () {
    this._super();
    this.transitionTo('flavors');
  }
});

// Flavors
App.FlavorsIndexRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('flavors').setEach('isExpanded', false);
  }
});
App.FlavorRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('flavors').setEach('isExpanded', false);
    this.controllerFor('flavors').findBy('id', model.get('id')).set('isExpanded', true);
  }
});
App.FlavorsCreateRoute = App.EnabledRoute.extend({
  model: function () {
    return this.store.all('flavor');
  },
  renderTemplate: function () {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  }
});

// SLAs
App.SlasIndexRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('slas').setEach('isExpanded', false);
  }
});
App.SlaRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('slas').setEach('isExpanded', false);
    this.controllerFor('slas').findBy('id', model.get('id')).set('isExpanded', true);
  }
});

// Trust
App.TrustIndexRoute = App.EnabledRoute.extend({
  beforeModel: function () {
    this._super();
    // If Mt. Wilson is installed, go to MLEs
    if (App.mtWilson.get('isInstalled')) {
      this.transitionTo('trust.mles.index');
    } else {
      // If Mt. Wilson is installing, recheck status
      if (App.mtWilson.get('isInstalling')) App.mtWilson.check();
    }
  }
});

// Whitelist/Fingerprint Manager
App.TrustMlesRoute = App.EnabledRoute.extend({
  model: function () {
    return this.store.find('trustMle', undefined, true);
  }
});
App.TrustMlesIndexRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('trustMles').setEach('isExpanded', false);
  }
});
App.TrustMleRoute = App.EnabledRoute.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    model.reload();
    this.controllerFor('trustMles').setEach('isExpanded', false);
    this.controllerFor('trustMles').findBy('id', model.get('id')).set('isExpanded', true);
  }
});

// Settings
App.SettingsIndexRoute = Ember.Route.extend({
  beforeModel: function () {
    this.transitionTo('settings.upload');
  }
});
App.SettingsUsersRoute = Ember.Route.extend({
  model: function() {
    return App.users;
  }
});
App.SettingsLogRoute = Ember.Route.extend({
  model: function() {
    return App.settingsLog.fetch();
  }
});

App.SettingsUploadRoute = Ember.Route.extend({
  /*
  model: function () {
    return App.overrides.fetch();
  }
  */
});

App.SettingsMailserverRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('mailserver', 'default');
  },
  setupController: function(controller, model) {
    if (!model.get('isLoaded')) {
      // TODO: Migrate Sunil's authentication code. Can't use model.on()
      model.on('didLoad', function() {
        controller.initFields(model);
        model.off('didLoad');
      });
    }
    else {
      controller.initFields(model);
    }
    controller.set('standalone', true);
    this._super(controller,model);
  },
  actions: {
    save: function () {
      this.controller.saveConfig(this, false);
    },
    test_email: function() {
      this.controller.saveConfig(this, true);
    },
    reset: function () {
      this.controller.resetConfig(this);
    }
  }
});

// TODO: Migrate Sunil's authentication code
/*
Ember.Route.reopen({
  activate: function () {
    var route = this;
    var currentRoute = this.get('routeName');
    var noauth = ['login', 'profile', 'tempPassword']
    if ($.inArray(currentRoute, noauth) == -1) {
      if ((currentRoute != 'application') && (currentRoute != 'index')) {
        var context = this.get('context');
        App.state.set('route', currentRoute);
        App.state.set('context', context);
      }

      // Not using 'isLoaded'. On error, the state is reset to 'loaded.saved' (from modelhelper).
      // Hence isLoaded may be misleading.
      var isLoaded = (App.session) ? !(App.session.get('isLoading') || App.session.get('isDeleted')) || App.session.get('bypass') : false;

      if (!isLoaded) {
        // Load current session
        var initAndLoad = function(model, controller, route) {
          App.state.set('loggedIn', true);
          route.controllerFor('application').initModels().then(function () {
            route.transitionTo('index');
          }, function () {
            route.transitionTo('index');
          });
        };
        var unloadModel = function(model, controller, route) {
          model.unloadRecord();
        };
        App.session = this.store.find('session', 'current_session');
        var handlers = {
          'didLoad' : {postFun:initAndLoad},
          'becameError' : {postFun:unloadModel, nextRoute:'login', resetState:true}
        };
        App.modelhelper.doTransaction(App.session, this.controller, this, handlers);
      }
    }
    this._super();
  }

});
*/
