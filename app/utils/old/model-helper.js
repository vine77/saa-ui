// TODO: Migrate Sunil's authentication code
App.ModelHelper = Ember.Object.extend({
  doTransaction: function(model, controller, route, handlers) {
    var handler_fun = function (handler) {
      return function () {
        for (var event in handlers) {
          model.off(event);
        }
        if ('resetState' in handler) {
          model.get('stateManager').transitionTo('loaded.saved');
        }
        if ('postFun' in handler) {
          handler.postFun(model, controller, route, arguments)
        }
        if ('nextRoute' in handler) {
          route.transitionTo(handler.nextRoute)
        }
      }
    };
    for (var event in handlers) {
      model.on(event, handler_fun(handlers[event]));
    }
    model.save();
  }
});

App.modelhelper = App.ModelHelper.create();
