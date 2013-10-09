App.DashboardTodoController = Ember.Controller.extend({
  needs: 'application',
  isConfigured: Ember.computed.alias('controllers.application.isConfigured')
});
