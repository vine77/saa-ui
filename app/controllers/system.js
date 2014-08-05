import Ember from 'ember';

export default Ember.ArrayController.extend({
  init: function() {
    this._super();
    this.set('model', this.store.find('system', 'current'));
  }
});
