App.OverrideController = Ember.ObjectController.extend({
  isDefault: null,
  isDefaultObserver: function() {
    if (!this.get('isDefault')) {
      this.set('model.value', this.get('model.default_value'));
    } else {
      this.set('model.value', null);
    }
  }.observes('isDefault'),
  isDisabled: function() {
    return Ember.isEmpty(this.get('model.value'));
  }.property('model.@each', 'model.value'),
  isIP: function() {
    var ipValue = this.get('model.default_value');
    var ipPattern = '^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$';
    var ipArray = ipValue.match(ipPattern);
    return Ember.isEmpty(ipArray);
  }.property('model.@each'),
  placeholder: function() {
    if (this.get('isDisabled')) {
      return this.get('model.default_value');
    }
  }.property('model.@each', 'isDisabled'),
  init: function() {
    if (Ember.isEmpty(this.get('model.value'))) {
      this.set('isDefault', true);
    } else {
      this.set('isDefault', false);
    }
  }
});
