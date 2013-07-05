App.Store.registerAdapter('App.Sla', DS.RESTConfigAdapter);

App.Sla = DS.Model.extend({
  // Common Properties
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  // Full Relationships
  slos: DS.hasMany('App.Slo'),
  flavor: DS.belongsTo('App.Flavor'),

  // Properties from API
  name: DS.attr('string'),

  // Computed Properties
  numberOfSlos: function () {
    return this.get('slos.length');
  }.property('slos.@each'),
  sloTypes: function () {
    //return this.get('slos').getEach('sloType').toString();
    return this.get('slos').map(function (item, index, enumerable) {
      if (!item || !item.get('sloType')) return null;
      return item.get('sloType').replace('_', ' ');
    }).join(', ');
  }.property('slos.@each.sloType')
});
