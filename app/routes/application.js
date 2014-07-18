import Ember from 'ember';

export default Ember.Route.extend({
  init: function() {
    App.store = this.store;
    App.route = this;
  },
  beforeModel: function() {
    if (!Modernizr.csstransitions) {
      this.transitionTo('blocked');
    }
  },
  model: function() {
    var self = this;
    return this.controllerFor('statuses').updateCurrentStatus().then(null, function() {
      // Status API is not responding
      var confirmed = confirm('The Status API is not responding. Would you like to try to load the application again?');
      if (confirmed) {
        location.reload();
      }
      return new Ember.RSVP.reject();  // Block loading if Status API fails
    });
  },
  setupController: function(controller, model) {
    // Set models for these controllers on app load (instead of waiting for route transitions)
    this.controllerFor('slas').set('model', this.store.filter('sla', function(sla) {
      return !sla.get('deleted');
    }));
    this.controllerFor('flavors').set('model', this.store.all('flavor'), function(flavor) {
      return !flavor.get('deleted');
    });
    this.controllerFor('vms').set('model', this.store.all('vm'));
    this.controllerFor('nodes').set('model', this.store.all('node'));
  },
  removeCookies: function() {
    Ember.$.removeCookie('auth_pubtkt');
    Ember.$.removeCookie('csrftoken');
    Ember.$.removeCookie('samwebsession');
  },
  actions: {
    redirectToLogin: function(transition) {
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
        session.save().then(function() {
          self.removeCookies();
        }, function() {
          self.removeCookies();
        });
      } else {
        this.removeCookies();
      }
    },
    showModal: function(modalName, controllerName) {
      App.ModalView.create({
        templateName: 'modals/' + modalName,
        controller: this.controllerFor(controllerName)
      }).append();
    },
    error: function() {
      console.log('ApplicationRoute error');
    }
  }
});
