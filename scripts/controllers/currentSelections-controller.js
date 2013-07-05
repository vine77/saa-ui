App.CurrentSelections = Ember.Object.extend({
  selectedNodes: [],
  selectedVms: []
});

App.currentSelections = App.CurrentSelections.create();
