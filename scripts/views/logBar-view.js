App.LogBarView = Ember.View.extend({
  templateName: 'logBar-view',
  didInsertElement: function () {
    //set default values for select list
    //App.logBar.set('shortCutTimeSelected', App.logBar.shortCutTimes.objectAt(7));
    this.get('controller').set('shortCutTimeSelected', this.get('controller').shortCutTimes.objectAt(7));
    this.get('controller').set('criticalitySelected', this.get('controller').criticalities.objectAt(3));

    //init datePicker
    $('.datepicker').datepicker();
    //styleLogsFrame
    this.styleLogsFrame();
  },
  updateLogsFrame: function () {
    this.styleLogsFrame();
    //App.logBar.updateLogsFrame();
    this.get('controller').updateLogsFrame();
  },
  styleLogsFrame: function () {
    setTimeout(function () {
      try {
        frames['allLogsFrame'].sbctl('hide', true);
      } catch(error) {
        // Kibana is not loaded in iFrame
      }
      
    }, 3000);
  }
});
