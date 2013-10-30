App.SlasColumnsController = App.ColumnsController.extend({
  content: [{
    title: 'SLA Name',
    sortBy: 'name'
  }, {
    title: '# of SLOs',
    sortBy: 'slos.length'
  }, {
    title: 'SLO Types',
    sortBy: 'sloTypes'
  }, {
    title: 'Actions'
  }]
});

App.SlasController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  sortProperty: 'name',
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isExpanded')) {
        this.transitionToRoute('sla', model);
      } else {
        this.transitionToRoute('slas');
      }
    },
    refresh: function () {
      this.store.find('sla');
    }
  }
});
