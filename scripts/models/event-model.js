App.Store.registerAdapter('App.Event', DS.FixtureAdapter);

App.Event = DS.Model.extend({
  message: DS.attr('string'),
  priority: DS.attr('number'),
  timestamp: DS.attr('number'),
  node: DS.belongsTo('App.Node'),
  vm: DS.belongsTo('App.Vm')
});

App.Event.FIXTURES = [
  {
    id: 1,
    message: 'Application loaded',
    priority: App.SUCCESS,
    timestamp: moment().valueOf()
  }
];
