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

  isBooleanSelected: 0,
  integer: '',
  rangeMin: '',
  rangeMax: '',

  valueModify: function (key, value) {
    console.log('value is executed');

    if (arguments.length > 1) {
      console.log('setter is executed');
    }
    if (value) {
      console.log('setter is executed');
    }

    if (this.get('model.isRange')) {
      //var isRangeParts = value.split(/\s+/);
      //this.set('firstName', nameParts[0]);
      //this.set('lastName',  nameParts[1]);

      var rangeMin = (( this.get('rangeMin') )?this.get('rangeMin'):'');
      var rangeMax = (( this.get('rangeMax') )?this.get('rangeMax'):'');
      return rangeMin + ';' + rangeMax;
    }
    if (this.get('model.isBoolean')) {
      return this.get('isBooleanSelected');
    }
    if (this.get('model.isInteger')) {
      return this.get('integer');
    }
    return '';
  }.property('rangeMin', 'rangeMax', 'isBooleanSelected', 'integer', 'sloTemplate', 'model.value'),
  init: function() {
    this.get('value');
  }

});

Ember.RadioButton = Ember.View.extend({
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val())
    },
    checked : function() {
        return this.get("value") == this.get("selection"); 
    }.property()
});