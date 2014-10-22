/**
* Popover View Usage Example
* This is a block helper so it can be used like so:
*
*    {{#view App.PopoverView title="Test Title"}}
*      Hover over me.
*      <div class="popover-content" style="display:none;">
*        This is the contention popover content. View Id: {{view.elementId}}
*     </div>
*  {{/view}}
*
* You may also specify the parameter dataTrigger as being 'hover', 'click' is default:
* {{#view App.PopoverView title="Test Title" dataTrigger="hover"}}
*
*/

App.PopoverView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container', 'popover-container'],
  tagName: 'div',
  attributeBindings: ['title', 'dataTrigger:data-trigger', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'dataContent:data-content', 'displayFlag', 'trigger', 'dataToggle:data-toggle'],
  toggle: false,
  dataTrigger: 'click',
  popoverContent: function() {
    var self = this;
    var $content = $('#' + self.get('elementId') + ' > ' + '.popover-content');
    return $content.html();
/*
      return function() {
        var $content = $('#' + self.get('elementId') + ' > ' + '.popover-content');
        console.log('content.html', $content.html());
        return $content.html();
      }
*/
  }.property('elementId'),
  popoverArguments: function() {
    return {
      container: 'body',
      html: true,
      trigger: 'manual',
      content: this.get('popoverContent'),
      template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">   </h3> <div class="popover-close"> <button type="button" class="close">×</button> </div> <div class="popover-content"><p></p></div></div></div>'
    }
  }.property('popoverContent', 'elementId'),
  mouseEnter: function (event) {
    if (this.get('dataTrigger') == 'hover') {
      $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('show');
      this.set('toggle', true);
    }
    if (this.get('dataTrigger') == 'mixed') {
        $('#' + this.get('elementId')).popover({
          container: 'body',
          html: true,
          content: this.get('popoverContent'),
          template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">   </h3> <div class="popover-close"> <button type="button" class="close">×</button> </div> <div class="popover-content"><p></p></div></div></div>'
        }).popover('show');
      this.set('toggle', true);
    }
  },
  mouseLeave: function (event) {
    if (this.get('dataTrigger') == 'hover') {
      $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('hide');
      this.set('toggle', false);
    }
  },
  click: function(event) {
    if (this.get('dataTrigger') == 'click') {
      if (this.get('toggle')) {
        $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('hide');
        this.set('toggle', false);
      } else {
        $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('show');
        this.set('toggle', true);
      }
    }
    if (this.get('dataTrigger') == 'mixed') {
      $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('hide');
      this.set('toggle', false);
    }
  },
  reloadObserver: function(event) {
    if (this.get('toggle')) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        $('#' + this.get('elementId')).popover(this.get('popoverArguments')).popover('show');
      });
    }
  }.observes('controller.vcpus')
});

$('body').on('click', function (e) {
  if (!$(e.target).hasClass('popover-content') && !($(e.target).parents().hasClass('popover-content')) ) {
    var isVisible = $('.popover-container').is(":visible");
    if (isVisible) {
      $('.popover-container').popover('hide');
    }
  }
});

$('.popover-close').on('click', function (e) {
  if (!$(e.target).hasClass('popover-content')) {
      var isVisible = $('.popover-container').is(":visible");
      if (isVisible) {
        $('.popover-container').popover('hide');
      }
  }
});



