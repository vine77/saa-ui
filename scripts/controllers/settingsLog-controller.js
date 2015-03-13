App.SettingsLogController = Ember.Controller.extend(Ember.Validations.Mixin, {
  validations: {
    'model.configuredSize': {
      presence: { message: 'is required - must not be blank' },
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
    },
    'model.maximumDays': {
      presence: { message: 'is required - must not be blank' },
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
    }
  },
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
          url: (App.getApiDomain()) + '/api/v3/logs',
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
      self.validate().then(function(){
        this.store.getById('logSetting', modelId).save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully updated  log settings.', App.SUCCESS);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to update log settings.');
        });
      }, function() {
        self.set('isActionPending', false);
        App.event('Form fields did not validate - please provide valid data.', App.ERROR);
      });
    },
    cancel: function (model) {
      model.rollback();
    }
  }
});
