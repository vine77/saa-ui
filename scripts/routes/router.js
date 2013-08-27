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
  });
});

Ember.Route.reopen({
  activate: function () {
    var route = this;
    var currentRoute = this.get('routeName');
    var noauth = ['login', 'profile', 'tempPassword']
    if($.inArray(currentRoute, noauth) == -1)
    {
        if((currentRoute != 'application') && (currentRoute != 'index'))
        {
            var context = this.get('context');
            App.state.set('route', currentRoute);
            App.state.set('context', context);
        }
        
        // Not using 'isLoaded'. On error, the state is reset to 'loaded.saved' (from modelhelper). 
        // Hence isLoaded may be misleading.
        var isLoaded = (App.session) ? !(App.session.get('isLoading') || App.session.get('isDeleted')) : false;
        
        if(!isLoaded) {
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
            App.session = App.Session.find('current_session');
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

// Application
App.ApplicationRoute = Ember.Route.extend({
  events: {
    logout: function() {
        var cleanup = function() {
                location.href = '/';
            };
        App.session.deleteRecord();
        var handlers = {'didDelete' : {postFun:cleanup, nextRoute:'login'}};
        App.modelhelper.doTransaction(App.session, this.controller, this, handlers);
    },
    showModal: function (modalName, controllerName) {
      App.ModalView.create({
        templateName: 'modals/' + modalName,
        controller: this.controllerFor(controllerName)
      }).append();
    }
  }
});

// Index
App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        var route = App.state.get('route');
        var context = App.state.get('context');
        if(context != null)
        {
            this.transitionTo(route, context);
        }
        else
        {
            this.transitionTo(route);
        }
    }
});

// Dashboard
App.DashboardRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    controller.set('model', App.Event.find());
  }
});

App.LoginRoute = Ember.Route.extend({
    events: {
        login: function () {
            this.controller.createSession(this);
        }
    }
});

App.TempPasswordRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        this._super(controller, model);
    },
    events: {
        generate_password: function() {
            this.controller.generatePassword(this);
        }        
    }
});

App.ProfileRoute = Ember.Route.extend({
    model: function(params) {
        return App.User.find(params.user_id);
    },
    setupController: function(controller, model) {
        if(!model.get('isLoaded')) {
            model.on('didLoad', function() {
                    model.off('didLoad');
                    controller.initFields(model);
                });
        }
        else {
            controller.initFields(model);
        }
        
        if(controller.getMailServer)
        {
            var mail_controller = this.controllerFor('settings.mailserver');            
            var mail_server = App.Mailserver.find('default');
            mail_controller.set('model', mail_server);
            mail_server.on('didLoad', function() {
                                    mail_controller.initFields(mail_server);
                                });            
            mail_controller.set('standalone', false);
        }
        this._super(controller, model);
    },
    events: {
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
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      App.TrustNode.find().then(function() {
        if (App.Node.all().get('length') == 0) {
          controller.set('model', App.Node.find());
        } else {
          controller.set('model', App.Node.all());
        }
      });
    } else {
      if (App.Node.all().get('length') == 0) {
        controller.set('model', App.Node.find());
      } else {
        controller.set('model', App.Node.all());
      }
    }
  }
  /*
  model: function () {
    return App.Node.all();
  }
  */
});

App.NodesIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Node.all().setEach('isActive', false);
  }
});
App.NodesNodeRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    model.reload();
    App.Node.all().setEach('isActive', false);
    model.set('isActive', true);
  }
});

// VMs
App.VmsRoute = Ember.Route.extend({
  model: function () {
    if (App.Vm.all().get('length') == 0) {
      return App.Vm.find();
    } else {
      return App.Vm.all();
    }
  }
});
App.VmsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Vm.all().setEach('isActive', false);
  }
});
App.VmsVmRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    model.reload();
    App.Vm.all().setEach('isActive', false);
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
    App.Sla.find();
    return App.Flavor.find().addObjects(App.Flavor.find({sla_aware: true}));
  }
});
App.FlavorsIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Flavor.all().setEach('isActive', false);
  }
});
App.FlavorRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    model.reload();
    App.Flavor.all().setEach('isActive', false);
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
    App.Slo.find();
    return App.Sla.find();
  }
});
App.SlasIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Sla.all().setEach('isActive', false);
  }
});
App.SlaRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Sla.all().setEach('isActive', false);
    model.set('isActive', true);
  }
});

// Catalog
App.CatalogRoute = Ember.Route.extend({
  model: function () {
    return App.Template.find();
  }
});
App.CatalogIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    App.Template.all().setEach('isActive', false);
  }
});
App.TemplateRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    model.reload();
    App.Template.all().setEach('isActive', false);
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
    return App.TrustMle.find();
  }
});

App.TrustMlesIndexRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      App.TrustNode.find().then(function() {
        controller.set('model', App.TrustMle.all());
      });
      App.TrustMle.all().setEach('isActive', false);
    }
  }
});

App.TrustMleRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      model.reload();
      App.TrustMle.all().setEach('isActive', false);
      model.set('isActive', true);
    }
  }
});

// Settings
App.SettingsIndexRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('settings.upload');
  }
});
App.SettingsUsersRoute = Ember.Route.extend({
  model: function()
  {
    return App.users;
  }
});
App.SettingsLogRoute = Ember.Route.extend({
  model: function()
  {
    return App.settingsLog.fetch();
  }
});

App.SettingsMailserverRoute = Ember.Route.extend({
    model: function() {
        return App.Mailserver.find('default');
    },
    setupController: function(controller, model) {
        if(!model.get('isLoaded')) {
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
    events: {
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