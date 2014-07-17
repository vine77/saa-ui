App.InstantiationSlo = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  instantiationNode: DS.belongsTo('vmInstantiationNode'),
  description: DS.attr('string'),
  value: DS.attr('string'),
  readableValue: function () {
    if (this.get('slo.sloType') === 'trusted_platform') {
      return App.trustToString(this.get('value')).capitalize();
    } else {
      return this.get('value');
    }
  }.property('value', 'slo.sloType'),
  unit: DS.attr('string'),
  passed: DS.attr('boolean')
});
