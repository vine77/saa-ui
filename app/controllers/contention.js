App.ContentionController = Ember.Controller.extend({
  model: function () {
    return this.store.find('node', this.get('content.id'));
  },
  exampleProperty: function () {
    return 'exampleProperty' + this.get('content.id');
  }.property('')
});
