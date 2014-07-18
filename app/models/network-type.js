import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  version: DS.attr('number', {defaultValue: 1}),
  //debugId: DS.attr('number'),
  //resourceId: DS.attr('number'),
  setting: DS.attr('number')
});
