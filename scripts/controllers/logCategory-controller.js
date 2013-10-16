App.LogcategoryController = Ember.ObjectController.extend({
  isSelected: false,
  kibanaId: null,
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    
    if (this.get('isSelected')) {
      this.set('kibanaId', filterSrv.set({type:'field',mandate:'either', field: "category", query:JSON.stringify(this.get('name'))}));
      dashboard.refresh();
    } else {
      filterSrv.remove(this.get('kibanaId'));
      dashboard.refresh();
    }
  }.observes('isSelected')
});