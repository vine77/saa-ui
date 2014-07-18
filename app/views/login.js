import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    // Tooltips
    Ember.$('[rel=tooltip].tooltip-right').tooltip({
      placement: 'right'
    });
    Ember.$('[rel=tooltip].tooltip-left').tooltip({
      placement: 'left'
    });
  }
});
