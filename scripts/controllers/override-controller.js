App.OverrideController = Ember.ObjectController.extend({
  configurationValues: function() {
    var returnArray = [];
    var configurationValues = this.get('model') && this.get('model').get('configurationValues');
    if (configurationValues) {
      configurationValues.forEach( function(item) {
        returnArray.addObject(App.ConfigurationValueController.create({model: item}));
      });
    }
    return returnArray;
  }.property('model.@each'),
  init: function () {
    this._super();
    this.set('model', this.store.find('override', 'current'));
  }
});

App.ConfigurationValueController = Ember.ObjectController.extend({
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