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
  classNameBindings: ['customId'],
  tagName: 'div',
  attributeBindings: ['title', 'dataTrigger:data-trigger', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'dataContent:data-content', 'displayFlag', 'trigger', 'dataToggle:data-toggle'],
  toggle: false,
  dataTrigger: 'click',
  popoverContent: function() {
    var self = this;
    var $content = $('.' + self.get('customId') + ' > ' + '.popover-content');
    return $content.html();
/*
      return function() {
        var $content = $('#' + self.get('elementId') + ' > ' + '.popover-content');
        console.log('content.html', $content.html());
        return $content.html();
      }
*/
  }.property('customId', 'toggle'),
  popoverArguments: function() {
    return {
      container: 'body',
      html: true,
      trigger: 'manual',
      content: this.get('popoverContent'),
      template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">   </h3> <div class="popover-close"> <button type="button" class="close">×</button> </div> <div class="popover-content"><p></p></div></div></div>'
    }
  }.property('popoverContent', 'customId'),
  mouseEnter: function (event) {
    var self = this;
    if(!$('.popover').is(':visible')) {
      $('.' + this.get('customId')).popover(this.get('popoverArguments')).popover('show');
    }
    $('.popover-close').on('click', function (e) {
      $(".popover").remove();
    });

    $('.popover').on('mouseleave', function (e) {
      var isHovered = !!$('.'+self.get('customId')).filter(function() { return $(this).is(":hover"); }).length;
      if (!isHovered) {
        $(".popover").remove();
      }
    });
  },
  mouseLeave: function(event) {
    if (!$('.popover:hover').length > 0) {
      $(".popover").remove();
    }
  },
  reloadObserver: function(event) {
    if (this.get('toggle')) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        $('.' + this.get('customId')).popover(this.get('popoverArguments')).popover('show');
      });
    }
  }.observes('controller.vcpus'),
  init: function() {
    this.set('customId', App.uuid());
    var self = this;

    Ember.run.schedule('afterRender', this, function() {
      $('body').on('click', function (e) {
        if (!$(e.target).hasClass('popover-content') && !($(e.target).parents().hasClass('popover-content')) ) {
          $('.' + self.get('customId')).popover(self.get('popoverArguments')).popover('hide');
        }
      });
    });

    this._super();
  }
});


App.PopoverContentView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container', 'popover-container'],
  templateName: 'popover-content',
  parentSelector: '',
  placement: 'right',
  customHandleId: null,
  didInsertElement: function () {
    var self = this;
    $('.'+self.get('customHandleId')).popover({
        html: true,
        title: self.title,
        placement: self.get('placement'),
        trigger: 'manual',
        content: function() {
          var $content = $('#popover-content');
          return $content.html();
        }
    }).popover('show');
  }
});

App.PopoverHandleView = Ember.View.extend({
  classNames: ['inline-block'],
  placement: 'right',
  handleTemplateName: 'popover-content',
  customHandleId: null,
  testController: null,
  mouseEnter: function() {
    var self = this;
    if(!$('.popover').is(':visible')) {
      var view = App.PopoverContentView.create({});
      view.set("context", this.get("context"));
      view.set('customHandleId', self.get('customHandleId'));
      view.set('placement', self.get('placement'));
      view.set('templateName', self.get('handleTemplateName'));
      view.set('testController', self.get('testController'))
      this.get("popover-container").pushObject(view);
    }
  },
  mouseLeave: function() {
    this.get('popover-container').removeAllChildren();
    $(".popover").remove();
  },
  init: function() {
    this._super();
    this.set('customHandleId', App.uuid());
  }
});


App.PopoverContentView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container', 'popover-container'],
  templateName: 'popover-content',
  parentSelector: '',
  placement: 'right',
  customHandleId: null,
  didInsertElement: function () {
    var self = this;
    $('.'+self.get('customHandleId')).popover({
        html: true,
        title: self.title,
        placement: self.get('placement'),
        trigger: 'manual',
        content: function() {
          var $content = $('#popover-content');
          return $content.html();
        }
    }).popover('show');
  }
});

App.PopoverHandleView = Ember.View.extend({
  classNames: ['inline-block'],
  placement: 'right',
  handleTemplateName: 'popover-content',
  customHandleId: null,
  testController: null,
  mouseEnter: function() {
    var self = this;
    if(!$('.popover').is(':visible')) {
      var view = App.PopoverContentView.create({});
      view.set("context", this.get("context"));
      view.set('customHandleId', self.get('customHandleId'));
      view.set('placement', self.get('placement'));
      view.set('templateName', self.get('handleTemplateName'));
      view.set('testController', self.get('testController'))
      this.get("popover-container").pushObject(view);
    }
  },
  mouseLeave: function() {
    this.get('popover-container').removeAllChildren();
    $(".popover").remove();
  },
  init: function() {
    this._super();
    this.set('customHandleId', App.uuid());
  }
});
