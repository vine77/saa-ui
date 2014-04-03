App.LogBarView = Ember.View.extend({
  templateName: 'logBar-view',
  timeFieldId: null,
  didInsertElement: function() {
    var self = this;
    setTimeout( function() {
      Ember.run(function(){
        self.get('controller').set('criticalitySelected', self.get('controller.controllers.criticalities').objectAt(4));
      });
    }, 10000);
  }
});
