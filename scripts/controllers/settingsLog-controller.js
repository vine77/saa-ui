App.SettingsLogController = Ember.Controller.extend({
  isActionPending: false,
  isDeleteActionPending: false,
  unavailableSpaceWidth: function () {
    var percentage = (this.get('model.configuredSize') == 0) ? 0 : (this.get('model.actualSize')/this.get('model.configuredSize')) * 100;
    return 'width:' + percentage + '%;';
  }.property('model.configuredSize', 'model.actualSize'),
  actions: {
    deleteLogs: function() {
      var self = this;
      verify = confirm('You are about to delete all log data. Are you sure you want to continue?');
      if (verify) {
        this.set('isDeleteActionPending', true);
        return Ember.$.ajax({
          url: (App.getApiDomain()) + '/api/v1/logs',
          type: 'DELETE'
        }).then(function () {
          self.set('isDeleteActionPending', false);
          App.event('Successfully deleted all log data.', App.SUCCESS);
        }, function () {
          self.set('isDeleteActionPending', false);
          App.event('Error updating log settings.', App.ERROR);
        });
      }
    },
    update: function (modelId) {
      var self = this;
      this.set('isActionPending', true);
      this.store.getById('logSetting', modelId).save().then(function () {
        self.set('isActionPending', false);
        App.event('Successfully updated  log settings.', App.SUCCESS);
      }, function (xhr) {
        self.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to update log settings.');
      });
      console.log('test 3');
    },
    cancel: function (model) {
      model.rollback();
    }
  }
});
