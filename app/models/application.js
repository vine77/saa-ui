// TODO: Port to real model
App.Application = Ember.Object.extend({
  fullTitle: 'Intel® Datacenter Manager: Service Assurance Administrator',
  longTitle: 'Service Assurance Administrator',
  title: 'SAA',
  year: function () {
    return moment().format('YYYY');
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property()
});
App.application = App.Application.create();
