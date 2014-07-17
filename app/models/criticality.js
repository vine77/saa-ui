App.Criticality = DS.Model.extend({
  label: DS.attr('string')
});

// TODO: Don't use fixtures
App.Criticality.FIXTURES = [
  {
    id: 0,
    label: 'Debug'
  },
  {
    id: 1,
    label: 'Notice'
  },
  {
    id: 2,
    label: 'Notice+'
  },
  {
    id: 3,
    label: 'Warning'
  },
  {
    id: 4,
    label: 'Warning+'
  },
  {
    id: 5,
    label: 'Error'
  },
  {
    id: 6,
    label: 'Error+'
  },
  {
    id: 7,
    label: 'Critical'
  },
  {
    id: 'context',
    label: 'Multiple Selections'
  }
];

