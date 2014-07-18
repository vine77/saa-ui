import DS from 'ember-data';

// TODO: Why are there two models with the name App.Log? (See ./log.js)
export default DS.Model.extend({
  categories: DS.hasMany('logCategory')
});
