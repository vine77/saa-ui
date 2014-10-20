// Application
App.ApplicationRoute = Ember.Route.extend({
  init: function () {
    App.store = this.store;
    App.route = this;
  },
  beforeModel: function () {
    if (!Modernizr.csstransitions) {
      this.transitionTo('blocked');
    }
  },
  model: function () {
    var self = this;
    return this.controllerFor('statuses').updateCurrentStatus().then(null, function () {
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
      this.controllerFor('login').set('loggedIn', false);
      this.send('redirectToLogin');
      var session = this.controllerFor('login').get('session');
      if (session) {
        session.deleteRecord();
        session.save().then(function () {
          self.removeCookies();
        }, function () {
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

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('dashboard');
  }
});

App.LoginRoute = Ember.Route.extend({
  beforeModel: function () {
    var loggedIn = this.controllerFor('application').get('loggedIn');
    if (loggedIn) this.transitionTo('index');
  },
  setupController: function(controller, model) {
    controller.set('username', '');
    controller.set('password', '');
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
    if (sessionStorage.csrfToken) {
      this.controllerFor('login').set('csrfToken', sessionStorage.csrfToken);
      this.controllerFor('login').set('loggedIn', true);
    }
    var loggedIn = this.controllerFor('login').get('loggedIn');
    if (!loggedIn) {
      transition.send('redirectToLogin', transition);
    }
  },
  model: function () {
    window.store = this.store;
    var self = this;
    // Get current session
    if (this.store.getById('session', 'current_session')) {
      this.store.getById('session', 'current_session').transitionTo('loaded.saved');
      this.store.getById('session', 'current_session').unloadRecord();
    }
    return this.store.find('session', 'current_session').then(function (session) {
      self.controllerFor('login').set('session', session);
      self.controllerFor('login').set('csrfToken', session.get('csrfToken'));
      self.controllerFor('login').set('username', session.get('username'));
    }).then(function () {
      // Update link for OpenStack Horizon (must occur after authentication)
      var baseUrl = self.controllerFor('application').get('baseUrl');
      Ember.$.ajax(baseUrl + '/horizon', {type: 'HEAD'}).then(function () {
        self.controllerFor('application').set('isHorizonAvailable', true);
      }, function () {
        Ember.$.ajax(baseUrl + '/dashboard', {type: 'HEAD'}).then(function () {
          self.controllerFor('application').set('isHorizonAvailable', true);
          self.controllerFor('application').set('horizonUrl', baseUrl + '/dashboard');
        }, function () {
          self.controllerFor('application').set('isHorizonAvailable', false);
        });
      });
      // Call config and other APIs
      return Ember.RSVP.hash({
        nova: App.nova.check(),
        openrc: App.openrc.check(),
        quantum: App.quantum.check(),
        keystone: App.keystone.check()
      }).then(function () {
        // SAA is configured
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
        // SAA is not configured
        App.network.check();
        //self.store.find('user');
        return new Ember.RSVP.resolve();  // Don't block loading if SAA is not configured
      });
    });
  },
  actions: {
    error: function (reason, transition) {
      if (reason.status === 401) {
        App.log(reason.status + ' error caught by router.', reason);
        App.notify('Please log back in', App.ERROR, 'Unauthorized');
        transition.send('redirectToLogin', transition);
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
App.NodesRoute = Ember.Route.extend({
  actions: {
    previousPage: function () {
      var controller = this.controllerFor('nodes');
      if (controller.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
    },
    nextPage: function () {
      var controller = this.controllerFor('nodes');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
    }
  }
});
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
    },
    previousPage: function () {
      var controller = this.controllerFor('nodes');
      if (this.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
      this.transitionTo('nodes');
    },
    nextPage: function () {
      var controller = this.controllerFor('nodes');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
      this.transitionTo('nodes');
    }
  }
});

// VMs
App.VmsRoute = Ember.Route.extend({
  actions: {
    previousPage: function () {
      var controller = this.controllerFor('vms');
      if (controller.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
    },
    nextPage: function () {
      var controller = this.controllerFor('vms');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
    }
  }
});
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
    },
    previousPage: function () {
      var controller = this.controllerFor('vms');
      if (this.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
    },
    nextPage: function () {
      var controller = this.controllerFor('vms');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
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
    var flavor = this.get('currentModel');
    var sla = this.store.all('sla').findBy('isDirty');
    flavor.rollback();
    if (sla) sla.set('deleted', true);
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
  setupController: function (controller, model) {
    this._super(controller, model);
    model.set('isEditing', true);
  },
  deactivate: function () {
    var flavor = this.get('currentModel');
    var sla = this.store.all('sla').findBy('isDirty');
    flavor.set('isEditing', false);
    flavor.rollback();  // Rollback record properties
    flavor.reload();  // Reload record relationships
    if (sla) sla.set('deleted', true);
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
    var sla = this.get('currentModel');
    sla.set('deleted', true);
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
  setupController: function (controller, model) {
    this._super(controller, model);
    model.set('isEditing', true);
  },
  deactivate: function () {
    var sla = this.get('currentModel');
    sla.set('isEditing', false);
    sla.set('deleted', true);
    // Reload record relationships, then rollback relationships
    sla.reload().then(function (model) {
      model.relatedRecords().forEach(function (item) {
        item.rollback();
      });
    });
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
    var availableSettings = [];
    if (!this.controllerFor('build').get('isReadycloud')) {
      availableSettings.push('settings.upload');
      availableSettings.push('settings.network');
    }
    if (!this.controllerFor('application').get('isFramed')) {
      availableSettings.push('settings.users');
      availableSettings.push('settings.mailserver');
    }
    if (this.controllerFor('application').get('isConfigured')) {
      availableSettings.push('settings.log');
      availableSettings.push('settings.trust');
    }
    if (!this.controllerFor('application').get('isFramed')) {
      availableSettings.push('settings.controller');
    }
    if (!Ember.isEmpty(availableSettings)) this.transitionTo(availableSettings[0]);
  }
});
App.SettingsUploadRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('networkType', this.store.find('networkType', 'current'));
  },
  deactivate: function () {
    this.controllerFor('settingsUpload').send('cancel');
  }
});
App.SettingsNetworkRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('networkType', this.store.find('networkType', 'current'));
  }
});
App.SettingsMailserverRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('mailserver', 'default');
  }
});
App.SettingsLogRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('logSetting', 'current');
  }
});
App.SettingsUsersRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('user');
  }
});
App.SettingsUserRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});
App.SettingsControllerRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
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
