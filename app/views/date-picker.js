App.DatePickerView = Ember.TextField.extend({
  attributeBindings: ['dataDateFormat:data-date-format', 'class'],
  didInsertElement: function () {
    $('.datepicker').datepicker();
  }

});
