/*
App.BuildAdapter = DS.RESTSingletonAdapter.extend();

App.Build = DS.Model.extend({
  hostname: DS.attr('string'),
  build: DS.attr()
});
*/

App.Build = Ember.Object.extend({
  version: '',
  date: '',
  hostname: '',
  find: function () {
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/builds.json',
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        App.log('200 response from GET /api/v1/configuration/build: ' + textStatus);
        App.build.set('version', data.builds[0].build.version);
        App.build.set('date', data.builds[0].build.date);
        App.build.set('hostname', data.builds[0].hostname);
      }
    });
  }
});
App.build = App.Build.create();
