App.TrustDashboardController = Ember.Controller.extend({
  frameUrl: function () {
  	// Mt. Wilson Trust Dashboard
  	return 'https://' + window.location.hostname + ':8181/TrustDashBoard/';
  }.property()
});
