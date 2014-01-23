App.SlasCreateController = Ember.ObjectController.extend({
  isSlaCreating: false,
  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  actions: {
    addSlo: function () {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
    },
    deleteSlo: function (slo) {
      slo.clearInverseRelationships();
    },
    createSla: function () {
      var self = this;
      if (this.get('isSlaCreating')) return;
      this.set('isSlaCreating', true);
      var sla = this.get('model');
      var slos = this.get('slos');
      sla.save().then(function () {
        App.event('Successfully created SLA "' + sla.get('name') + '".', App.SUCCESS);
        $('.modal:visible').modal('hide');
        self.set('isSlaCreating', false);
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to create SLA "' + sla.get('name') + '".');
        self.set('isSlaCreating', false);
      });
    }
  }
});

App.SloCreateController = Ember.ObjectController.extend({
  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),

  rangeMin: function (key, value) {
    sloController = this;
    // Setter
    if (arguments.length > 1) {
      var min = value || '';
      var range = (this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', min + ';' + range.split(';')[1]);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[0];
    } else {
      return '';
    }
  }.property('value'),
  rangeMax: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var max = value || '';
      var range = (this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', range.split(';')[0] + ';' + max);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[1];
    } else {
      return '';
    }
  }.property('value')
});

Ember.RadioButton = Ember.View.extend({
  tagName: "input",
  type: "radio",
  attributeBindings: [ "name", "type", "value", "checked:checked:" ],
  click: function() {
    this.set("selection", this.$().val())
  },
  checked: function() {
    return this.get("value") == this.get("selection");
  }.property()
});
