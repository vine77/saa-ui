import Ember from 'ember';
import Health from '../utils/mappings/health';

// TODO: Port to real model
export default DS.Model.extend({
  message: DS.attr('string'),
  priority: DS.attr('number'),
  timestamp: DS.attr('number'),
  node: DS.belongsTo('node'),
  vm: DS.belongsTo('vm'),
  // TODO: Don't use fixtures
  FIXTURES: [{
    id: 1,
    message: 'Application loaded',
    priority: Health.SUCCESS,
    timestamp: moment().valueOf()
  }]
});
