App.LoginView = Ember.View.extend({
  didInsertElement: function() {
    // Tooltips
    $('[rel=tooltip].tooltip-right').tooltip({
      placement: 'right'
    });
    $('[rel=tooltip].tooltip-left').tooltip({
      placement: 'left'
    });
  }
});
