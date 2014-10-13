App.SlasColumnsController = App.ColumnsController.extend({
  content: [{
    sortBy: 'enabled',
    icon: 'icon-check',
    description: 'Enabled/Disabled'
  }, {
    title: 'SLA Name',
    sortBy: 'name'
  }, {
    title: 'SLA Type',
    sortBy: 'type'
  }, {
    title: 'Default',
    sortBy: 'isDefault'
  }, {
    title: '# of SLOs',
    sortBy: 'slos.length'
  }, {
    title: 'SLO Types',
    sortBy: 'sloTypes'
  }, {
    title: 'Actions'
  }]
});

App.SlasController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  sortProperty: 'name',
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isExpanded')) {
        this.transitionToRoute('sla', model);
      } else {
        this.transitionToRoute('slas');
      }
    },
    refresh: function () {
      this.store.find('sla');
    },
    deleteSla: function (sla) {
      var confirmationMessage = 'Are you sure you want to delete SLA "' + sla.get('name') + '"?';
      if (sla.get('flavor')) {
        confirmationMessage += ' Warning: This action will also delete the associated flavor "' + sla.get('flavor.name') + '".';
      }
      var confirmedDelete = confirm(confirmationMessage);
      if (confirmedDelete) {
        sla.deleteRecord();
        sla.save().then(function () {
          App.event('Successfully deleted SLA "' + sla.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          sla.rollback();
          App.xhrError(xhr, 'Failed to delete SLA "' + sla.get('name') + '".');
        });
      }
    },
  }
});
