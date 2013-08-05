App.Router.map(function () {
  this.resource('login');
  this.resource('profile');
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

// Application
App.ApplicationRoute = Ember.Route.extend({
  initData: function() {
    // Load data from APIs
    App.mtWilson.check().then(function() {
      // Load data from APIs
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

    //Workaround: This call returns error 410 - ignored
    //App.mtWilson.check();
    App.users = App.User.find();
    var promises = [App.nova.check(), App.openrc.check(), App.network.check(), App.build.find(), App.mailserver.check(), App.users];
    return Ember.RSVP.all(promises);
  },
  redirect: function () {
    // Sunil: TODO: Remember Me
    var router = this;
    if (App.session) {
      App.session.reload();
      App.session.on('didReload', function () {
        App.login.set('loggedIn', true);
        router.initData().then(function () {
          router.transitionTo('index');
        }, function () {
          router.transitionTo('index');
        });
      });
      App.session.get('transaction').commit();
    } else {
      App.session = App.Session.find('current_session');
      App.session.on('didLoad', function () {
        App.login.set('loggedIn', true);
        router.initData().then(function () {
          router.transitionTo('index');
        }, function () {
          router.transitionTo('index');
        });
      });
      App.session.on('becameError', function () {
        // Reload doesn't happen if the data is in error state. This is to enable reload.
        this.get('stateManager').transitionTo('loaded.saved');
        router.transitionTo('login');
      });
      App.session.get('transaction').commit();
    }

  },
  events: {
    login: function () {
      if (!$('#username').val()) {
        $('#username').tooltip({
          title: 'Please enter a username.',
          placement: 'right',
          trigger: 'manual'
        }).tooltip('show');
        return false;
      } else if (!$('#password').val()) {
        $('#password').tooltip({
          title: 'Please enter a password.',
          placement: 'right',
          trigger: 'manual'
        }).tooltip('show');
        return false;
      } else {
        var router = this;
        router.controllerFor('login').setDisable(true);
        var redirectPage = function () { 
          router.redirect();
        }
        var username = App.login.get('username');
        var password = App.login.get('password');
        App.login.set('password', '');
        var session = App.Session.createRecord({"username": username, "password": password});
        session.on('didCreate', redirectPage);
        session.on('becameInvalid', function (error) {
          router.controllerFor('login').setDisable(false);
          ret = JSON.parse(error.error)
          if(ret.set_profile)
          {
            App.login.set('editProfile', true);
            if(ret.mail_server)
                App.login.set('configMailServer', true);
            App.login.set('retPath', 'login');
            router.transitionTo('profile')
            router.controllerFor('profile').showNotification('Please enter the profile information.');
            $('#profile-notification').show();            
          }
          else if (ret.change_password)
          {
            App.login.set('changingPassword', true);
            App.login.set('retPath', '');
            router.controllerFor('login').showNotification('Please change the password');
          }
        });
        session.on('becameError', function () {
          router.controllerFor('login').setDisable(false);
          router.controllerFor('login').showNotification('Invalid Credentials');
          this.get('stateManager').transitionTo('loaded.saved');
        });
        session.get('transaction').commit();
      }
    },
    logout: function () {
      var router = this;
      App.session.deleteRecord();
      App.session.on('didDelete', function () {
        App.login.set('loggedIn', false);
        router.transitionTo('login');
        location.reload();  // Refresh page for full teardown
      });
      App.session.get('transaction').commit();
    },
    changePassword: function () {
      var router = this;
      var isValid = true;
      var fields = ['#username', '#old_password', '#new_password_1', '#new_password_2'];
      var types = ['username', 'password', 'password', 'password'];
      for (var i=0; i < fields.length; i++) {
        if (!$(fields[i]).val()) {
          $(fields[i]).tooltip({
            title: 'Please enter a ' + types[i] + '.',
            placement: 'right',
            trigger: 'manual'
          }).tooltip('show');
          isValid = false;
        }
      }
      if (!isValid) return;
      var username = App.login.get('username');
      var old_password = App.login.get('oldPassword');
      var new_password = App.login.get('newPassword1');
      var new_password_2 = App.login.get('newPassword2');
      App.login.set('oldPassword', '');
      App.login.set('newPassword1', '');
      App.login.set('newPassword2', '');
      if (new_password != new_password_2) {
        router.controllerFor('login').showNotification("Passwords don't match");
        return;
      }

      router.controllerFor('login').setDisable(true);
      var user = App.User.find(username);

      var changePassword = function () {
        user.set('oldPassword', old_password);
        user.set('newPassword', new_password);
        user.on('didUpdate', function () {
          App.login.set('changingPassword', false);
          router.controllerFor('login').showNotification("Password changed successfully");
          router.controllerFor('login').setDisable(false);
          if(App.login.get('retPath') != '') {
            router.transitionTo(App.login.get('retPath'));
          }
          user.reload();
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.on('becameError', function () {
          router.controllerFor('login').showNotification("Unable to change the password");
          router.controllerFor('login').setDisable(false);
          this.get('stateManager').transitionTo('loaded.saved');
          this.reload();          
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.get('transaction').commit();
      };

      if (user.get('isLoaded')) {
        changePassword();
      } else {
        user.on('didLoad', changePassword);
        user.on('becameError', function () {
          router.controllerFor('login').showNotification("Unable to change the password");
          router.controllerFor('login').setDisable(false);
          this.get('stateManager').transitionTo('loaded.saved');
          this.reload();          
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.get('transaction').commit();
      }
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
  redirect: function () {
    this.transitionTo('dashboard');
  }
});

// Dashboard
App.DashboardRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    controller.set('model', App.Event.find());
  }
});

// Nodes
App.NodesRoute = Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    if (App.mtWilson.get('isInstalled') === true) {
      App.TrustNode.find().then(function() {
        controller.set('model', App.Node.all());
      });
    } else {
      controller.set('model', App.Node.all());
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
    return App.Vm.all();
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
