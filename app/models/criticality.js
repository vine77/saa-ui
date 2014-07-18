import DS from 'ember-data';

// TODO: Don't use fixtures
export default DS.Model.extend({
  label: DS.attr('string'),
  FIXTURES: [{
    id: 0,
    label: 'Debug'
  }, {
    id: 1,
    label: 'Notice'
  }, {
    id: 2,
    label: 'Notice+'
  }, {
    id: 3,
    label: 'Warning'
  }, {
    id: 4,
    label: 'Warning+'
  }, {
    id: 5,
    label: 'Error'
  }, {
    id: 6,
    label: 'Error+'
  }, {
    id: 7,
    label: 'Critical'
  }, {
    id: 'context',
    label: 'Multiple Selections'
  }]
});
