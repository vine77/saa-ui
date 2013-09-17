App.TrustWhitelistController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  
  columns: ['mleType', 'name', 'oemname', 'attestationType', 'osname', 'version', 'osversion', 'mleManifests'],
  filteredModel: function () {
    return App.TrustMle.find();
  }.property('App.TrustMle.@each'),
  filterProperties: ['name', 'version', 'attestationType', 'mleType', 'osname', 'oemname'],
  actions: {
    expand: function (model) {
      if (!model.get('isActive')) {
        this.transitionToRoute('trust.whitelist.mle', model);
      } else {
        this.transitionToRoute('trust.whitelist');
      }
    },
    deleteMle: function (mle) {
      //check if any nodes are registered anywhere with this mle ...
      if (mle.get('trustNode.length') > 0) {
        App.event('Failed to delete fingerprint, you must first unregister trust from all of the fingerprint\'s associated nodes.', App.ERROR);
      } else {
        var confirmed = confirm('Are you sure you want to delete this fingerprint?');
        if (confirmed) {
          mle.deleteRecord();
          mle.get('transaction').commit();
        }
      }
    }
  }

  /*
  frameUrl: function () {
    // Mt. Wilson Whitelist Portal
    return 'https://' + window.location.hostname + ':8181/WhiteListPortal/';
  }.property()
  */
});
