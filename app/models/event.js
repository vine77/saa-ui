import DS from 'ember-data';
import Health from '../utils/mappings/health';

// TODO: Port to real model
export default DS.Model.extend({
  message: DS.attr('string'),
  priority: DS.attr('number'),
  timestamp: DS.attr('number'),
  node: DS.belongsTo('node'),
  vm: DS.belongsTo('vm')
}).reopenClass({
  FIXTURES: [{
    id: 1,
    message: 'Application loaded',
    priority: Health.SUCCESS,
    timestamp: window.moment().valueOf()
  }]
});