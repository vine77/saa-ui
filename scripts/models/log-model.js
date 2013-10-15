App.LogAdapter = DS.RESTSingletonDefinitionsAdapter.extend();

App.Log = DS.Model.extend({
  categories: DS.attr()
});
