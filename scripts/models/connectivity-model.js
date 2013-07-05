App.Store.registerAdapter('App.Connectivity', DS.RESTSingletonAdapter);

App.Connectivity = DS.Model.extend({
  connected: DS.attr('boolean')
});
