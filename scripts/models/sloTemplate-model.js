App.SloTemplateAdapter = DS.RESTConfigAdapter.extend();

App.SloTemplateSerializer = App.ApplicationSerializer.extend({
  normalize: function(type, hash, property) {
    // Force operators to be an array
    if (!Ember.isArray(hash.operators)) {
      hash.operators = [hash.operators];
    }
    // Force allowed_operators to be an array
    if (!Ember.isArray(hash.allowed_operators)) {
      hash.allowed_operators = [hash.allowed_operators];
    }
    return this._super(type, hash, property);
  },
});

App.SloTemplate = DS.Model.extend({
  //allowedOperators: DS.attr(),  // Array of strings
  className: DS.attr('string'),
  description: DS.attr('string'),
  deleted: DS.attr('boolean'),
  operators: DS.attr(),  // Array of {operator: "", description: ""}
  valueType: DS.attr('string'),
  elementName: DS.attr('string'),  // "vm", "application", "os"
  unit: DS.attr('string'),
  sloType: DS.attr('string'),

  // Computed properties
  readableSloType: function () {
    return App.humanize(this.get('sloType'));
  }.property('sloType'),
  doesNotHaveMultipleOperators: function () {
    return this.get('allowedOperators.length') < 2;
  }.property('allowedOperators'),
  allowedOperators: function () {
    return (this.get('operators')) ? this.get('operators').mapBy('operator') : [];
  }.property('operators.@each')
});
