App.ListView = Ember.ListView.extend({
  height: 300,
  rowHeight: 34,
  controllerName: function () {
    var name = this.get('controller').constructor.toString().split('.')[1];
    if (name.indexOf('Controller') === -1) throw new Error('Name of controller must end with "Controller"');
    return name.slice(0, name.indexOf('Controller')).toLowerCase();
  }.property(),
  itemViewClass: function () {
    return Ember.ListItemView.extend({templateName: this.get('controllerName') + 'Row'})
  }.property('controllerName'),
  adjustLayout: function() {
    this.set('height', this.get('controller.controllers.application.height') - 177);
  }.observes('controller.controllers.application.height'),
  didInsertElement: function () {
    this._super();
    this.adjustLayout();
  }
});
