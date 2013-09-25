App.ConnectivityController = Ember.ObjectController.extend({
  model: function () {
    return this.store.find('connectivity', 'current');
  },
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
});
