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
    sessionStorage.csrfToken = csrfToken;
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
    clearAlert: function () {
      this.set('alert', '');
    },
    login: function () {
      var self = this;
      this.set('isPending', true);
      this.send('clearAlert');
      //localStorage.loggedIn = true;

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
    }
  }
});
