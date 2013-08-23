App.CurrentSelections = Ember.Object.extend({
  selectedNodes: [],
  selectedVms: [],
  selectedCriticalities: [],
  selectedLogCategories: []
});

App.currentSelections = App.CurrentSelections.create();

