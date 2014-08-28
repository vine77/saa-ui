App.SloController = Ember.ObjectController.extend({
  //sloTemplates: function() {
  //  return this.get('parentController.sloTemplates');
  //}.property('parentController.sloTemplates.@each', 'parentController.isAddSloAvailable'),
  currentSloType: function() {
    return this.get('sloTemplate.sloType');
  }.property('sloTemplate'),
  sloTemplates: function() {
    var self = this;
    var currentSloType = this.get('currentSloType');
    var currentSloTypeBucketCheck =  1;
    var returnArray = this.store.all('sloTemplate').map(function(item, index, enumerable) {
      var disabled = false;
      console.log('item sloType', item.sloType);
      switch(item.get('sloType')) {
        case 'assured-scu-vcpu':
          //if (self.get('parentController.bucketSloCount') >= 1 && (currentSloType != 'assured-scu-vcpu') && (currentSloType != 'assured-scu-vm') && (currentSloType != 'assured-cores-physical') ) {
          console.log('bucketSloCount', self.get('parentController.bucketSloCount'));
          //if (self.get('parentController.bucketSloCount') >= 1 && (currentSloType != 'assured-scu-vcpu') && (currentSloType != 'assured-scu-vm') && (currentSloType != 'assured-cores-physical') ) {
          if (self.get('parentController.bucketSloCount') >= 1 && self.get('currentSloType') != 'assured-scu-vcpu' ) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured SCUs (per-vCPU)');
          item.set('group', 'Compute Modes');
          break;
        case 'assured-scu-vm':
          //if (self.get('parentController.bucketSloCount') >= 1) {
          if (self.get('parentController.bucketSloCount') >= 1 && (currentSloType != 'assured-scu-vcpu' && currentSloType != 'assured-scu-vm' && currentSloType != 'assured-cores-physical') ) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured SCUs (per-VM)');
          item.set('group', 'Compute Modes');
          break;
        case 'assured-cores-physical':
          //if (self.get('parentController.bucketSloCount') >= 1) {
          if (self.get('parentController.bucketSloCount') >= 1 && (currentSloType != 'assured-scu-vcpu' && currentSloType != 'assured-scu-vm' && currentSloType != 'assured-cores-physical') ) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured physical cores');
          item.set('group', 'Compute Modes');
          break;
        case 'trusted_platform':
          //if (self.get('parentController.trustSloCount') >= 1) {
          if (self.get('parentController.trustSloCount') >= 1 && (currentSloType != 'trusted_platform')) {
            disabled = true;
            item.set('group', 'Trust');
          }
          item.set('readableSloType', 'Trusted platform');
          break;
        default:
          disabled = false;
          break;
      }
      item.disabled = disabled;
      return item;
    });
    return returnArray.sortBy('readableSloType');
  }.property('parentController.isAddSloAvailable', 'parentController.bucketSloCount', 'parentController.model.sla.sloTypesArray.@each', 'currentSloType'),


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
