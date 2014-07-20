import Ember from 'ember';
import FilterableMixin from './../mixins/filterable';
import SortableMixin from './../mixins/sortable';
import Health from '../utils/mappings/health';

export default Ember.ArrayController.extend(FilterableMixin, SortableMixin, {
  needs: ['flavorsColumns', 'slas'],
  sortProperty: 'name',
  multipleFlavorsAreSelected: function() {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  slas: function() {
    return this.get('controllers.slas.model');
  }.property('controllers.slas.model.@each'),
  actions: {
    selectAll: function() {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function(model) {
      if (!model.get('isExpanded')) {
        this.transitionToRoute('flavor', model);
      } else {
        this.transitionToRoute('flavors');
      }
    },
    refresh: function() {
      this.store.find('flavor');
    },
    deleteFlavor: function(flavor) {
      var confirmedDelete = confirm('Are you sure you want to delete flavor "' + flavor.get('name') + '"?');
      if (confirmedDelete) {
        flavor.deleteRecord();
        flavor.save().then(function() {
          App.event('Successfully deleted flavor "' + flavor.get('name') + '".', Health.SUCCESS);
        }, function(xhr) {
          flavor.rollback();
          App.xhrError(xhr, 'Failed to delete flavor "' + flavor.get('name') + '".');
        });
      }
    }
  }
});
