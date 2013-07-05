App.VmsView = Ember.View.extend({
    vmCheckbox: Ember.Checkbox.extend({
        checkedObserver: (function(){
            if(this.get('checked')) {
              App.currentSelections.get('selectedVms').addObject(this.get('vm'));
              //App.logBar.get('selectedVms').addObject(this.get('vm'));
              //App.contextualGraphs.get('selectedVms').addObject(this.get('vm'));
            } else {
              App.currentSelections.get('selectedVms').removeObject(this.get('vm'));
              //App.logBar.get('selectedVms').removeObject(this.get('vm'));
              //App.contextualGraphs.get('selectedVms').removeObject(this.get('vm'));
            }
            //App.logBar.propertyDidChange('selectedVms');
            App.contextualGraphs.propertyDidChange('selectedVms');
        }).observes('checked')
    })
});