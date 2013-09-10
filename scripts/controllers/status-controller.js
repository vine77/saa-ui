App.StatusController = Ember.ObjectController.extend({
  init: function () {
    this.set('model', App.Status.find('current'));
    this.autoRefresh();
  },
  autoRefresh: function () {
    if (App.Status.find('current').get('isLoaded')) {
      App.Status.find('current').reload();
    }
    Ember.run.later(this, 'autoRefresh', 10000);
  }

  /*
  model: function () {
    return App.Connectivity.find('current');
  }.property('App.Connectivity'),
  connected: true,
  check: function () {
    var context = this;
    hash = {
      url: '/api/v1/connectivity.json',
      type: 'GET',
      dataType: "json",
      complete: function (xhr, textStatus) {
        if (xhr.status === 200) {
          context.set('connected', true);
        } else {
          context.set('connected', false);
        }
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);    
  }
  */
 

});
