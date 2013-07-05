App.ContentionController = Ember.Controller.extend({
  model: function () {
    return App.Node.find(this.get('content.id'));
  }.property('App.Node.@each'), 
  exampleProperty: function () {
    return 'exampleProperty' + this.get('content.id');
  }.property('')
});
