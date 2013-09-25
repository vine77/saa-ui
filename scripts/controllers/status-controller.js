App.StatusController = Ember.ObjectController.extend({
  init: function () {
    this._super();
    this.set('model', this.store.find('status', 'current'));
    this.store.find('status', 'current').on('becameError', function () {
      console.log('App.Status.current becameError');
    });
    this.updateCurrentStatus();
  },
  updateCurrentStatus: function () {
    if (!this.store.find('status', 'current').get('isLoaded')) {
      this.store.find('status', 'current').then(function () {
        console.log('PROMISE fulfill 1');
      }, function () {
        console.log('PROMISE reject 1');
      });
    } else if (!this.store.find('status', 'current').get('isLoading') && !this.store.find('status', 'current').get('isReloading')) {
      this.store.find('status', 'current').reload().then(function () {
        console.log('PROMISE fulfill 2');
      }, function () {
        console.log('PROMISE reject 2');
      });
    }
    Ember.run.later(this, 'updateCurrentStatus', 10000);
  }

  /*
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
  */

});
