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

App.contextualGraphs = App.ContextualGraphsController.create();
