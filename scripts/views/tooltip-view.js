App.TooltipView = Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container'],
  attributeBindings: ['title','style', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'displayFlag'],
  dataHtml: false,
  placement: 'top',
  style: 'width:100%',
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
