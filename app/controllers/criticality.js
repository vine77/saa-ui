import Ember from 'ember';
import isCriticalityPlus from '../utils/is-criticality-plus';

export default Ember.ObjectController.extend({
  isSelected: false,
  needs: ["logBar"],
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;
    if (this.get('isSelected') && !isCriticalityPlus(this) && (this.get('id') !== 'context')) {
      this.get('controllers.logBar.kibanaCriticalitiesQuery').push('severity: \"'+this.get('label').toString()+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.criticalities') !== null)?this.get('controllers.logBar.kibanaFieldIds.criticalities'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaCriticalitiesQuery').join(' OR ') + ")"
      }, fieldId);
      this.set('controllers.logBar.kibanaFieldIds.criticalities', newFieldId);
      dashboard.refresh();
    } else {
      var inArray = Ember.$.inArray('severity: \"'+this.get('label').toString()+'\"', this.get('controllers.logBar.kibanaCriticalitiesQuery'));
      if (inArray !== -1) {
        this.get('controllers.logBar.kibanaCriticalitiesQuery').removeAt(inArray);
        var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.criticalities') !== null)?this.get('controllers.logBar.kibanaFieldIds.criticalities'):undefined);
        var newFieldId = filterSrv.set({
          type:'querystring',
          mandate:'must',
          query:"(" + this.get('controllers.logBar.kibanaCriticalitiesQuery').join(' OR ') + ")"
        }, fieldId);
        this.set('controllers.logBar.kibanaFieldIds.criticalities', newFieldId);
        if (this.get('controllers.logBar.kibanaCriticalitiesQuery').length < 1) {
          filterSrv.remove(this.get('controllers.logBar.kibanaFieldIds.criticalities'));
          this.set('controllers.logBar.kibanaFieldIds.criticalities', null);
        }
        dashboard.refresh();
      }
    }
  }.observes('isSelected')
});
