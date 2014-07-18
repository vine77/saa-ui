import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor('nodes').setEach('isExpanded', false);
    this.controllerFor('nodes').findBy('id', model.get('id')).set('isExpanded', true);
  },
  actions: {
    closeDetails: function() {
      this.transitionTo('nodes');
    },
    previousPage: function() {
      var controller = this.controllerFor('nodes');
      if (this.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
      this.transitionTo('nodes');
    },
    nextPage: function() {
      var controller = this.controllerFor('nodes');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
      this.transitionTo('nodes');
    }
  }
});
