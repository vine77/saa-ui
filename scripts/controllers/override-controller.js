App.OverrideController = Ember.ObjectController.extend({
  isDefault: false,
  isDefaultObserver: function() {
    if (!this.get('isDefault')) {
      if (Ember.isEmpty(this.get('model.default_value'))) {
        this.set('model.value', "Enter Value");
      } else {
        this.set('model.value', this.get('model.default_value'));
      }
    } else {
      this.set('model.value', null);
    }
  }.observes('isDefault'),
  isDisabled: Ember.computed.alias('isDefault'),
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
    this._super();
    if (Ember.isEmpty(this.get('model.value'))) {
      this.set('isDefault', true);
    } else {
      this.set('isDefault', false);
    }
  }
});
