App.SloAdapter = DS.RESTConfigAdapter.extend();

App.Slo = DS.Model.extend({
  // Full relationships
  sla: DS.belongsTo('sla'),

  // Properties from API
  className: DS.attr('string'),
  description: DS.attr('string'),
  elementName: DS.attr('string'),
  operator: DS.attr('string'),
  sloType: DS.attr('string'),
  unit: DS.attr('string'),
  value: DS.attr('string'),

  // Computed properties
  /*
  description: function () {
    var description = [];
    if (this.get('sloType')) description.push(this.get('sloType').replace('_', ' ') + ': ');
    if (this.get('operator')) description.push(this.get('operator').replace('_', ' '));
    if (this.get('value')) description.push(this.get('value').replace(';', '-'));
    if (this.get('unit')) description.push(this.get('unit'));
    return description.join(' ');
  }.property('sloType', 'operator', 'value', 'unit')
  */
});
