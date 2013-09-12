App.Store.registerAdapter('App.Logs', DS.RESTDefinitionsAdapter);

DS.RESTDefinitionsAdapter.map('App.Logs', {
  categories: {embedded: 'always'}
});

App.Logs = DS.Model.extend({
  selectedCategories: function () {
    return this.get('categories').findBy('isSelected');
  }.property('categories'),
  test: false,
  categories: DS.hasMany('App.LogsCategory')
});

App.LogsCategory = DS.Model.extend({
  isSelected: false,
  name: DS.attr('string')
});





