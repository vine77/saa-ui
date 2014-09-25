/**
* Popover View Usage Example
* This is a block helper so it can be used like so:
*
*    {{#view App.PopoverView title="Test Title"}}
*      Hover over me.
*      <div class="popover-content" style="display:none;">
*        This is the contention popover content. View Id: {{view.elementId}}
*      </div>
*   {{/view}}
*/

App.PopoverView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container'],
  attributeBindings: ['title', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'dataContent:data-content', 'displayFlag', 'trigger'],
  mouseEnter: function (event) {
    var self = this;
    $('#' + this.get('elementId')).popover({
      container: 'body',
      html: true,
      content: function() {
        var $content = $('#' + self.get('elementId') + ' > ' + '.popover-content');
        return $content.html();
      }
    }).popover('show');
  },
  mouseLeave: function (event) {
    $('#' + this.get('elementId')).popover('hide');
  },
  willDestroyElement: function () {
    $('#' + this.get('elementId')).popover('hide');
  }
});
