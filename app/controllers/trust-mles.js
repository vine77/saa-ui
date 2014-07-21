import Ember from 'ember';
import FilterableMixin from './../mixins/filterable';
import SortableMixin from './../mixins/sortable';
import Health from '../utils/mappings/health';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ArrayController.extend(FilterableMixin, SortableMixin, {
  itemController: 'trustMle',
  sortProperty: 'name',
  actions: {
    deleteMle: function(mle) {
      // Prevent action if any nodes are registered with this MLE
      if (mle.get('trustNode.length') > 0) {
        event('Failed to delete MLE. You must first remove trust from all of the MLE\'s associated nodes.', Health.ERROR);
      } else {
        var confirmed = confirm('Are you sure you want to delete this MLE?');
        if (confirmed) {
          mle.deleteRecord();
          mle.save().then(function() {
            event('Successfully deleted MLE.', Health.SUCCESS);
          }, function(xhr) {
            mle.rollback();
            xhrError(xhr, 'An error occured while attempting to delete the MLE.');
          });
        }
      }
    },
    refresh: function() {
      this.store.find('trustMle');
      this.store.find('trustNode');
    }
  }
});
