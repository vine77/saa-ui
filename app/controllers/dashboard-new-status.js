import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: 'newStatus',
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
  actions: {
    toggleChildren: function(elementId, name, breadcrumbSelect) {
      var children = "#children-" + elementId;
      var selector = "#selector-" + elementId;
      var obj, i;
      if (Ember.$(children).is(":visible")) {
        if (breadcrumbSelect !== true) { Ember.$(children).hide(); }
        var descendants = Ember.$('#'+elementId).find('div');
        for (i = 0; i < descendants.length; i++) {
          Ember.$('#children-'+descendants[i].id).hide();
          Ember.$('#selector-'+descendants[i].id).removeClass('panel-selector');
          obj = this.get('currentSelections').findProperty('id', descendants[i].id);
          if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
        }
        if (breadcrumbSelect !== true) {
          Ember.$(selector).removeClass('panel-selector');
          obj = this.get('currentSelections').findProperty('id', elementId);
          this.get('currentSelections').removeObject(obj);
        }
      } else {
        Ember.$(children).show();
        Ember.$(selector).addClass('panel-selector');
        obj = this.get('currentSelections').findProperty('id', elementId);
        if (obj === undefined) { this.get('currentSelections').pushObject({id: elementId, name: name}); }
      }
      var siblings = Ember.$('#'+elementId).siblings('div');
      for (i = 0; i < siblings.length; i++) {
        Ember.$('#children-'+siblings[i].id).hide();
        Ember.$('#selector-'+siblings[i].id).removeClass('panel-selector');
        obj = this.get('currentSelections').findProperty('id', siblings[i].id);
        if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
        var siblingDescendants = Ember.$('#'+siblings[i].id).find('*');
        for (var i2 = 0; i2 < siblingDescendants.length; i2++) {
          if (siblingDescendants[i2].id.indexOf('children') !== -1) {
            Ember.$('#'+siblingDescendants[i2].id).hide();
          }
          if (siblingDescendants[i2].id.indexOf('selector') !== -1) {
            Ember.$('#'+siblingDescendants[i2].id).removeClass('panel-selector');
            obj = this.get('currentSelections').findProperty('id', siblingDescendants[i2].id.replace('selector-', ''));
            if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
          }
        }
      }
    }
  }
});
