/*
App.BuildAdapter = DS.RESTSingletonAdapter.extend();

App.Build = DS.Model.extend({
  date: DS.attr('date'),
  version: DS.attr('string')
});
*/

App.Build = Ember.Object.extend({
  version: '',
  date: '',
  hostname: '',
  find: function () {
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/build.json',
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        App.log('200 response from GET /api/v1/configuration/build: ' + textStatus);
        App.build.set('version', data.build.version);
        App.build.set('date', data.build.date);
        App.build.set('hostname', data.hostname);
      }
    });
  }
});
App.build = App.Build.create();
