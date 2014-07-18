import Ember from 'ember';

// Routes under /app require authentication
export default Ember.Route.extend({
  beforeModel: function(transition) {
    if (sessionStorage.csrfToken) {
      this.controllerFor('login').set('csrfToken', sessionStorage.csrfToken);
      this.controllerFor('login').set('loggedIn', true);
    }
    var loggedIn = this.controllerFor('login').get('loggedIn');
    if (!loggedIn) {
      transition.send('redirectToLogin', transition);
    }
  },
  model: function() {
    window.store = this.store;
    var self = this;
    // Get current session
    if (this.store.getById('session', 'current_session')) {
      this.store.getById('session', 'current_session').transitionTo('loaded.saved');
      this.store.getById('session', 'current_session').unloadRecord();
    }
    return this.store.find('session', 'current_session').then(function(session) {
      self.controllerFor('login').set('session', session);
      self.controllerFor('login').set('csrfToken', session.get('csrfToken'));
      self.controllerFor('login').set('username', session.get('username'));
    }).then(function() {
      // Update link for OpenStack Horizon (must occur after authentication)
      var baseUrl = self.controllerFor('application').get('baseUrl');
      Ember.$.ajax(baseUrl + '/horizon', {type: 'HEAD'}).then(function() {
        self.controllerFor('application').set('isHorizonAvailable', true);
      }, function() {
        Ember.$.ajax(baseUrl + '/dashboard', {type: 'HEAD'}).then(function() {
          self.controllerFor('application').set('isHorizonAvailable', true);
          self.controllerFor('application').set('horizonUrl', baseUrl + '/dashboard');
        }, function() {
          self.controllerFor('application').set('isHorizonAvailable', false);
        });
      });
      // Call config and other APIs
      return Ember.RSVP.hash({
        nova: App.nova.check(),
        openrc: App.openrc.check(),
        quantum: App.quantum.check(),
        keystone: App.keystone.check()
      }).then(function() {
        // SAA is configured
        self.store.find('sloTemplate');
        self.store.find('slo');
        self.store.find('sla');
        self.store.find('flavor');
        self.store.find('vm');
        App.mtWilson.check().then(function() {
          if (App.mtWilson.get('isInstalled')) {
            self.store.find('trustMle');
            self.store.find('trustNode');
            self.store.find('node');
          } else {
            self.store.find('node');
          }
        }, function() {
          self.store.find('node');
        }),
        App.network.check();
        self.store.find('action');
        //self.store.find('user');
        //App.settingsLog.fetch();
      }, function() {
        // SAA is not configured
        App.network.check();
        //self.store.find('user');
        return new Ember.RSVP.resolve();  // Don't block loading if SAA is not configured
      });
    });
  },
  actions: {
    error: function(reason, transition) {
      if (reason.status === 401) {
        App.log(reason.status + ' error caught by router.', reason);
        App.notify('Please log back in', App.ERROR, 'Unauthorized');
        transition.send('redirectToLogin', transition);
      }
    }
  }
});
