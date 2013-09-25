App.ConnectivityAdapter = DS.RESTSingletonAdapter.extend();

App.Connectivity = DS.Model.extend({
  connected: DS.attr('boolean')
});
