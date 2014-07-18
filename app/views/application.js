import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'div',
  classNames: ['application'],
  classNameBindings: ['controller.isFramed'],
  styleSidebar: function() {
    var docsIframe = Ember.$('#docs');
    docsIframe.contents().find('.sphinxsidebarwrapper').css({"overflow-y":"scroll", "overflow-x":"hidden", "position":"fixed", "width":"222px", "height":"770px"});
    var self = this;
    Ember.$('#docs').load(function(){
      self.styleSidebar();
    });
  },
  didInsertElement: function() {
    var self = this;
    Ember.$('#docs').load(function(){
      setTimeout(function() {
        self.styleSidebar();
      }, 2000);
    });
    Ember.run.later(this, 'styleSidebar', 8000);
  }
});
