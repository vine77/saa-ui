App.TooltipRightView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container'],
  attributeBindings: ['title', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement'],
  dataHtml: 'true',
  mouseEnter: function (event) {
    $('#' + this.get('elementId')).tooltip({container: 'body', placement: 'right'}).tooltip('fixTitle').tooltip('show');
  },
  mouseLeave: function (event) {
    $('#' + this.get('elementId')).tooltip('hide');
  },
  willDestroyElement: function () {
    $('#' + this.get('elementId')).tooltip('hide');
  }
});
