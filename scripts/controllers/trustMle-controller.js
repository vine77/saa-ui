App.TrustMleController = Ember.ObjectController.extend({
  isSelected: false,
  isExpanded: false,
  actions: {
    expand: function (model) {
      if (!this.get('isExpanded')) {
        this.transitionToRoute('trust.mle', model);
      } else {
        this.transitionToRoute('trust.mles');
      }
    }
  }
});
