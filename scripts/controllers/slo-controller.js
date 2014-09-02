App.SloTemplatesController = Ember.ArrayController.extend({
  itemController: 'sloTemplate'
});
App.SloTemplatesView = Ember.Select.extend({
  contentBinding: 'this.controller',
  prompt: "Select Template",
  //selectionBinding: 'this.controller.parentController.sloTemplate',
  selectionBinding: 'sloTemplateSelection',
  optionLabelPath: 'content.readableSloType',
  optionValuePath: 'content.id',

  selectionObserver: function() {
    console.log('sloTemplateSelection triggered');
    var parentController = this.get('controller.parentController');
    var model = this.get('sloTemplateSelection.model.content');
    var model2 = this.get('content').findBy('sloType', 'trusted_platform');
    console.log('parentController', parentController);
    console.log('model', model);
    this.set('sloTemplateSelection', model2);
    parentController.set('sloTemplate', model);
    //this.set('sloTemplateSelection', model2);

    //.set('sloTemplate', this.get('sloTemplate.model.content'));
  }.observes('sloTemplateSelection')
});

App.SloTemplateController = Ember.ObjectController.extend({
  group: function() {
    switch(this.get('model.sloType')) {
      case 'assured-scu-vcpu':
      case 'assured-scu-vm':
      case 'assured-cores-physical':
        return 'Compute Modes';
      case 'trusted_platform':
        return 'Trust';
    }
  }.property('model.sloType'),
  disabled: function() {
    switch(this.get('model.sloType')) {
      case 'assured-scu-vcpu':
      case 'assured-scu-vm':
      case 'assured-cores-physical':
        return (this.get('bucketSloCount') >= 1 && (this.get('currentSloType') != 'assured-scu-vcpu') && (this.get('currentSloType') != 'assured-scu-vm') && (this.get('currentSloType') != 'assured-cores-physical'));
        break;
      case 'trusted_platform':
        return (this.get('trustSloCount') >= 1 && (this.get('currentSloType') != 'trusted_platform'));
        break;
    }
  }.property('currentSloType', 'bucketSloCount', 'trustSloCount', 'model.sloType'),
  readableSloType: function() {
    switch(this.get('model.sloType')) {
      case 'assured-scu-vcpu':
        return 'Assured SCUs (per-vCPU)';
        break;
      case 'assured-scu-vm':
        return 'Assured SCUs (per-VM)';
        break;
      case 'assured-cores-physical':
        return 'Assured physical cores';
        break;
      case 'trusted_platform':
        return 'Trusted';
        break;
    }
  }.property('model.sloType')
});

App.SloController = Ember.ObjectController.extend({
  currentSloType: function() {
    return this.get('sloTemplate.sloType');
  }.property('sloTemplate'),
  sloTemplateSelectionObserver: function() {
    //var sloTemplate = this.store.all('sloTemplate').findBy('sloType', this.get('sloTemplateSelection.sloType'));
    var sloTemplate = this.get('sloTemplateSelection.model.content');
    this.set('sloTemplate', sloTemplate);
  }.observes('sloTemplateSelection'),

  sloTemplates: function() {
    var returnArray = [];
    var self = this;
    this.store.all('sloTemplate').forEach(function(item, index, enumerable) {
      var disabled = false;
      var newItem = App.SloTemplateController.create({
        model: item,
        bucketSloCount: self.get('parentController.bucketSloCount'),
        trustSloCount: self.get('parentController.trustSloCount'),
        currentSloType: self.get('currentSloType')
      });
      returnArray.push(newItem);
    });
    return returnArray;
  }.property('parentController.isAddSloAvailable', 'parentController.bucketSloCount', 'parentController.model.sla.sloTypesArray.@each', 'currentSloType'),

/*
  sloTemplates: function() {
    return this.store.all('sloTemplate');
  }.property(),
  */
  allowedOperatorsGreaterThanOne: function() {
    return (this.get('model.sloTemplate.allowedOperators.length') > 1);
  }.property('model.sloTemplate.allowedOperators'),
  rangeMin: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var min = value || '';
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
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
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
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
