App.StatusPanelView = Ember.View.extend({
  templateName: 'statusPanel',
  childrenId: function() {
    return 'children-' + this.get('id');
  }.property('id'),
  selectorId: function() {
    return 'selector-' + this.get('id');
  }.property('id'),
  siblings: function() {
    return $('children-' + this.get('id')).siblings();
  }.property('elementId'),
  childrenLevel: function() {
    return this.get('level') + 1;
  }.property('level'),
  id: function () {
    var level = ((this.get('level') !== undefined)?this.get('level'):1);

    var counter = level;
    var breadcrumbPath = [];
    var lastParent = ((this.get('level') !== undefined)?this.get('parentView'):this);
    
    while (counter > 0) {
      if (counter == 1) {
        breadcrumbPath.push(counter + this.get('content.id'));
      } else {
        breadcrumbPath.push(counter + lastParent.get('content.id'));
      }
      counter = counter - 1;
      lastParent = lastParent.get('parentView');
    }
    breadcrumbPath = breadcrumbPath.join('-');
    return breadcrumbPath;
  }.property('id', 'content'),
  childrenStyle: function() {
    var controller = this.get('controller');

    var obj = controller.get('currentSelections').findProperty('id', this.get('id'));
    if (obj !== undefined) { var display = ''; } else { var display = 'display:none;'}

    return 'left: 269px;  top: 0px;  position: absolute; ' + display;
  }.property('childrenLevel'),
  isSelected: function() {
    var controller = this.get('controller');
    var obj = controller.get('currentSelections').findProperty('id', this.get('id'));
    if (obj !== undefined) {
      return true;
    } else {
      return false;
    }
  }.property('controller.currentSelections.@each'),
  init: function() {
    this.set('elementId', this.get('id'));
    this._super();
  }
});
