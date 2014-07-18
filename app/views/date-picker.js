import Ember from 'ember';

export default Ember.TextField.extend({
  attributeBindings: ['dataDateFormat:data-date-format', 'class'],
  didInsertElement: function() {
    $('.datepicker').datepicker();
  }
});
