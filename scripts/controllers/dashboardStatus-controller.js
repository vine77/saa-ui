App.DashboardStatusController = Ember.ArrayController.extend({
  needs: ['application', 'statuses', 'build', 'nodes', 'vms']
});
