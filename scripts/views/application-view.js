App.ApplicationView = Ember.View.extend({
  tagName: 'div',
  classNames: ['application'],
  classNameBindings: ['controller.isFramed'],
  styleSidebar: function() {
    var docsIframe = $('#docs');
    docsIframe.contents().find('.sphinxsidebarwrapper').css({"overflow-y":"scroll", "overflow-x":"hidden", "position":"fixed", "width":"222px", "height":"770px"});
    var self = this;
    $('#docs').load(function(){
      self.styleSidebar();
    });
  },
  didInsertElement: function() {
    var self = this;
    $('#docs').load(function(){
      setTimeout(function() {
        self.styleSidebar();
      }, 2000);
    });
    Ember.run.later(this, 'styleSidebar', 8000);
  }
});
