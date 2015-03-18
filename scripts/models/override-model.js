App.OverrideAdapter = DS.RESTSingletonAdapter.extend();

App.Override = DS.Model.extend({
  configurationValues: DS.attr()
});
