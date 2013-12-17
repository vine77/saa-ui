App.LoginController = App.FormController.extend({
  needs: ['application'],
  init: function () {
    this._super();
    this.refreshSession();
  },
  loggedIn: false,
  username: '',
  password: '',
  csrfToken: null,
  alert: '',
  isPending: false,
  session: null,
  setHeaders: function () {
    var csrfToken = this.get('csrfToken');
    //Ember.$.cookie('token', csrfToken);
    Ember.$.ajaxSetup({
      headers: {
        "X-CSRF-Token": csrfToken
      }
    });
  }.observes('csrfToken'),
  refreshSession: function () {
    Ember.run.later(this, 'refreshSession', 120000);  // Refresh every 2 minutes
    if (this.get('loggedIn') && this.get('controllers.application.isAutoRefreshEnabled')) {
      var host = (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain;
      Ember.$.ajax(host + '/api/v1/sessions', {
        type: 'POST',
        data: JSON.stringify({
          session: {
            request: "refresh_ticket"
          }
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
    }
  },
  transitionToAttempted: function () {
    var attemptedTransition = this.get('attemptedTransition');
    if (attemptedTransition) {
      if (typeof attemptedTransition === 'string') {
        this.transitionToRoute(attemptedTransition);
      } else {
        this.get('attemptedTransition').retry();
      }
      this.set('attemptedTransition', null);
    } else {
      this.transitionToRoute('index');
    }
  },
  actions: {
    clearAlert: function () {
      this.set('alert', '');
    },
    login: function () {
      var self = this;
      this.set('isPending', true);
      this.send('clearAlert');
      //localStorage.loggedIn = true;
      //this.controllerFor('application').set('loggedIn', true);

      var session = this.store.createRecord('session', {
        username: this.get('username'),
        password: this.get('password')
      });
      session.save().then(function (session) {
        self.set('csrfToken', session.get('csrfToken'));
        self.set('isPending', false);
        self.set('loggedIn', true);
        self.transitionToAttempted();
      }).fail(function (xhr) {
        self.set('isPending', false);
        if (xhr instanceof DS.InvalidError) {  // status == 422
          var csrfToken = xhr.errors.message.csrf_token;
          var setProfile = xhr.errors.message.set_profile;
          self.set('csrfToken', csrfToken);
          self.transitionToRoute('profile', self.get('username'));
        } else if (xhr.status === 401) {
          self.set('alert', 'The username or password you entered was incorrect. Please try again.');
          self.set('username', '');
          self.set('password', '');
          $('#login-username').focus();
        } else {
          App.xhrError(xhr, 'An error occurred while attempting to log in.');
        }
      });

      /*
      var host = (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain;
      return Ember.$.ajax(host + '/api/v1/sessions', {
        type: 'POST',
        data: JSON.stringify({
          session: {
            username: this.get('username'),
            password: this.get('password')
          }
        }),
        contentType: 'application/json',
        dataType: 'json'
      }).then(function (data) {
        self.set('isPending', false);
        self.set('loggedIn', true);
        this.transitionToAttempted();
      }).fail(function (xhr) {
        self.set('isPending', false);
        if (xhr.status === 401) {
          self.set('alert', 'The username or password you entered was incorrect. Please try again.');
        } else if (xhr.status === 422) {
          var csrfToken = JSON.parse(xhr.responseText).errors.message.csrf_token;
          var setProfile = JSON.parse(xhr.responseText).errors.message.set_profile;
          self.set('csrfToken', csrfToken);
          self.send('setHeaders', csrfToken);
          self.transitionToRoute('profile', self.get('username'));
        } else {
          App.xhrError(xhr, 'An error occurred while attempting to log in.');
        }
      });
      */
    }
  }

  // TODO: Migrate Sunil's authentication code
  /*
  id: '#login',
  validated_fields: ['username', 'password'],
  fieldname: {
    username: 'user name',
    password: 'password'
  },
  errorString: function(error) {
    var errorTbl = {
      'unauthorized.' : 'Invalid username and password.',
      'internal server error.' : 'An internal error occured.',
    };
    var key = error.toLowerCase();
    if( typeof(errorTbl[key]) != 'undefined' ) {
      return errorTbl[key];
    }
    else {
      return error;
    }
  },
  createSession: function(route) {
    var controller = this;
    var record = {'username': controller.get('username'), 'password': controller.get('password')};
    if (controller.prepare_commit(record)) {
      controller.set('password', '');
      var updateUI = function(message) {
        return function(model, controller, route, error_args) {
          var error = error_args[0].error;
          if (typeof(error) != 'undefined') {
            message = message + ' ' + controller.errorString(error);
          }
          controller.showNotification(message);
          controller.reset_form();
        }
      };
      var getUserProfile = function(model, controller, route, error_args) {
        var username = controller.get('username');
        var user = this.store.find('user', username);
        var error = JSON.parse(error_args[0].error);
        route.controllerFor('profile').set('redirectOnSave', 'login');
        if (error.set_profile) {
          route.controllerFor('profile').showNotification('Please enter profile information.');
          route.controllerFor('profile').set('getMailServer', true);
          route.controllerFor('profile').set('getEmail', true);
        } else {
          route.controllerFor('profile').showNotification('Please change the password.');
          route.controllerFor('profile').set('getMailServer', false);
          route.controllerFor('profile').set('getEmail', false);
        }
        if (user.get('isLoaded')) {
          route.controllerFor('profile').initFields(user);
        } else {
          user.on('didLoad', function() {
            route.controllerFor('profile').initFields(user);
          });
        }
        route.transitionTo('profile', user);
      };
      var session = this.store.createRecord('session', record);
      var handlers = {
        'didCreate' : {postFun:updateUI(''), nextRoute:'index'},
        'becameError' : {postFun:updateUI('Login Failed.'), resetState:true},
        'becameInvalid' : {postFun:getUserProfile}
      };
      App.modelhelper.doTransaction(session, controller, route, handlers);
    }
  }
  */
});
