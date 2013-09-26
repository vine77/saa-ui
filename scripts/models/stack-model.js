// Embedded records

/* TODO: Update embedded models
DS.RESTAdapter.map('stack', {
  status: {embedded: 'always'}
});
*/

// Embedded models
App.StackStatus = DS.Model.extend({
  locked: DS.attr('boolean'),
  health: DS.attr('number'),
  short_message: DS.attr('string'),
  long_message: DS.attr('string'),
  healthMessage: function () {
    if (App.isEmpty(this.get('short_message')) && App.isEmpty(this.get('long_message'))) {
      // If both short and long messages are empty, show health as message
      return '<strong>Health</strong>: ' + App.priorityToType(this.get('health')).capitalize();
    } else if (App.isEmpty(this.get('long_message'))) {  // Short message only
      return this.get('short_message').capitalize();
    } else if (App.isEmpty(this.get('short_message'))) {  // Long message only
      return this.get('long_message').capitalize();
    } else {  // Both short and long messages
      return '<strong>' + this.get('short_message').capitalize() + '</strong>: ' + this.get('long_message').capitalize();
    }
  }.property('health', 'long_message', 'short_message'),
  operational: DS.attr('number'),
  operationalMessage: function () {
    return '<strong>State</strong>: ' + App.codeToOperational(this.get('operational')).capitalize();
  }.property('operational')
});

App.Stack = DS.Model.extend({
  // Common Properties
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  // Embedded Relationships
  status: DS.belongsTo('stackStatus'),

  // Full Relationships
  vms: DS.hasMany('vm', {async: true}),

  // Properties from API
  name: DS.attr('string'),
  description: DS.attr('string'),
  vmsCount: DS.attr('number'),
  created: DS.attr('date'),
  updated: DS.attr('date')
});
