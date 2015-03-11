App.SlasColumnsController = App.ColumnsController.extend({
  content: [{
    title: 'SLA Name',
    sortBy: 'name'
  }, {
    title: 'SLA Type',
    sortBy: 'type'
  }, {
    title: 'Default',
    sortBy: 'isDefault'
  }, {
    title: 'Enabled',
    sortBy: 'enabled'
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
      sla.get('flavors').then(function(flavors) {
        if (flavors.get('length') > 0) {
          flavors = flavors.mapBy('name').compact();
          if (Ember.isEmpty(flavors)) {
            confirmationMessage += ' Warning: This action will also delete the associated flavor(s).';
          } else {
            confirmationMessage += ' Warning: This action will also delete the associated flavors: ';
            confirmationMessage += flavors.map(function(item, index, enumerable) {
              return '"' + item + '"';
            }).join(', ') + '.';
          }
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
      });
    },
  }
});
