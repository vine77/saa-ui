App.EventAdapter = DS.FixtureAdapter.extend();

App.Event = DS.Model.extend({
  message: DS.attr('string'),
  priority: DS.attr('number'),
  timestamp: DS.attr('number'),
  node: DS.belongsTo('node'),
  vm: DS.belongsTo('vm')
});

App.Event.FIXTURES = [
  {
    id: 1,
    message: 'Application loaded',
    priority: App.SUCCESS,
    timestamp: moment().valueOf()
  }
];
