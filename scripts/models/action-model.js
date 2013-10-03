DS.RESTAdapter.map('App.Action', {
  options: {embedded: 'always'}
});

App.Action = DS.Model.extend({
  name: DS.attr('string'),
  blocking: DS.attr('string'),
  status: DS.attr('number'),
  message: DS.attr('string'),
  done: DS.attr('boolean'),
  user: DS.attr('string'),
  started: DS.attr('string'),
  lastUpdate: DS.attr('string'),

  //Embedded Records
  options: DS.belongsTo('App.ActionOption'),

  //Relationships
  node: DS.belongsTo('App.Node'),
  vm: DS.belongsTo('App.Vm')

});

App.ActionOption = DS.Model.extend({
  schedulerMark: DS.attr('number'),
  schedulerPersistent: DS.attr('boolean')
});