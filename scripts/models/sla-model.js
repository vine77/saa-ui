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

  // Relationships
  slos: DS.hasMany('slo', {async: true}),
  flavor: DS.belongsTo('flavor'),

  // Computed Properties
  sloTypes: function () {
    //return this.get('slos').getEach('sloType').toString();
    return this.get('slos').map(function (item, index, enumerable) {
      if (!item || !item.get('sloType')) return null;
      return item.get('sloType').replace('_', ' ');
    }).join(', ');
  }.property('slos.@each.sloType')
});
