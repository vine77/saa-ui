App.NodesView = Ember.View.extend({
    nodeCheckbox: Ember.Checkbox.extend({
        checkedObserver: (function(){
            if(this.get('checked')) {
                if (this.get('node.samControlled')) {
                  App.currentSelections.get('selectedNodes').addObject(this.get('node'));
                  //App.logBar.get('selectedNodes').addObject(this.get('node'));
                  //App.contextualGraphs.get('selectedNodes').addObject(this.get('node'));
                }
            } else {
              App.currentSelections.get('selectedNodes').removeObject(this.get('node'));
              //App.logBar.get('selectedNodes').removeObject(this.get('node'));
              //App.contextualGraphs.get('selectedNodes').removeObject(this.get('node'));
            }
            App.contextualGraphs.propertyDidChange('selectedNodes');
            //Note: Until multiple render approach can be used in _drawer.hbs, contextualGraphs must be notified of property change.
        }).observes('checked')
    })
});