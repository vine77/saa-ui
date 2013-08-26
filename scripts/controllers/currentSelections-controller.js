App.CurrentSelections = Ember.Object.extend({
  selectedNodes: [],
  selectedVms: [],
  selectedCriticalities: [],
  selectedLogCategories: [],
  resetSelection: function(property) {
    //proceed to trigger inside iteration the observer of the underlying model
    //console.log('this.get('+property+')', this.get(property));
    //console.log('this.get('+property+').length', this.get(property).length);

    while (this.get(property).length > 0) {
      this.get(property).setEach('isSelected', false);
    }

    /*
    this.get(property).forEach( function (item, index, enumerable) {
    //this.get('selectedNodes').forEach( function (item, index, enumerable) {
        console.log('item: ', item);
        //console.log('length', context.get(property).length);
      //if (item.get('isSelected')) {
        item.set('isSelected', false);
      //}
    });
    */
  }
});

App.currentSelections = App.CurrentSelections.create();

