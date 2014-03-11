App.LogBarView = Ember.View.extend({
  templateName: 'logBar-view',
  didInsertElement: function() {
    var self = this;
    setTimeout( function() {
      self.get('controller').set('criticalitySelected', self.get('controller.controllers.criticalities').objectAt(4));
    }, 10000);
  }
});
