App.DashboardStatusController = Ember.ArrayController.extend({
  needs: ['statuses', 'build', 'nodes', 'vms']
});
