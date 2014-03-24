App.LogBarController = Ember.ObjectController.extend({
  needs: ['nodes', 'application', 'vms', 'criticalities', 'logcategories', 'build', 'statuses'],
  isSettingEach: false,
  kibanaFieldIds: {nodes: null, vms: null, criticalities: null, logcategories: null},
  kibanaNodesQuery: [],
  kibanaVmsQuery: [],
  kibanaCriticalitiesQuery: [],
  kibanaLogcategoriesQuery: [],
  logsUrl: Ember.computed.alias('controllers.application.logsUrl'),
  isGraphicalMode: false,

  timeFilterId: null,
  timeFilterReset: function () {
    var filterSrv = frames['allLogsFrame'].angular.element('[ng-controller="filtering"]').scope().filterSrv;
    var dashboard = frames['allLogsFrame'].angular.element('body').scope().dashboard;

    if (filterSrv.idsByType('time').length > 0) {
      filterSrv.idsByType('time').forEach( function(item, index, enumerable) {
        filterSrv.remove(item);
      });
    }

    var newFieldId = filterSrv.set({
      type: 'time',
      from: moment.utc().subtract('days', 1).toDate(),
      to: moment.utc(moment.utc(Date.now()).toDate()).toDate(),
      field: '@timestamp'
    });

    this.set('timeFilterId', newFieldId);
    dashboard.refresh();

  },

  nodesAreAvailable: function() {
    if (this.get('controllers.nodes.length') > 0) {
      return true;
    } else {
      return false;
    }
  }.property('controllers.nodes.model.@each'),

  nodeSelected: null,
  selectListNodes: function() {
    var returnArray = [];
    returnArray.pushObject({value:"ipm", label:this.get('controllers.build.hostname')});
    this.get('controllers.nodes').forEach( function (item, index, enumerable) {
      var nodeObj = {"value": item.get('id'), "label": item.get('name')};
      returnArray.pushObject(nodeObj);
    });
    returnArray.pushObject({value:"context", label:"Multiple Selections"});
    return returnArray;
  }.property('controllers.nodes.model.@each'),
  selectListNodesObserver: function () {
    var nodeSelected = this.get('nodeSelected');
    if (nodeSelected) {
      if (nodeSelected.value !== "context") {
        this.set('isSettingEach', true);
        this.get('controllers.nodes').setEach('isSelected', false);
        var selectedNode = this.get('controllers.nodes').findBy('id', nodeSelected.value);
        if (selectedNode) selectedNode.set('isSelected', true);
        this.set('isSettingEach', false);
      }
    }
  }.observes('nodeSelected'),
  nodesMultipleObserver: function() {
    var nodesSelected = this.get('controllers.nodes').filterProperty('isSelected', true);
    if ((nodesSelected.length > 1) && (!this.get('isSettingEach'))) {
      this.set('nodeSelected', this.get('selectListNodes.lastObject'));
    }
  }.observes('controllers.nodes.@each.isSelected'),

  criticalitySelected: null,

  cleanedUpCriticalities: function () {
    var cleanedUpCriticalities = ['Warning+', 'Error+', 'Multiple Selections'];
    var returnArray = [];

    this.get('controllers.criticalities').forEach( function(item, index, enumerable) {
      var inArray = $.inArray(item.get('label'), cleanedUpCriticalities);
      if (inArray !== -1) {
        returnArray.push(item);
      }
    });
    return returnArray;
  }.property('controllers.criticalities.model.@each'),

  criticalitiesFiltered: function() {
    var returnArray = [];
    this.get('controllers.criticalities').forEach( function (item, index, enumerable) {
      if ((App.isCriticalityPlus(item) == false) && (item.get('id') != 'context')) {
        returnArray.push(item);
      }
    });
    return returnArray;
  }.property('controllers.criticalities'),

  selectedCriticalities: function() {
    return this.get('controllers.criticalities').filterProperty('isSelected', true);
  }.property('controllers.criticalities.model.@each'),


  selectListCriticalities: function() {
    return this.get('controllers.criticalities');
  }.property('controllers.criticalities.model.@each'),

  selectListCriticalitiesObserver: function () {
    var criticalitySelected = this.get('criticalitySelected');
    if (criticalitySelected) {
      if (this.get('criticalitySelected.id') !== "context") {
        this.set('isSettingEach', true);
        this.get('controllers.criticalities').setEach('isSelected', false);
        if (App.isCriticalityPlus(criticalitySelected)) {
          this.get('controllers.criticalities').forEach(function(item, index, enumerable) {
            //previous item, should be current criticality without +
            nonPlusCriticalitySelected = criticalitySelected.get('id') - 1;
            if ((index >= criticalitySelected.get('id')) || (index == nonPlusCriticalitySelected)) {
              item.set('isSelected', true);
            }
          });
        } else {
          this.get('controllers.criticalities').findBy('id', this.get('criticalitySelected.id')).set('isSelected', true);
        }
        this.set('isSettingEach', false);
      }
    }
  }.observes('criticalitySelected'),

  criticalitiesMultipleObserver: function() {
     var criticalitiesSelected = this.get('controllers.criticalities').filterProperty('isSelected', true);
    if ((criticalitiesSelected.length > 1) && (!this.get('isSettingEach'))) {
      //this.set('criticalitySelected', this.get('selectListCriticalities.lastObject'));
      this.set('criticalitySelected', this.get('cleanedUpCriticalities.lastObject'));
    }
  }.observes('controllers.criticalities.@each.isSelected'),





  reset: function () {
    this.get('controllers.criticalities').setEach('isSelected', false);
    this.get('controllers.nodes').setEach('isSelected', false);
    this.get('controllers.vms').setEach('isSelected', false);
    this.get('controllers.logcategories').setEach('isSelected', false);

    this.set('nodeSelected', null);
    this.set('criticalitySelected', null);

    this.timeFilterReset();
  },
  advancedSearch: function (model) {
    var controller = this;
    modal = Ember.View.create({
      templateName: "logAdvancedSearch-modal",
      controller: controller,
      content: model,
      modalHide: function() {
        $('#advanced-search-modal').modal('hide');
        var context = this;
        //setTimeout(context.remove, 3000);
        this.remove(); //destroys the element
      },
      didInsertElement: function () {
        $('#advanced-search-modal').modal('show');
      }
    }).appendTo('body');
  },

  actions: {
    graphicalMode: function(value) {
      if (value) {
        this.reset();
        this.set('controllers.application.logsUrl', '/kibana3/index.html#/dashboard/file/logs-graphical.json');
        this.set('isGraphicalMode', true);
        
      } else {
        this.reset();
        this.set('controllers.application.logsUrl', '/kibana3/index.html#/dashboard/file/logs.json');
        this.set('isGraphicalMode', false);

      }
    }
  }
});

