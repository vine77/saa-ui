App.TrustWhitelistPortalController = Ember.Controller.extend({
  frameUrl: function () {
  	// Mt. Wilson Whitelist Portal
  	return 'https://' + window.location.hostname + ':8181/WhiteListPortal/';
  }.property()
});
