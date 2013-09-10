App.StatusController = Ember.ObjectController.extend({
  init: function () {
    this._super();
    this.set('model', App.Status.find('current'));
    App.Status.find('current').on('becameError', function () {
      console.log('App.Status.current becameError');
    });
    this.updateCurrentStatus();
  },
  /*
  model: function () {
    return App.Status.find('current');
  },
  */
  updateCurrentStatus: function () {
    if (!App.Status.find('current').get('isLoaded')) {
      App.Status.find('current').then(function () {
        console.log('PROMISE fulfill 1');
      }, function () {
        console.log('PROMISE reject 1');
      });
    } else if (!App.Status.find('current').get('isLoading') && !App.Status.find('current').get('isReloading')) {
      App.Status.find('current').reload().then(function () {
        console.log('PROMISE fulfill 2');
      }, function () {
        console.log('PROMISE reject 2');
      });
    }
    Ember.run.later(this, 'updateCurrentStatus', 10000);
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
