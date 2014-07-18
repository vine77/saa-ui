import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['nodes'],
  isSlaEditing: false,
  sloTemplates: function() {
    return this.store.all('sloTemplate');
  }.property(),
  actions: {
    addSlo: function() {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
    },
    deleteSlo: function(slo) {
      slo.clearInverseRelationships();
    },
    editSla: function() {
      var self = this;
      if (this.get('isSlaEditing')) return;
      this.set('isSlaEditing', true);
      var sla = this.get('model');
      var slos = this.get('slos');
      /*
      sloPromises = [];
      slos.forEach(function(slo) {
        sloPromises.push(slo.save());
      });
      Ember.RSVP.all(sloPromises).then(function() {
        return sla.save();
      }).then(function() {
      */
      sla.save().then(function() {
        App.event('Successfully modified SLA "' + sla.get('name') + '".', App.SUCCESS);
        $('.modal:visible').modal('hide');
        self.set('isSlaEditing', false);
      }, function(xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to modify SLA "' + sla.get('name') + '".');
        self.set('isSlaEditing', false);
      });
      // TODO: Manually set SLO records to saved to clear isDirty
    }
  }
});
