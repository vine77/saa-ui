import Ember from 'ember';
import Health from '../utils/mappings/health';
import getApiDomain from '../utils/get-api-domain';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.Controller.extend({
  isActionPending: false,
  isDeleteActionPending: false,
  unavailableSpaceWidth: function() {
    var percentage = (this.get('model.configuredSize') === 0) ? 0 : (this.get('model.actualSize')/this.get('model.configuredSize')) * 100;
    return 'width:' + percentage + '%;';
  }.property('model.configuredSize', 'model.actualSize'),
  actions: {
    deleteLogs: function() {
      var self = this;
      var verify = confirm('You are about to delete all log data. Are you sure you want to continue?');
      if (verify) {
        this.set('isDeleteActionPending', true);
        return Ember.$.ajax({
          url: (getApiDomain()) + '/api/v2/logs',
          type: 'DELETE'
        }).then(function() {
          self.set('isDeleteActionPending', false);
          event('Successfully deleted all log data.', Health.SUCCESS);
        }, function() {
          self.set('isDeleteActionPending', false);
          event('Error updating log settings.', Health.ERROR);
        });
      }
    },
    update: function(modelId) {
      var self = this;
      this.set('isActionPending', true);
      this.store.getById('logSetting', modelId).save().then(function() {
        self.set('isActionPending', false);
        event('Successfully updated  log settings.', Health.SUCCESS);
      }, function(xhr) {
        self.set('isActionPending', false);
        xhrError(xhr, 'Failed to update log settings.');
      });
      console.log('test 3');
    },
    cancel: function(model) {
      model.rollback();
    }
  }
});
