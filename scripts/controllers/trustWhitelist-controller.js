App.TrustWhitelistController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  /*
  columns: ['name', 'version', 'attestationType', 'mleType', 'osInfo', 'oemName', 'description'],
  filteredModel: function () {
    return App.Mle.find();
  }.property('App.Mle.@each'),
  filterProperties: ['name', 'version', 'attestationType', 'mleType', 'osInfo', 'oemName', 'description']
  */
  frameUrl: function () {
    // Mt. Wilson Whitelist Portal
    return 'https://' + window.location.hostname + ':8181/WhiteListPortal/';
  }.property()
});
