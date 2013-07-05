App.ContextualGraphsView = Ember.View.extend({
  templateName: 'contextualGraphs',
  selectedNode: null,
  selectedVm: null,
  selectedNodeUpdate: function () {
    this.set('selectedNode', App.contextualGraphs.get('selectedNode'));
  }.observes('App.contextualGraphs.selectedNode'),
  selectedVmUpdate: function () {
    this.set('selectedVm', App.contextualGraphs.get('selectedVm'));
  }.observes('App.contextualGraphs.selectedVm')
});
