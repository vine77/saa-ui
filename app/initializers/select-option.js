import Ember from 'ember';

export default {
  name: 'select-option',
  initialize: function(container, application) {
    // Extend Ember.SelectOption so that disabled attribute for indivudal options may be used
    Ember.SelectOption.reopen({
      attributeBindings: ['value', 'selected', 'disabled'],
      disabled: function() {
        var content = this.get('content');
        return content.disabled || false;
      }.property('content')
    });
  }
};
