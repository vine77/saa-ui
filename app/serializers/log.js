App.LogSerializer = App.ApplicationSerializer.extend({
  attrs: {
    categories: {embedded: 'always'}
  }
});
