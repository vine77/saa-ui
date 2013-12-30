App.ApplicationView = Ember.View.extend({
  tagName: 'div',
  classNames: ['application'],
  styleSidebar: function() {
    var docsIframe = $('#docs');
    docsIframe.contents().find('.sphinxsidebarwrapper').css({"overflow-y":"scroll", "overflow-x":"hidden", "position":"fixed", "width":"222px", "height":"770px"});
  },
  didInsertElement: function() {
    var self = this;
    $('#docs').load(function(){
      self.styleSidebar();
    });
    Ember.run.later(this, 'styleSidebar', 5000);
  }
});
