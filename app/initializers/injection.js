import Ember from 'ember';
import mtWilson from '../models/mt-wilson';
import nova from '../models/nova';
import applicationModel from '../models/application';

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

    application.register('application:main', applicationModel, {instantiate: false});
    application.inject('controller:settings-dev', 'application', 'application:main');
    application.inject('controller:dashboard-status-components', 'application', 'application:main');
    application.inject('controller:dashboard-todo', 'application', 'application:main');
    application.inject('controller:settings-upload', 'application', 'application:main');

  }
};
