App.SlaAdapter = DS.RESTConfigAdapter.extend();

App.SlaSerializer = App.ApplicationSerializer.extend({
  attrs: {
    slos: {sideload: 'always'}
  }
});

App.Sla = DS.Model.extend({
  name: DS.attr('string'),
  deleted: DS.attr('boolean'),
  version: DS.attr('number'),
  isDefault: DS.attr('boolean'),

  // Relationships
  slos: DS.hasMany('slo', {async: true}),
  flavor: DS.belongsTo('flavor'),

  // Computed Properties
  slaType: function() {
    return this.get('slos').mapBy('elementName').get('firstObject');
  }.property('slos.@each.elementName'),
  sloTypes: function () {
    //return this.get('slos').getEach('sloType').toString();
    return this.get('slos').map(function (item, index, enumerable) {
      if (!item || !item.get('sloType')) return null;
      return item.get('sloType').replace(/[_-]/g, ' ').capitalize();
    }).join(', ');
  }.property('slos.@each.sloType'),
  sloTypesArray: function() {
    return this.get('slos').mapBy('sloType');
  }.property('slos.@each.sloType')
});
