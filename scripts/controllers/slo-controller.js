App.SloController = Ember.ObjectController.extend({
  sloTemplates: function() {
    return this.get('parentController.sloTemplates');
  }.property('parentController.sloTemplates.@each', 'parentController.isAddSloAvailable'),
  possibleSloTemplates: function() {
    return this.get('parentController.possibleSloTemplates');
  }.property('parentController.possibleSloTemplates.@each', 'parentController.isAddSloAvailable'),
  allowedOperatorsGreaterThanOne: function() {
    return (this.get('model.sloTemplate.allowedOperators.length') > 1);
  }.property('model.sloTemplate.allowedOperators'),
  rangeMin: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var min = value || '';
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', min + ';' + range.split(';')[1]);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[0];
    } else {
      return '';
    }
  }.property('value'),
  rangeMax: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var max = value || '';
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', range.split(';')[0] + ';' + max);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[1];
    } else {
      return '';
    }
  }.property('value')
});
