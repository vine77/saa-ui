import Ember from 'ember';

export default {
  name: 'inflector',
  initialize: function(container, application) {
    Ember.Inflector.inflector.irregular('quota', 'quotas');
    Ember.Inflector.inflector.uncountable('vm_instantiation_simple');
    Ember.Inflector.inflector.uncountable('vm_instantiation_detailed');
  }
};
