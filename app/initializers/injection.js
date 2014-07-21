import Ember from 'ember';
import mtWilson from '../models/mt-wilson';

export default {
  name: 'injection',
  initialize: function(container, application) {
    application.register('mtWilson:main', mtWilson, {instantiate: false});
    application.inject('controller:application', 'mtWilson', 'mtWilson:main');
    application.inject('controller:trust', 'mtWilson', 'mtWilson:main');
    application.inject('controller:node', 'mtWilson', 'mtWilson:main');
    application.inject('controller:settings-trust', 'mtWilson', 'mtWilson:main');
    application.inject('controller:vm', 'mtWilson', 'mtWilson:main');
  }
};
