import Ember from 'ember';

export default Ember.ObjectController.extend({
  isSelected: false,
  needs:["logBar"],
  updateKibana: function() {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;

    if (this.get('isSelected')) {
      this.get('controllers.logBar.kibanaLogcategoriesQuery').push('category: \"'+this.get('name').toString()+'\"');
      var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.logcategories') !== null)?this.get('controllers.logBar.kibanaFieldIds.logcategories'):undefined);
      var newFieldId = filterSrv.set({
        type:'querystring',
        mandate:'must',
        query:"(" + this.get('controllers.logBar.kibanaLogcategoriesQuery').join(' OR ') + ")"
      }, fieldId);

      this.set('controllers.logBar.kibanaFieldIds.logcategories', newFieldId);
      dashboard.refresh();
    } else {
      var inArray = Ember.$.inArray('category: \"'+this.get('name').toString()+'\"', this.get('controllers.logBar.kibanaLogcategoriesQuery'));
      if (inArray !== -1) {
        this.get('controllers.logBar.kibanaLogcategoriesQuery').removeAt(inArray);

        var fieldId = ((this.get('controllers.logBar.kibanaFieldIds.logcategories') !== null)?this.get('controllers.logBar.kibanaFieldIds.logcategories'):undefined);
        var newFieldId = filterSrv.set({
          type:'querystring',
          mandate:'must',
          query:"(" + this.get('controllers.logBar.kibanaLogcategoriesQuery').join(' OR ') + ")"
        }, fieldId);
        this.set('controllers.logBar.kibanaFieldIds.logcategories', newFieldId);

        if (this.get('controllers.logBar.kibanaLogcategoriesQuery').length < 1) {
          filterSrv.remove(this.get('controllers.logBar.kibanaFieldIds.logcategories'));
          this.set('controllers.logBar.kibanaFieldIds.logcategories', null);
        }
        dashboard.refresh();
      }
    }

  }.observes('isSelected')
});
