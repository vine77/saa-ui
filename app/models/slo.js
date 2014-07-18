import DS from 'ember-data';

export default DS.Model.extend({
  // Editable properties
  operator: DS.attr('string'),
  value: DS.attr('string'),

  // Uneditable properties
  deleted: DS.attr('boolean'),
  description: DS.attr('string'),
  version: DS.attr('number'),

  // Alias properties inherited from associated sloTemplate
  className: Ember.computed.alias('sloTemplate.className'),
  elementName: Ember.computed.alias('sloTemplate.elementName'),
  sloType: Ember.computed.alias('sloTemplate.sloType'),
  unit: Ember.computed.alias('sloTemplate.unit'),
  valueType: Ember.computed.alias('sloTemplate.valueType'),

  // Computed properties
  isInteger: Ember.computed.equal('valueType', 'integer'),
  isBoolean: Ember.computed.equal('valueType', 'boolean'),
  isRange: Ember.computed.equal('valueType', 'range'),

  // Observers
  sloTemplateObserver: function() {
    this.set('operator', this.get('sloTemplate.allowedOperators.firstObject'));
  }.observes('sloTemplate'),

  // Relationships
  sla: DS.belongsTo('sla'),
  sloTemplate: DS.belongsTo('sloTemplate')
});
