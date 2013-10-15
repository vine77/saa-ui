App.LogAdapter = DS.RESTSingletonDefinitionsAdapter.extend();
App.LogSerializer = DS.RESTSingletonSerializer.extend();

App.Log = DS.Model.extend({
  categories: DS.attr()
});
