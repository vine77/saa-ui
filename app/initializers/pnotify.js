import Ember from 'ember';

export default {
  name: 'pnotify',
  initialize: function(container, application) {
    // Hide message history pull-down
    Ember.$.pnotify.defaults.history = false;
  }
};
