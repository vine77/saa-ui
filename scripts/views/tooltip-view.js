App.TooltipView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container'],
  attributeBindings: ['title', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'displayFlag'],
  dataHtml: false,
  placement: 'top',
  mouseEnter: function (event) {
    $('#' + this.get('elementId')).tooltip({container: 'body', placement: this.get('placement')}).tooltip('fixTitle').tooltip('show');
  },
  mouseLeave: function (event) {
    $('#' + this.get('elementId')).tooltip('hide');
  },
  willDestroyElement: function () {
    $('#' + this.get('elementId')).tooltip('hide');
  }
});
