App.CurrentSelections = Ember.Object.extend({
  selectedNodes: [],
  selectedVms: [],
  selectedCriticalities: []
});

App.currentSelections = App.CurrentSelections.create();

