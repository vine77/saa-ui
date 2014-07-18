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
      var children = "#children-" + elementId,
      var selector = "#selector-" + elementId;
      if ($(children).is(":visible")) {
        if (breadcrumbSelect !== true) { $(children).hide(); }
        var descendants = $('#'+elementId).find('div');
        for (var i = 0; i < descendants.length; i++) {
          $('#children-'+descendants[i].id).hide();
          $('#selector-'+descendants[i].id).removeClass('panel-selector');
          var obj = this.get('currentSelections').findProperty('id', descendants[i].id);
          if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
        }
        if (breadcrumbSelect !== true) {
          $(selector).removeClass('panel-selector');
          var obj = this.get('currentSelections').findProperty('id', elementId);
          this.get('currentSelections').removeObject(obj);
        }
      } else {
        $(children).show();
        $(selector).addClass('panel-selector');
        var obj = this.get('currentSelections').findProperty('id', elementId);
        if (obj == undefined) { this.get('currentSelections').pushObject({id: elementId, name: name}); }
      }

      var siblings = $('#'+elementId).siblings('div');

      for (var i = 0; i < siblings.length; i++) {

        $('#children-'+siblings[i].id).hide();
        $('#selector-'+siblings[i].id).removeClass('panel-selector');

        var obj = this.get('currentSelections').findProperty('id', siblings[i].id);
        if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }

        var siblingDescendants = $('#'+siblings[i].id).find('*');

        for (var i2 = 0; i2 < siblingDescendants.length; i2++) {
          if (siblingDescendants[i2].id.indexOf('children') !== -1) {
            $('#'+siblingDescendants[i2].id).hide();
          }
          if (siblingDescendants[i2].id.indexOf('selector') !== -1) {
            $('#'+siblingDescendants[i2].id).removeClass('panel-selector');
            var obj = this.get('currentSelections').findProperty('id', siblingDescendants[i2].id.replace('selector-', ''));
            if (obj !== undefined) { this.get('currentSelections').removeObject(obj); }
          }
        }
      }
    }
  }
});
