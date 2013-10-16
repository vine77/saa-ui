App.LogAdapter = DS.RESTDefinitionsAdapter.extend();

App.LogSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    categories: {embedded: 'always'}
  }
});

App.Log = DS.Model.extend({
  categories: DS.hasMany('logCategory')
});

App.LogCategory = DS.Model.extend({
  name: DS.attr('string')
});

