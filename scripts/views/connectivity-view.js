App.ConnectivityView = Ember.View.extend({
  templateName: 'connectivity',
  didInsertElement: function () {
    var self = this;
    setInterval( function(){
      if(self.get('controller'))
        self.get('controller').check();
    }, 10000);
  }
});
