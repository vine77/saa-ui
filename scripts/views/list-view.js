App.ListView = Ember.VirtualListView.extend({
  init: function () {
    this._super();
    this.get('controller').set('listView', this);
  },
  height: function () {
    var listViewHeight = this.get('controller.controllers.application.height') - 205;
    var pageSize = Math.round(listViewHeight/this.get('rowHeight'));
    return listViewHeight;
  }.property('controller.controllers.application.height'),
  pageSize: function () {
    return Math.round(this.get('height')/this.get('rowHeight'));
  }.property('controller.controllers.application.height'),
  currentPage: function () {
    var topRow = Math.round(this.get('scrollTop')/this.get('rowHeight'));
    var pageSize = Math.round(this.get('height')/this.get('rowHeight'));
    return Math.ceil(topRow/pageSize) + 1;
  }.property('scrollTop', 'height'),
  goToPage: function (pageNumber) {
    var scrollTop = this.get('rowHeight') * this.get('pageSize') * (pageNumber - 1);
    this.scrollTo(scrollTop, false);
  },
  rowHeight: 34,
  _isScrolling: false,
  controllerName: function () {
    var name = this.get('controller').constructor.toString().split('.')[1];
    if (name.indexOf('Controller') === -1) throw new Error('Name of controller must end with "Controller"');
    return name.slice(0, name.indexOf('Controller')).toLowerCase();
  }.property(),
  itemViewClass: function () {
    return Ember.ReusableListItemView.extend({
      templateName: this.get('controllerName') + 'Row'
    });
  }.property('controllerName')
});
