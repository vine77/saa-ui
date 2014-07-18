import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  message: DS.attr('string'),
  health: DS.attr('number'),
  isNotification: DS.attr('boolean'),
  parent: DS.hasMany('status'),
  offspring: DS.hasMany('status'),

  // Computed properties
  colorClass: function() {
    return "text-" + App.priorityToType(this.get('health'));
  }.property('health')
});
