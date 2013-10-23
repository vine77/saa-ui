App.ContextualGraphsController = Ember.ObjectController.extend({
  needs: ['application', 'nodes', 'vms'],
  currentRouteNameBinding: 'controllers.application.currentRouteName',
  selectedNodes: function () {
    return this.get('controllers.nodes').filterProperty('isSelected', true);
  }.property('controllers.nodes.@each.isSelected'),  
  selectedVms: function () {
    return this.get('controllers.vms').filterProperty('isSelected', true);
  }.property('controllers.vms.@each.isSelected'),
  nodePath: function() {
    if (this.get('currentRouteName').indexOf("node") != -1) {
      return true;
    } else {
      return false;
    }
  }.property('currentRouteName'),
  vmPath: function() {
    if (this.get('currentRouteName').indexOf("vm") != -1) {
      return true;
    } else {
      return false;
    }
  }.property('currentRouteName'),
  contextualPath: function () {
    if ((this.get('currentRouteName').indexOf("vm") != -1) || (this.get('currentRouteName').indexOf("node") != -1)) {
      return true;
    } else {
      return false;
    }
  }.property('currentRouteName')
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
