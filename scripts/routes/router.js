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

// Application
App.ApplicationRoute = Ember.Route.extend({
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

// Dashboard
App.DashboardRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    controller.set('model', this.store.find('event'));
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
App.NodesRoute = Ember.Route.extend({
  /*
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      this.store.find('trustNode', undefined, true).then(function() {
        if (this.store.all('node').get('length') == 0) {
          controller.set('model', this.store.find('node', undefined, true));
        } else {
          controller.set('model', this.store.all('node'));
        }
      });
    } else {
      if (this.store.all('node').get('length') == 0) {
        controller.set('model', this.store.find('node', undefined, true));
      } else {
        controller.set('model', this.store.all('node'));
      }
    }
  }
  */
  model: function () {
    // TODO: Move model loading to background
    return this.store.find('node', undefined, true);
  }
});

App.NodesIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('node').setEach('isActive', false);
  }
});
App.NodesNodeRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('node').setEach('isActive', false);
    model.set('isActive', true);
  }
});

// VMs
App.VmsRoute = Ember.Route.extend({
  model: function () {
    if (this.store.all('vm').get('length') == 0) {
      return this.store.find('vm', undefined, true);
    } else {
      return this.store.all('vm');
    }
  }
});
App.VmsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('vm').setEach('isActive', false);
  }
});
App.VmsVmRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('vm').setEach('isActive', false);
    model.set('isActive', true);
  }
});

// Services
App.ServicesIndexRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('flavors');
  }
});

// Flavors
App.FlavorsRoute = Ember.Route.extend({
  model: function () {
    if (this.store.all('flavor').get('length') == 0) {
      return this.store.find('flavor', undefined, true);
    } else {
      return this.store.all('flavor');
    }
  }
});
App.FlavorsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('flavor').setEach('isActive', false);
  }
});
App.FlavorRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('flavor').setEach('isActive', false);
    model.set('isActive', true);
  }
});
App.FlavorsCreateRoute = Ember.Route.extend({
  model: function () {
    return null;
  },
  renderTemplate: function () {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  }
});

// SLAs
App.SlasRoute = Ember.Route.extend({
  model: function () {
    if (this.store.all('sla').get('length') == 0) {
      return this.store.find('sla', undefined, true);
    } else {
      return this.store.all('sla');
    }
  }
});
App.SlasIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('sla').setEach('isActive', false);
  }
});
App.SlaRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.store.all('sla').setEach('isActive', false);
    model.set('isActive', true);
  }
});

// Trust
App.TrustIndexRoute = Ember.Route.extend({
  redirect: function () {
    // If Mt. Wilson is installed, go to Trust Dashboard
    if (App.mtWilson.get('isInstalled')) {
      this.transitionTo('trust.mles.index');
    } else {
      // If Mt. Wilson is installing, recheck status
      if (App.mtWilson.get('isInstalling')) App.mtWilson.check();
    }
  }
});

// Whitelist/Fingerprint Manager
App.TrustMlesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('trustMle', undefined, true);
  }
});

App.TrustMlesIndexRoute = Ember.Route.extend({
  model: function () {
    return App.TrustMle.find(undefined, true);
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      this.store.find('trustNode', undefined, true).then(function() {
        controller.set('model', this.store.all('trustMle'));
      });
      this.store.all('trustMle').setEach('isActive', false);
    }
  }
});

App.TrustMleRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      model.reload();
      this.store.all('trustMle').setEach('isActive', false);
      model.set('isActive', true);
    }
  }
});

// Settings
App.SettingsIndexRoute = Ember.Route.extend({
  model: function() {
    return App.overrides.fetch();
  },
  redirect: function () {
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
  model: function () {
    return App.overrides.fetch();
  }
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
