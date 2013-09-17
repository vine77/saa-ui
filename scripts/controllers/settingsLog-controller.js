App.SettingsLogController = Ember.Controller.extend({
  thresholdSize: function () {
    return App.settingsLog.get('thresholdSize');
  }.property('App.settingsLog.thresholdSize'),  
  actualSize: function () {
    return App.settingsLog.get('actualSize');
  }.property('App.settingsLog.actualSize'),
  actions: {
    deleteLogs: function() {
      verify = confirm('You are about to delete all log data. Are you sure you want to continue?');
      if (verify) {
        App.settingsLog.deleteLogs();
      } 
    },
    update: function () {
      App.settingsLog.update();
    }
  },


});
