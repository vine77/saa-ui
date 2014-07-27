import Ember from 'ember';
import DS from 'ember-data';
import FormController from './form';
import getApiDomain from '../utils/get-api-domain';
import xhrError from '../utils/xhr-error';

export default FormController.extend({
  needs: ['application'],
  init: function() {
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
  tenantType: 'default',
  isDefaultTenant: Ember.computed.equal('tenantType', 'default'),
  tenantName: '',
  setHeaders: function() {
    var csrfToken = this.get('csrfToken');
    //Ember.$.cookie('token', csrfToken);
    Ember.$.ajaxSetup({
      headers: {
        "X-CSRF-Token": csrfToken
      }
    });
    sessionStorage.csrfToken = csrfToken;
  }.observes('csrfToken'),
  refreshSession: function() {
    Ember.run.later(this, 'refreshSession', 120000);  // Refresh every 2 minutes
    if (this.get('loggedIn') && this.get('controllers.application.isAutoRefreshEnabled')) {
      var host = getApiDomain();
      Ember.$.ajax(host + '/api/v2/sessions', {
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
  transitionToAttempted: function() {
    var attemptedTransition = this.get('attemptedTransition');
    if (attemptedTransition) {
      try {
        if (typeof attemptedTransition === 'string') {
          if (attemptedTransition.indexOf('app.data.') === 0) attemptedTransition = attemptedTransition.slice(9);
          if (attemptedTransition.indexOf('app.') === 0) attemptedTransition = attemptedTransition.slice(4);
          this.transitionToRoute(attemptedTransition);
        } else {
          this.get('attemptedTransition').retry();
        }
        this.set('attemptedTransition', null);
      } catch (error) {
        this.transitionToRoute('index');
        this.set('attemptedTransition', null);
      }
    } else {
      this.transitionToRoute('index');
      this.set('attemptedTransition', null);
    }
  },
  actions: {
    clearAlert: function() {
      this.set('alert', '');
    },
    login: function() {
      var self = this;
      this.set('isPending', true);
      this.send('clearAlert');
      //localStorage.loggedIn = true;

      var session = this.store.createRecord('session', {
        username: this.get('username'),
        password: this.get('password'),
        tenant: this.get('isDefaultTenant') ? '' : this.get('tenantName')
      });
      session.save().then(function(session) {
        self.set('csrfToken', session.get('csrfToken'));
        self.set('isPending', false);
        self.set('loggedIn', true);
        self.transitionToAttempted();
      }, function(xhr) {
        self.set('isPending', false);
        if (xhr.status === 422 || xhr instanceof DS.InvalidError) {
          var csrfToken = xhr.errors.message.csrf_token;
          self.set('csrfToken', csrfToken);
          self.transitionToRoute('profile', self.get('username'));
        } else if (xhr.status === 401) {
          self.set('alert', 'The username or password you entered was incorrect. Please try again.');
          self.set('username', '');
          self.set('password', '');
          Ember.$('#login-username').focus();
        } else {
          xhrError(xhr, 'An error occurred while attempting to log in.');
        }
      });
    }
  }
});
