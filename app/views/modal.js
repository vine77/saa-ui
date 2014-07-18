import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['modal', 'hide', 'fade'],
  didInsertElement: function() {
    Ember.$('#' + this.get('elementId')).modal('show');
    Ember.$('#' + this.get('elementId')).on('hidden', function() {
      history.back();
    });
  }
});
