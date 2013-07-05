App.TrustManagementController = Ember.Controller.extend({
  frameUrl: function () {
  	// Mt. Wilson Management Console
  	return 'https://' + window.location.hostname + ':8181/ManagementConsole/';
  }.property()
});
