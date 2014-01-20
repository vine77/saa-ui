// Don't listen for events that aren't used
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

App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  currentPath: ''
});
