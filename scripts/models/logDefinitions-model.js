App.LogsAdapter = DS.RESTDefinitionsAdapter.extend();

App.LogsSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    categories: {embedded: 'always'}
  }
});

App.Logs = DS.Model.extend({
  selectedCategories: function () {
    return this.get('categories').findBy('isSelected');
  }.property('categories'),
  test: false,
  categories: DS.hasMany('logsCategory')
});

App.LogsCategory = DS.Model.extend({
  isSelected: false,
  name: DS.attr('string')
});
