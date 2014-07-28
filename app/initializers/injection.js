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
    application.register('models:mtWilson', mtWilson, {instantiate: false});
    application.inject('controller:application', 'mtWilson', 'models:mtWilson');
    application.inject('controller:trust', 'mtWilson', 'models:mtWilson');
    application.inject('controller:node', 'mtWilson', 'models:mtWilson');
    application.inject('controller:settings-trust', 'mtWilson', 'models:mtWilson');
    application.inject('controller:vm', 'mtWilson', 'models:mtWilson');

    application.register('models:nova', nova, {instantiate: false});
    application.inject('controller:application', 'nova', 'models:nova');
    application.inject('controller:settings-upload', 'nova', 'models:nova');

    application.register('models:openrc', openrc, {instantiate: false});
    application.inject('controller:application', 'openrc', 'models:openrc');
    application.inject('controller:settings-upload', 'openrc', 'models:openrc');

    application.register('models:quantum', quantum, {instantiate: false});
    application.inject('controller:application', 'quantum', 'models:quantum');
    application.inject('controller:settings-upload', 'quantum', 'models:quantum');

    application.register('models:keystone', keystone, {instantiate: false});
    application.inject('controller:settings-upload', 'keystone', 'models:keystone');

    application.register('models:application', applicationModel, {instantiate: false});
    application.inject('controller:settings-dev', 'application', 'models:application');
    application.inject('controller:dashboard-status-components', 'application', 'models:application');
    application.inject('controller:dashboard-todo', 'application', 'models:application');
    application.inject('controller:settings-upload', 'application', 'models:application');

    application.register('models:network', network, {instantiate: false});
    application.inject('controller:settings-network', 'network', 'models:network');
    application.inject('controller:trust', 'network', 'models:network');

  }
};
