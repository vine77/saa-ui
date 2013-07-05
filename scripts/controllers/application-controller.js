App.ApplicationController = Ember.ArrayController.extend({
  buildVersionBinding: 'App.Build.firstObject.version',
  buildDateBinding: 'App.Build.firstObject.date',
  loggedInBinding: 'App.login.loggedIn',
  isMtWilsonInstalledBinding: 'App.mtWilson.isInstalled',
  logsUrl: function() {
    // Kibana: port 5601
    // return 'http://' + window.location.hostname + ':5601';
    return 'http://' + window.location.hostname + '/kibana/index.html#eyJzZWFyY2giOiIiLCJmaWVsZHMiOlsiQHNvdXJjZV9ob3N0IiwiQG1lc3NhZ2UiLCJAZmllbGRzLnN5c2xvZ19wcm9ncmFtIiwiQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHkiXSwib2Zmc2V0IjowLCJ0aW1lZnJhbWUiOiJhbGwiLCJncmFwaG1vZGUiOiJjb3VudCIsInRpbWUiOnsidXNlcl9pbnRlcnZhbCI6MH0sInN0YW1wIjoxMzY4ODI4MDQ4NjMxfQ==';
  }.property(),
  graphsUrl: function() {
    // Node Data (Graphite): port 85
    return 'http://' + window.location.hostname + ':85';
  }.property(),
  isDrawerExpanded: false,
  expandDrawer: function (target) {
    //$('#drawer').find('a[data-target=drawer- ' + target + ']').click();
    //$('drawer').find('a[data-target=drawer- ' + target + ']').tab('show');
    this.set('isDrawerExpanded', true);
  },
  hideDrawer: function () {
    $('#drawer ul.nav-tabs > li').removeClass('active');
    this.set('isDrawerExpanded', false);
  },
  loadFrame: function (target) {
    var iframe = $('#drawer-' + target + '-all > iframe');
    if (iframe.attr('src') === undefined) {
      iframe.attr('src', this.get(target + 'Url'));
    }
  },
  updateCurrentPath: function () {
    App.set('currentPath', this.get('currentPath'));
  }.observes('currentPath')
});
