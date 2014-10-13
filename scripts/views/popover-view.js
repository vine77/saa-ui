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
  classNames: ['inline-block', 'tooltip-container'],
  tagName: 'div',
  attributeBindings: ['title', 'dataTrigger:data-trigger', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'dataContent:data-content', 'displayFlag', 'trigger'],
  toggle: false,
  dataTrigger: 'click',
  popoverContent: function() {
    var self = this;
    return function() {
      var $content = $('#' + self.get('elementId') + ' > ' + '.popover-content');
      return $content.html();
    }
  }.property('elementId'),

  mouseEnter: function (event) {
    if (this.get('dataTrigger') == 'hover') {
      $('#' + this.get('elementId')).popover({ container: 'body', html: true, content: this.get('popoverContent') }).popover('show');
    }
  },
  mouseLeave: function (event) {
    if (this.get('dataTrigger') == 'hover') {
      $('#' + this.get('elementId')).popover({ container: 'body', html: true, content: this.get('popoverContent') }).popover('hide');
    }
  },
  click: function(event) {
    if (this.get('dataTrigger') == 'click') {
      if (this.get('toggle')) {
        $('#' + this.get('elementId')).popover({ container: 'body', html: true, content: this.get('popoverContent') }).popover('hide');
        this.set('toggle', false);
      } else {
        $('#' + this.get('elementId')).popover({ container: 'body', html: true, content: this.get('popoverContent') }).popover('show');
        this.set('toggle', true);
      }
    }
  }
});

