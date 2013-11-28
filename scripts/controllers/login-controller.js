// TODO: Migrate Sunil's authentication code
App.LoginController = App.FormController.extend({
  loggedIn: false,
  username: '',
  password: '',
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
});
