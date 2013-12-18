// Application
App.ApplicationRoute = Ember.Route.extend({
  init: function () {
    App.store = this.store;
    App.route = this;
  },
  model: function () {
    var self = this;
    return this.controllerFor('statuses').updateCurrentStatus().fail(function () {
      // Status API is not responding
      var confirmed = confirm('The Status API is not responding. Would you like to try to load the application again?');
      if (confirmed) {
        location.reload();
      }
      return new Ember.RSVP.reject();  // Block loading if Status API fails
    });
  },
  setupController: function (controller, model) {
    // Set models for these controllers on app load (instead of waiting for route transitions)
    this.controllerFor('slas').set('model', this.store.filter('sla', function (sla) {
      return !sla.get('deleted');
    }));
    this.controllerFor('flavors').set('model', this.store.all('flavor'), function (flavor) {
      return !flavor.get('deleted');
    });
    this.controllerFor('vms').set('model', this.store.all('vm'));
    this.controllerFor('nodes').set('model', this.store.all('node'));
  },
  removeCookies: function () {
    Ember.$.removeCookie('auth_pubtkt');
    Ember.$.removeCookie('csrftoken');
    Ember.$.removeCookie('samwebsession');
  },
  actions: {
    redirectToLogin: function (transition) {
      console.log('redirectToLogin');
      // Log out user
      this.controllerFor('login').set('loggedIn', false);
      this.controllerFor('login').set('username', null);
      this.controllerFor('login').set('password', null);
      // Save attempted route transition
      if (transition) this.controllerFor('login').set('attemptedTransition', transition);
      // Redirect to login route
      this.transitionTo('login');
    },
    logout: function() {
      var self = this;
      this.send('redirectToLogin');
      this.controllerFor('login').set('loggedIn', false);
      var session = this.controllerFor('login').get('session');
      if (session) {
        session.deleteRecord();
        session.save().then(function () {
          self.removeCookies();
        }).fail(function () {
          self.removeCookies();
        });
      } else {
        this.removeCookies();
      }
    },
    showModal: function (modalName, controllerName) {
      App.ModalView.create({
        templateName: 'modals/' + modalName,
        controller: this.controllerFor(controllerName)
      }).append();
    },
    error: function () {
      console.log('ApplicationRoute error');
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
  redirect: function() {
    this.transitionTo('dashboard');
  }
});

App.LoginRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('username', '');
    controller.set('password', '');
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

// Routes under /app require authentication
App.AppRoute = Ember.Route.extend({
  beforeModel: function (transition) {
    /*
    var csrfToken = Ember.$.cookie('token');
    if (csrfToken) {
      this.controllerFor('login').set('csrfToken', csrfToken);
    }
    */
    var loggedIn = this.controllerFor('application').get('loggedIn');
    if (!loggedIn) {
      transition.send('redirectToLogin', transition);
    }
  },
  model: function () {
    var self = this;
    // Get current session
    return this.store.find('session', 'current_session').then(function (session) {
      self.controllerFor('login').set('session', session);
      self.controllerFor('login').set('csrfToken', session.get('csrfToken'));
    }).then(function () {
      // Call config and other APIs
      return Ember.RSVP.hash({
        nova: App.nova.check(),
        openrc: App.openrc.check(),
        quantum: App.quantum.check()
      }).then(function () {
        // SAM is configured
        self.store.find('sloTemplate');
        self.store.find('slo');
        self.store.find('sla');
        self.store.find('flavor');
        self.store.find('vm');
        App.mtWilson.check().then(function () {
          if (App.mtWilson.get('isInstalled')) {
            self.store.find('trustMle');
            self.store.find('trustNode');
            self.store.find('node');
          } else {
            self.store.find('node');
          }
        }, function () {
          self.store.find('node');
        }),
        App.network.check();
        self.store.find('action');
        //self.store.find('user');
        //App.settingsLog.fetch();
      }, function () {
        // SAM is not configured
        App.network.check();
        //self.store.find('user');
        return new Ember.RSVP.resolve();  // Don't block loading if SAM is not configured
      });
    });
  },
  actions: {
    error: function (reason, transition) {
      if (reason.status === 401) {
        //transition.send('redirectToLogin', transition);
        App.log(reason.status + ' error caught by router: ' + reason);
        App.notify('Please log out and log back in.', App.ERROR, 'Unauthorized');
      }
    }
  }
});

// Routes under /app/data require app to be enabled
App.DataRoute = Ember.Route.extend({
  beforeModel: function () {
    if (!this.controllerFor('application').get('isEnabled')) {
      this.transitionTo('index');
    }
  }
});


// Nodes
App.NodesIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('nodes').setEach('isExpanded', false);
  }
});
App.NodesNodeRoute = Ember.Route.extend({
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
App.VmsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('vms').setEach('isExpanded', false);
  }
});
App.VmsVmRoute = Ember.Route.extend({
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
App.ServicesIndexRoute = Ember.Route.extend({
  beforeModel: function () {
    this.transitionTo('flavors');
  }
});

// Flavors
App.FlavorsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('flavors').setEach('isExpanded', false);
  }
});
App.FlavorRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('flavors').setEach('isExpanded', false);
    this.controllerFor('flavors').findBy('id', model.get('id')).set('isExpanded', true);
  }
});
App.FlavorsCreateRoute = Ember.Route.extend({
  model: function () {
    return this.store.createRecord('flavor');
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var flavor = this.modelFor('flavorsCreate');
    var sla = this.store.all('sla').findBy('isDirty');
    var slos = (sla) ? sla.get('slos') : [];
    slos.forEach(function (slo) {
      if (slo.get('isDirty')) slo.deleteRecord();
    });
    if (sla && sla.get('isDirty')) sla.deleteRecord();
    if (flavor.get('isDirty')) flavor.deleteRecord();
    this.controllerFor('flavorsCreate').set('selectedExistingSla', null);
  }
});
App.FlavorEditRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('flavor');
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var flavor = this.get('currentModel');
    var sla = this.store.all('sla').findBy('isDirty');
    var slos = (sla) ? sla.get('slos') : [];
    slos.forEach(function (slo) {
      if (slo.get('isDirty')) slo.deleteRecord();
    });
    if (sla && sla.get('isDirty')) sla.deleteRecord();
    if (flavor.get('isDirty')) flavor.rollback();
    this.controllerFor('flavorsCreate').set('selectedExistingSla', null);
  }
});

