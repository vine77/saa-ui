import DS from 'ember-data';
import humanize from '../utils/humanize';

export default DS.Model.extend({
  //allowedOperators: DS.attr(),  // Array of strings
  className: DS.attr('string'),
  description: DS.attr('string'),
  deleted: DS.attr('boolean'),
  operators: DS.attr(),  // Array of {operator: "", description: ""}
  valueType: DS.attr('string'),
  elementName: DS.attr('string'),
  unit: DS.attr('string'),
  sloType: DS.attr('string'),

  // Computed properties
  readableSloType: function() {
    return humanize(this.get('sloType'));
  }.property('sloType'),
  doesNotHaveMultipleOperators: function() {
    return this.get('allowedOperators.length') < 2;
  }.property('allowedOperators'),
  allowedOperators: function() {
    return this.get('operators').mapBy('operator');
  }.property('operators.@each')
});
