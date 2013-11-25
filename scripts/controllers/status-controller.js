App.StatusController = Ember.ArrayController.extend({
  needs: ['application'],
  init: function () {
    this.set('model', this.store.all('status'));
  },
  // Properties
  currentSelections: [],
  breadcrumbsSorted: function() {
    return this.get('currentSelections').sort(function(a, b) {
      if (a.name < b.name)
         return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    });
  }.property('currentSelections'),
  connected: false,
  isUpdating: false,
  health: function() {
    var systemStatus = this.store.getById('status', 'system');
    return (systemStatus) ? systemStatus.get('health') : null;
  }.property('model.@each'),
  parentStatuses: function () {
    return this.store.all('status').filter(function(item, index, enumerable) {
      var isMatched = false;
      if (item.get('parent')) {
        item.get('parent').forEach(function(item, index, enumerable) {
          if (item.get('id') == 'system') {
            isMatched = true;
          }
        });
      }
      return isMatched;
    });
  }.property('model.@each'),

  showStatus: function () {
    return !this.get('isUpdating') && this.get('controllers.application.loggedIn');
  }.property('isUpdating', 'controllers.application.loggedIn'),
  statusErrorMessages: function () {
    return this.store.all('status').filterBy('isNotification');
  }.property('model.@each'),
  statusClass: function () {
    return (!this.get('health')) ? 'alert-info' : 'alert-' + App.priorityToType(this.get('health'));
  }.property('health'),

  // Functions
  updateCurrentStatus: function () {
    var self = this;
    // Update status and check connectivity every 10 seconds
    //Ember.run.later(this, 'updateCurrentStatus', 10000);
    if (!this.get('isUpdating')) {
      this.set('isUpdating', true);
      return this.store.findAll('status').then(function (status) {
        self.set('connected', true);
        self.set('isUpdating', false);
      }, function (error) {
        self.set('isUpdating', false);
        self.set('connected', false);
        return new Ember.RSVP.Promise(function (resolve, reject) { reject(); });
      });
    }
  },

  actions: {
    toggleChildren: function (elementId, name, breadcrumbSelect) {

      var children = "#children-"+elementId,
          selector = "#selector-"+elementId;

      if (Ember.View.views[elementId].get('isSelected')) {
        if (breadcrumbSelect !== true) { $(children).hide(); }
        var descendants = $('#'+elementId).find('div');
        for (var i = 0; i < descendants.length; i++) {
          var obj = this.get('currentSelections').findProperty('id', descendants[i].id);
          if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
        }
        if (breadcrumbSelect !== true) {
          var obj = this.get('currentSelections').findProperty('id', elementId);
          this.get('currentSelections').removeObject(obj);
        }
      } else {
        var obj = this.get('currentSelections').findProperty('id', elementId);
        if (obj == undefined) { this.get('currentSelections').pushObject({id: elementId, name: name}); }
      }

      var siblings = $('#'+elementId).siblings('div');

      for (var i = 0; i < siblings.length; i++) {

        var obj = this.get('currentSelections').findProperty('id', siblings[i].id);
        if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }

        var siblingDescendants = $('#'+siblings[i].id).find('*');

        for (var i2 = 0; i2 < siblingDescendants.length; i2++) {
          if (siblingDescendants[i2].id.indexOf('selector') !== -1) {
            var obj = this.get('currentSelections').findProperty('id', siblingDescendants[i2].id.replace('selector-', ''));
            if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
          }
        }
      }
    }
  }
});
