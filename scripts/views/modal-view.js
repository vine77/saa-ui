App.ModalView = Ember.View.extend({
  classNames: ['modal', 'hide', 'fade'],
  didInsertElement: function () {
    $('#' + this.get('elementId')).modal('show');
    $('#' + this.get('elementId')).on('hidden', function () {
      history.back();
    });
  }
});
