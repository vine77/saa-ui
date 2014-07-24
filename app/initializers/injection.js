import Ember from 'ember';
import mtWilson from '../models/mt-wilson';
import nova from '../models/nova';
import openrc from '../models/openrc';
import quantum from '../models/quantum';
import keystone from '../models/keystone';
import applicationModel from '../models/application';
import network from '../models/network';

export default {
  name: 'injection',
  initialize: function(container, application) {
    application.register('mtWilson:main', mtWilson, {instantiate: false});
    application.inject('controller:application', 'mtWilson', 'mtWilson:main');
    application.inject('controller:trust', 'mtWilson', 'mtWilson:main');
    application.inject('controller:node', 'mtWilson', 'mtWilson:main');
    application.inject('controller:settings-trust', 'mtWilson', 'mtWilson:main');
    application.inject('controller:vm', 'mtWilson', 'mtWilson:main');

    application.register('nova:main', nova, {instantiate: false});
    application.inject('controller:application', 'nova', 'nova:main');
    application.inject('controller:settings-upload', 'nova', 'nova:main');

    application.register('openrc:main', openrc, {instantiate: false});
    application.inject('controller:application', 'openrc', 'openrc:main');
    application.inject('controller:settings-upload', 'openrc', 'openrc:main');

    application.register('quantum:main', quantum, {instantiate: false});
    application.inject('controller:application', 'quantum', 'quantum:main');
    application.inject('controller:settings-upload', 'quantum', 'quantum:main');

    application.register('keystone:main', keystone, {instantiate: false});
    application.inject('controller:settings-upload', 'keystone', 'keystone:main');

    application.register('application:main', applicationModel, {instantiate: false});
    application.inject('controller:settings-dev', 'application', 'application:main');
    application.inject('controller:dashboard-status-components', 'application', 'application:main');
    application.inject('controller:dashboard-todo', 'application', 'application:main');
    application.inject('controller:settings-upload', 'application', 'application:main');

    application.register('network:main', network, {instantiate: false});
    application.inject('controller:settings-network', 'network', 'network:main');
    application.inject('controller:trust', 'network', 'network:main');

  }
};
