import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor('vms').setEach('isExpanded', false);
    this.controllerFor('vms').findBy('id', model.get('id')).set('isExpanded', true);
  },
  actions: {
    closeDetails: function() {
      this.transitionTo('vms');
    },
    previousPage: function() {
      var controller = this.controllerFor('vms');
      if (this.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
    },
    nextPage: function() {
      var controller = this.controllerFor('vms');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
    }
  }
});
