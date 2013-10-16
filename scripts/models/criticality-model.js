App.CriticalityAdapter = DS.FixtureAdapter.extend();

App.Criticality = DS.Model.extend({
  label: DS.attr('string')
});

App.Criticality.FIXTURES = [
  {
    id: 0,
    label: 'Debug'
  },
  {
    id: 1,
    label: 'Notice+'
  },
  {
    id: 2,
    label: 'Warning'
  },
  {
    id: 3,
    label: 'Warning+'
  },
  {
    id: 4,
    label: 'Error'
  },
  {
    id: 5,
    label: 'Critical'
  },
  {
    id: 'context',
    label: 'Multiple Selections'
  }
];
