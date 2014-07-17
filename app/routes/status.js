import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    var level = parseInt(this.routeName.slice(6));
    var parameter = params['status' + level + '_id'];
    return this.store.getById('status', parameter);
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    var level = parseInt(this.routeName.slice(6));
    controller.set('level', level);
  }
});
