App.CriticalityController = Ember.ObjectController.extend({
  isSelected: false,
  kibanaId: null,
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    
    if (this.get('isSelected') && !App.isCriticalityPlus(this) && (this.get('id') !== 'context') ) {
      this.set('kibanaId', filterSrv.set({type:'field',mandate:'either', field: "severity", query:JSON.stringify(this.get('label'))}));
      dashboard.refresh();
    } else {
      filterSrv.remove(this.get('kibanaId'));
      dashboard.refresh();
    }
  }.observes('isSelected')
});