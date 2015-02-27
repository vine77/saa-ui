App.LogAdapter = DS.RESTDefinitionsAdapter.extend();

App.LogSerializer = App.ApplicationSerializer.extend({
  attrs: {
    categories: {embedded: 'always'}
  }
});

App.Log = DS.Model.extend({
  categories: DS.hasMany('logCategory', { async: true })
});

App.LogCategory = DS.Model.extend({
  name: DS.attr('string')
});

