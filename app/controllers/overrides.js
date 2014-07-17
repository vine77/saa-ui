App.OverridesController = Ember.ArrayController.extend({
  configurationValuesExist: function() {
    return this.get('model.configurationValues.length') > 0;
  }.property('model.configurationValues.length'),
  init: function () {
    this._super();
    this.set('content', this.store.find('override', 'current'));
  }
});
