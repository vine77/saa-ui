App.Application = Ember.Object.extend({
  year: function () {
    return moment().format('YYYY');
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property()
});
App.application = App.Application.create();
