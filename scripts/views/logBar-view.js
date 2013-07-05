App.LogBarView = Ember.View.extend({
  templateName: 'logBar-view',
  didInsertElement: function () {
    //set default values for select list
    //App.logBar.set('shortCutTimeSelected', App.logBar.shortCutTimes.objectAt(7));
    this.get('controller').set('shortCutTimeSelected', this.get('controller').shortCutTimes.objectAt(7));
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
        /*frames['allLogsFrame'].$('#sidebar').remove();
        frames['allLogsFrame'].$('#sbctl').css('display', 'none');

        frames['allLogsFrame'].$('#feedlinks').css('display', 'none');
        frames['allLogsFrame'].$('.form-inline').css('display', 'none');
        frames['allLogsFrame'].$('.navbar-fixed-top').css('left', '2000px');
        frames['allLogsFrame'].$('#graph_container').css('position', 'relative');
        frames['allLogsFrame'].$('#graph_container').css('top', '-50px');

        frames['allLogsFrame'].$('#main').addClass("content span12 sidebar-collapsed");
        frames['allLogsFrame'].$('#main').removeClass("span10");
        frames['allLogsFrame'].$(window).resize();
        frames['allLogsFrame'].$('#graph_container').resize();*/
        

        frames['allLogsFrame'].sbctl('hide', true);
      } catch(error) {
        // Kibana is not loaded in iFrame
      }
      
    }, 3000);
  }
});