// SLAs
App.SlasIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('slas').setEach('isExpanded', false);
  }
});
App.SlaRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('slas').setEach('isExpanded', false);
    this.controllerFor('slas').findBy('id', model.get('id')).set('isExpanded', true);
  }
});
App.SlasCreateRoute = Ember.Route.extend({
  model: function () {
    return this.store.createRecord('sla', {id: App.uuid()});
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var sla = this.modelFor('slasCreate');
    var slos = sla.get('slos');
    slos.forEach(function (slo) {
      if (slo.get('isDirty')) slo.deleteRecord();
    });
    if (sla.get('isDirty')) sla.deleteRecord();
  }
});
App.SlaEditRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('sla');
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var sla = this.get('currentModel');
    var slos = sla.get('slos');
    slos.forEach(function (slo) {
      slo.rollback();
    });
    if (sla.get('isDirty')) sla.rollback();
  }
});

// Trust
App.TrustIndexRoute = Ember.Route.extend({
  beforeModel: function () {
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
App.TrustMlesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('trustMle');
  }
});
App.TrustMlesIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('trustMles').setEach('isExpanded', false);
  }
});
App.TrustMleRoute = Ember.Route.extend({
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
    return this.store.find('logSetting', 'current');
  }
});

App.SettingsUploadRoute = Ember.Route.extend({
  deactivate: function () {
    this.controllerFor('settingsUpload').send('cancel');
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

App.StatusesIndexRoute = Ember.Route.extend({
  beforeModel: function () {
    this.transitionTo('status1', this.store.getById('status', 'system'));
  }
});
App.StatusRoute = Ember.Route.extend({
  model: function (params) {
    var level = parseInt(this.routeName.slice(6));
    var parameter = params['status' + level + '_id'];
    return this.store.getById('status', parameter);
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    var level = parseInt(this.routeName.slice(6));
    controller.set('level', level);
  }
});
App.Status1Route = App.StatusRoute.extend();
App.Status2Route = App.StatusRoute.extend();
App.Status3Route = App.StatusRoute.extend();
App.Status4Route = App.StatusRoute.extend();
App.Status5Route = App.StatusRoute.extend();
App.Status6Route = App.StatusRoute.extend();
App.Status7Route = App.StatusRoute.extend();
App.Status8Route = App.StatusRoute.extend();
App.Status9Route = App.StatusRoute.extend();
App.Status10Route = App.StatusRoute.extend();
App.Status11Route = App.StatusRoute.extend();
App.Status12Route = App.StatusRoute.extend();
App.Status13Route = App.StatusRoute.extend();
App.Status14Route = App.StatusRoute.extend();
App.Status15Route = App.StatusRoute.extend();
App.Status16Route = App.StatusRoute.extend();
App.Status17Route = App.StatusRoute.extend();
App.Status18Route = App.StatusRoute.extend();
App.Status19Route = App.StatusRoute.extend();
App.Status20Route = App.StatusRoute.extend();

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
