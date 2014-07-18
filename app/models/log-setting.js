import DS from 'ember-data';

export default DS.Model.extend({
  thresholdSize: DS.attr('number'),
  maximumDays: DS.attr('number'),
  configuredSize: DS.attr('number'),
  actualSize: DS.attr('number')
});
