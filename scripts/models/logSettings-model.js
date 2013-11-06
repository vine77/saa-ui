App.LogSettingAdapter = DS.RESTSingletonAdapter.extend();

App.LogSetting = DS.Model.extend({
  thresholdSize: DS.attr('number'),
  maximumDays: DS.attr('number'),
  configuredSize: DS.attr('number'),
  actualSize: DS.attr('number')
});
