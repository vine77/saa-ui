App.ContextualGraphsController = Ember.ObjectController.extend({
  //selectedNodes: [],
  //selectedVms: [],
  //selectedNodesBinding: 'App.currentSelections.selectedNodes',
  //selectedVmsBinding: 'App.currentSelections.selectedVms',
  selectedNodes: function(){
    return App.currentSelections.get('selectedNodes');
  }.property('App.currentSelections.selectedNodes'),
  selectedVms: function() {
    return App.currentSelections.get('selectedVms');
  }.property('App.currentSelections.selectedVms'),
  selectedNode: function () {
    return this.get('selectedNodes.firstObject');
  }.property('selectedNodes'),
  selectedVm: function () {
    return this.get('selectedVms.firstObject');
  }.property('selectedVms'),
  nodePath: function() {
    if (App.get('currentPath') == 'nodes.index') {
      return true;
    } else {
      return false;
    }
  }.property('App.currentPath'),
  vmPath: function() {
    if (App.get('currentPath') == 'vms.index') {
      return true;
    } else {
      return false;
    }
  }.property('App.currentPath'),
  contextualPath: function () {
    if (App.get('currentPath') == 'vms.index' || App.get('currentPath') == 'nodes.index') {
      return true;
    } else {
      return false;
    }
  }.property('App.currentPath')
});

// TODO: contextual graphs used to be updated on a timer interval in the App.application model
/*
if (App.contextualGraphs.get('selectedNode')) {
  App.graphs.graph(App.contextualGraphs.get('selectedNode.id'), App.contextualGraphs.get('selectedNode.name'), 'node');
}
if (App.contextualGraphs.get('selectedNode')) {
  App.graphs.graph(App.contextualGraphs.get('selectedVm.id'), App.contextualGraphs.get('selectedVm.name'), 'vm');
}
*/

App.contextualGraphs = App.ContextualGraphsController.create();
