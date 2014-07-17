// TODO: Why are there two models with the name App.Log? (See ./log.js)
App.Log = DS.Model.extend({
  categories: DS.hasMany('logCategory')
});
