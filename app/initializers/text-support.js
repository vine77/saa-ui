import Ember from 'ember';

export default {
  name: 'text-support',
  initialize: function(container, application) {
    // Extend built-in Ember views
    Ember.TextSupport.reopen({
      attributeBindings: ['required', 'autofocus']
    });
  }
};
