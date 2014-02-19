App.DashboardVmMetricsController = Ember.Controller.extend({
  needs: ['vms', 'nodes'],
  totalNumberOfVms: function() {
    return this.get('controllers.vms.length');
  }.property('controllers.vms.@each'),

  totalVcpusPercent: function() {
    return Math.round(100 * parseFloat(this.get('controllers.nodes.totalVcpus')) / parseFloat(this.get('controllers.nodes.maxVcpus')));
  }.property('controllers.nodes.@each.vcpus'),
  isTotalVcpusPercentAvailable: function () {
    if (isNaN(this.get('totalVcpusPercent'))) {
      return false;
    } else {
      return true;
    }
  }.property('totalVcpusPercent'),

  totalCurrentSu: function() {
    return this.get('controllers.vms').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('utilization.su_current') > 0) ? item.get('utilization.su_current') : 0;
      return previousValue + count;
    }, 0);
  }.property('controllers.vms.@each.utilization'),
  totalSuCeiling: function() {
    return this.get('controllers.vms').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('suCeiling') > 0) ? parseFloat(item.get('suCeiling')) : 0;
      return previousValue + count;
    }, 0);
  }.property('controllers.vms.@each.suCeiling'),
  totalCurrentContention: function() {
    return 100 * parseFloat(this.get('totalCurrentSu')) / parseFloat(this.get('totalSuCeiling'));
  }.property('totalSuCeiling', 'totalCurrentSU'),
  totalCurrentContentionWidth: function() {
    return 'width:'+this.get('totalCurrentContention')+'%';
  }.property('totalCurrentContention'),

  numberOfTrusted: function() {
    return this.get('controllers.vms').filterBy('status.trust', 2).get('length');
  }.property('controllers.vms.@each'),
  percentOfTrusted: function () {
    return Math.round(100 * parseFloat(this.get('numberOfTrusted')) / parseFloat(this.get('totalNumberOfVms')));
  }.property('totalNumberOfVms', 'numberOfTrusted'),
  percentOfTrustedWidth: function () {
    return 'width:'+this.get('percentOfTrusted')+'%';
  }.property('totalNumberOfVms', 'numberOfTrusted'),
  totalTrustedMessage: function() {
    return this.get('numberOfTrusted') + ' / ' + this.get('totalNumberOfVms');
  }.property('numberOfTrusted', 'totalNumberOfVms'),
  isPercentOfTrustedAvailable: function () {
    if (isNaN(this.get('percentOfTrusted')) && (App.mtWilson.get('isSupported')) ) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfTrusted'),

  numberOfVictims: function () {
    return this.get('controllers.vms').filterBy('isVictim').get('length');
  }.property('controllers.vms.@each'),
  percentOfVictims: function () {
    return Math.round(100 * parseFloat(this.get('numberOfVictims')) / parseFloat(this.get('totalNumberOfVms')));
  }.property('totalNumberOfVms', 'numberOfVictims'),
  percentOfVictimsWidth: function () {
    return 'width:'+this.get('percentOfVictims')+'%';
  }.property('totalNumberOfVms', 'numberOfTrusted'),
  totalVictimsMessage: function() {
    return this.get('numberOfVictims') + ' / ' + this.get('totalNumberOfVms');
  }.property('numberOfVictims', 'totalNumberOfVms'),
  isPercentOfVictimsAvailable: function () {
    if (isNaN(this.get('percentOfVictims'))) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfVictims'),

  numberOfAggressors: function () {
    return this.get('controllers.vms').filterBy('isAggressor').get('length');
  }.property('controllers.vms.@each'),
  percentOfAggressors: function () {
    return Math.round(100 * parseFloat(this.get('numberOfAggressors')) / parseFloat(this.get('totalNumberOfVms')));
  }.property('totalNumberOfVms', 'numberOfAggressors'),
  percentOfAggressorsWidth: function () {
    return 'width:'+this.get('percentOfAggressors')+'%';
  }.property('totalNumberOfVms', 'numberOfAggressors'),
  totalAggressorsMessage: function() {
    return this.get('numberOfAggressors') + ' / ' + this.get('totalNumberOfVms');
  }.property('numberOfAggressors', 'totalNumberOfVms'),
  isPercentOfAggressorsAvailable: function () {
    if (isNaN(this.get('percentOfAggressors'))) {
      return false;
    } else {
      return true;
    }
  }.property('percentOfAggressors'),

  contentionVms: function() {
    return Ember.ArrayController.create({
      content: this.get('controllers.vms').filterBy('hasContention').toArray(),
      sortProperties: ['contention.system.llc.value'],
      sortAscending: false
    }).slice(0, 4);
  }.property('controllers.vms.@each'),
  contentionVmsExist: Ember.computed.gt('contentionVms.length', 0)

});
