// Don't listen for events that aren't used
/*
Ember.EventDispatcher.reopen({
  events: {
    //touchstart  : 'touchStart',
    //touchmove   : 'touchMove',
    //touchend    : 'touchEnd',
    //touchcancel : 'touchCancel',
    keydown     : 'keyDown',
    keyup       : 'keyUp',
    keypress    : 'keyPress',
    mousedown   : 'mouseDown',
    mouseup     : 'mouseUp',
    contextmenu : 'contextMenu',
    click       : 'click',
    dblclick    : 'doubleClick',
    //mousemove   : 'mouseMove',
    focusin     : 'focusIn',
    focusout    : 'focusOut',
    //mouseenter  : 'mouseEnter',
    //mouseleave  : 'mouseLeave',
    submit      : 'submit',
    input       : 'input',
    change      : 'change',
    dragstart   : 'dragStart',
    drag        : 'drag',
    dragenter   : 'dragEnter',
    dragleave   : 'dragLeave',
    dragover    : 'dragOver',
    drop        : 'drop',
    dragend     : 'dragEnd'
  }
});
*/

App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  currentPath: '',
    UrlField:  Ember.TextField.extend({
    isValid: function () {
      return (/^((http|https):\/\/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|((http|https):\/\/(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))$/).test(this.get('value'));
    }.property('value'),
    isValidObserver: function () {
      if (this.get('isValid')) {
        $('#'+this.get('elementId')).closest('.control-group').removeClass('error');
        $('#'+'help-inline-'+this.get('elementId')).remove();
      } else {
        if ($('#'+'help-inline-'+this.get('elementId')).length) {
          $('#'+'help-inline-'+this.get('elementId')).html('This URL does not validate!');
        } else {
          $('#'+this.get('elementId')).after('<span class="help-inline" id="help-inline-'+this.get('elementId')+'"> This URL does not validate! </span>');
        }
        $('#'+this.get('elementId')).closest('.control-group').addClass('error');
      }
    }.observes('isValid', 'value'),
  })
});
