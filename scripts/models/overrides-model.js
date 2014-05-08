App.OverrideAdapter = DS.RESTSingletonAdapter.extend();

App.Override = DS.Model.extend({
  configurationValues: DS.attr()
  //configurationValues: DS.attr('raw')
});

/*
App.ConfigurationValue = DS.Model.extend({
  name: DS.attr(),
  value: DS.attr(),
  defaultValue: DS.attr()
});

App.RawTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    console.log('inside deserialize');
    var type = Ember.typeOf(serialized);
    if (type == 'array') {
      console.log('array is type.');
      console.log('serialized', serialized);
      self = this;
      records = [];
      serialized.forEach(function(object) {
        // self.records.addObject(
        //self.store.createRecord()
      });
      return serialized
    }
    return serialized;
  },
  serialize: function(deserialized) {
    console.log('serialize');
    return deserialized;
  }
});
*/

