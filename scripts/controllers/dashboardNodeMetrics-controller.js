App.DashboardNodeMetricsController = Ember.Controller.extend({
  needs: ['vms', 'nodes'],
  totalNumberOfNodes: function() {
    return this.get('controllers.nodes.length');
  }.property('controllers.nodes.@each'),

  numberOfTrusted: function() {
    return this.get('controllers.nodes').filterBy('status.trust_status.trust', 2).get('length');
  }.property('controllers.nodes.@each'),
  percentOfTrusted: function () {
    return Math.round(100 * parseFloat(this.get('numberOfTrusted')) / parseFloat(this.get('totalNumberOfNodes')));
  }.property('totalNumberOfNodes', 'numberOfTrusted'),
  percentOfTrustedWidth: function () {
    return 'width:'+this.get('percentOfTrusted')+'%';
  }.property('totalNumberOfNodes', 'numberOfTrusted'),
  totalTrustedMessage: function() {
    return this.get('numberOfTrusted') + ' / ' + this.get('totalNumberOfNodes');
  }.property('numberOfTrusted', 'totalNumberOfNodes'),
  isPercentOfTrustedAvailable: function () {
    if (isNaN(this.get('percentOfTrusted'))) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfTrusted'),

  numberOfControlled: function () {
    return this.get('controllers.nodes').filterBy('isAgentInstalled').get('length');
  }.property('controllers.nodes.@each'),
  percentOfControlled: function () {
    return Math.round(100 * parseFloat(this.get('numberOfControlled')) / parseFloat(this.get('totalNumberOfNodes')));
  }.property('totalNumberOfNodes', 'numberOfControlled'),
  percentOfControlledWidth: function () {
    return 'width:'+this.get('percentOfControlled')+'%';
  }.property('totalNumberOfNodes', 'numberOfnumberOfControlled'),
  totalControlledMessage: function() {
    return this.get('numberOfControlled') + ' / ' + this.get('totalNumberOfNodes');
  }.property('numberOfControlled', 'totalNumberOfNodes'),
  isPercentOfControlledAvailable: function() {
    if (isNaN(this.get('percentOfControlled'))) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfControlled'),

  isPercentOfRamAvailable: function () {
    if (isNaN(this.get('controllers.nodes.percentOfRam'))) {
      return false;
    } else {
      return true;
    }
  }.property('controllers.nodes.percentOfRam'),

  totalCurrentSu: function() {
    return this.get('controllers.nodes').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('utilization.scus.total.current') > 0) ? item.get('utilization.scus.total.current') : 0;
      return previousValue + count;
    }, 0);
  }.property('controllers.nodes.@each.utilization'),
  totalSuMax: function() {
    var totalSuMax = this.get('controllers.nodes').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('utilization.scus.total.max') > 0) ? parseFloat(item.get('utilization.scus.total.max')) : 0;
      return previousValue + count;
    }, 0);
    return Math.round(totalSuMax);
  }.property('controllers.nodes.@each.suCeiling'),
  usedOfAvailableSuPercent: function() {
    return Math.round(100 * parseFloat(this.get('totalCurrentSu')) / parseFloat(this.get('totalSuMax')));
  }.property('totalSuCeiling', 'totalCurrentSu'),
  usedOfAvailableSuWidth: function() {
     return 'width:'+this.get('usedOfAvailableSuPercent')+'%';
  }.property('usedOfAvailableSuPercent'),
  usedOfAvailableSuMessage: function() {
    return this.get('totalCurrentSu') + ' / ' + this.get('totalSuMax') + ' SCU';
  }.property('numberOfControlled', 'totalSuMax'),
  isUsedOfAvailableSuPercentAvailable: function () {
    if (isNaN(this.get('usedOfAvailableSuPercent'))) {
      return false;
    } else {
      return true;
    }
  }.property('controllers.nodes.percentOfRam'),

  contentionNodes: function() {
    return Ember.ArrayController.create({
      content: this.get('controllers.nodes').filterBy('hasContention').toArray(),
      sortProperties: ['contention.system.llc.value'],
      sortAscending: false
    }).slice(0, 4);
  }.property('controllers.nodes.@each'),
  contentionNodesExist: Ember.computed.gt('contentionNodes.length', 0)

});
