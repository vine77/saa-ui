App.SlaController = Ember.ObjectController.extend({
  // Controller Properties
  isExpanded: false,

  // Computed Properties
  sloTypes: function () {
    //return this.get('slos').getEach('sloType').toString();
    return this.get('slos').map(function (item, index, enumerable) {
      if (!item || !item.get('sloType')) return null;
      return item.get('sloType').replace('_', ' ');
    }).join(', ');
  }.property('slos.@each.sloType'),

  // Actions
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
        this.transitionToRoute('sla', model);
      } else {
        this.transitionToRoute('slas');
      }
    }
  }
});

App.SlasSlaController = App.SlaController.extend();
