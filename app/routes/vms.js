import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    previousPage: function () {
      var controller = this.controllerFor('vms');
      if (controller.get('isFirstPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') - 1);
    },
    nextPage: function () {
      var controller = this.controllerFor('vms');
      if (controller.get('isLastPage')) return;
      controller.get('listView').goToPage(controller.get('listView.currentPage') + 1);
    }
  }
});
