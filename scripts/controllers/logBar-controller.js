App.CriticalitiesController = Ember.ArrayController.extend({
    content: [{"id": 0,  "label":"Debug"},
              {"id": 3,  "label":"Notice+"},
              {"id": 4,  "label":"Warning"},
              {"id": 5,  "label":"Warning+"},
              {"id": 6,  "label":"Error"},
              {"id": 8,  "label":"Critical"},
              {"id": "context", "label":"Multiple Selections"}]
});

App.CriticalityController = Ember.ObjectController.extend({
  isSelectedObserver: function() {
    if (this.get('isSelected')) {
      App.currentSelections.get('selectedCriticalities').addObject(this);
    } else {
      App.currentSelections.get('selectedCriticalities').removeObject(this);
    }
    App.currentSelections.propertyDidChange('selectedCriticalities');
  }.observes('isSelected')
});

App.LogCategoriesController = Ember.ArrayController.extend({
  content: App.definitions.logs.categories
});

App.LogCategoryController = Ember.ObjectController.extend({
  isSelectedObserver: function() {
    if (this.get('isSelected')) {
      App.currentSelections.get('selectedLogCategories').addObject(this);
    } else {
      App.currentSelections.get('selectedLogCategories').removeObject(this);
    }
    App.currentSelections.propertyDidChange('selectedLogCategories');
  }.observes('isSelected')
});

App.LogBarController = Ember.ObjectController.extend({
  shortCutTimes: [{"id": 1, "label":"Last 15min"}, 
                  {"id":2,  "label":"Last 60min"},
                  {"id":3,  "label":"Last 4h"},
                  {"id":4,  "label":"Last 12h"},
                  {"id":5,  "label":"Last 24h"},
                  {"id":6,  "label":"Last 48h"},
                  {"id":7,  "label":"Last 7d"},
                  {"id":8,  "label":"All Time"},
                  {"id":9,  "label":"Custom"}],
  criticalities: App.CriticalitiesController.create(),
  criticalitiesFiltered: function () {
    var returnArray = [];
    this.get('criticalities').forEach( function (item, index, enumerable) {
      //if ((App.isOdd(item.id) == false) && (item.id != 'context')) {
      if ((App.isCriticalityPlus(item) == false) && (item.id != 'context')) {
        returnArray.push(item);
      }
    });
    return returnArray;
  }.property('criticalities'),
  logCategories: App.LogCategoriesController.create(),
  criticalitySelected: null,
  shortCutTimeSelected: null,
  searchText: '',
  nodeSelected: '',
  timeFrom: '',
  timeTo: '',
  selectedNodes: [],
  selectedVms: [],
  selectedCriticalities: [],
  selectedLogCategories: [],
  selectedNodesBinding: 'App.currentSelections.selectedNodes',
  selectedVmsBinding: 'App.currentSelections.selectedVms',
  selectedCriticalitiesBinding: 'App.currentSelections.selectedCriticalities',
  selectedLogCategoriesBinding: 'App.currentSelections.selectedLogCategories',
  needs: ["nodes", "application", "vms"],
  logsUrl: function () {
    return this.get('controllers.application.logsUrl');
  }.property('controllers.application'),
  nodes: function() {
    var returnArray = [];
    returnArray.pushObject({value:"ipm", label:App.build.get('hostname')});
    App.Node.all().forEach( function (item, index, enumerable) {
      var nodeObj = {"value": item.get('id'), "label": item.get('name')};
      returnArray.pushObject(nodeObj);
    });
    returnArray.pushObject({value:"context", label:"Multiple Selections"});
    return returnArray;
  }.property('controllers.nodes.model.@each'),
  nodesMultipleObserver: function() {
    if (this.get('selectedNodes').length > 0) {
      this.set('nodeSelected', this.get('nodes.lastObject'));
    }
  }.observes('controllers.nodes.model.@each.isSelected', 'App.currentSelections.selectedNodes', 'controllers.nodes.model.@each'),
  criticalitiesMultipleObserver: function() {
    if (this.get('selectedCriticalities').length > 0) {
      this.set('criticalitySelected', this.get('criticalities.lastObject'));
    }
  }.observes('selectedCriticalities.@each.isSelected'),
  nodeSelectedObserver: function () {
    var nodeSelected = this.get('nodeSelected');
    if (nodeSelected) {
      if (nodeSelected.value !== "context") {
        this.set('selectedNodes', []);
        App.Node.all().forEach( function (item, index, enumerable) {
          if (item.get('isSelected')) {
            item.set('isSelected', false);
          }
        });
      }
    }
  }.observes('nodeSelected'),
  criticalitySelectedObserver: function () {
    var criticalitySelected = this.get('criticalitySelected');
    if (criticalitySelected) {
      if (criticalitySelected.id !== "context") {
        this.set('selectedCriticalities', []);
        this.get('selectedCriticalities').forEach( function (item, index, enumerable) {
          if (item.get('isSelected')) {
            item.set('isSelected', false);
          }
        });
      }
    }
  }.observes('criticalitySelected'),
  nodeObjects: function() {
    return App.Node.all();
  }.property('controllers.nodes.model.@each'),
  vmObjects: function() {
    return App.Vm.all();
  }.property('controllers.vms.model.@each'),
  logCategoryObjects: function () {
    return App.definitions.logs.categories;
  }.property(''),
  timeSelectionChanged: function() {
    if (this.get('shortCutTimeSelected.label') !== 'Custom' && (this.get('timeTo') || this.get('timeFrom'))) {
      this.set('shortCutTimeSelected', this.shortCutTimes.objectAt(8)); 
    }
  }.observes('timeTo', 'timeFrom'),
  shortCutTimeSelectionChanged: function()  {
    if (this.get('shortCutTimeSelected.label') !== 'Custom' && (this.get('timeTo') || this.get('timeFrom'))) {
      this.set('timeFrom', null);
      this.set('timeTo', null);
    }
  }.observes('shortCutTimeSelected','timeTo', 'timeFrom'),
  searchTextQuery: function () { //composed of :text search, node, and criticality
    var returnVal = [];
    //Text search
    if (this.get('searchText')) {
      returnVal.push(this.get('searchText'));
    }
    //Node
    if (this.get('nodeSelected.value') == 'context') { //using advanced search or multiple global selections
      var nodesReturnArray = [];
      this.get('selectedNodes').forEach(function (item, index, enumerable) {
        var nodeString = '@fields.host_id:\"' + item.get('id') + '\"';
        nodesReturnArray.push(nodeString);
      });
      if (nodesReturnArray.length > 0) { returnVal.push('(' + nodesReturnArray.join(' OR ') + ')'); }
    } else { //using select list in log bar
      if (this.get('nodeSelected.value') == 'ipm') {
        var nodeString = '@source_host:\"' + this.get('nodeSelected.label') + '\"';
        returnVal.push(nodeString);
      } else if (this.get('nodeSelected.value') && this.get('nodeSelected.value') != 'context') {
        var nodeString = '@fields.host_id:\"' + this.get('nodeSelected.value') + '\"';
        returnVal.push(nodeString);
      }
    }

    //Criticality @fields.syslog_severity_code
    //var criticalitySelected = this.get('criticalitySelected');
    //var criticalitySelectedgetid = this.get('criticalitySelected.id');
    //console.log('criticalitySelected:', criticalitySelected);
    //console.log('criticalitySelected.getid', criticalitySelectedgetid);

    if (this.get('criticalitySelected.id') == 'context') { //using advanced search or multiple global selections
      var criticalitiesReturnArray = [];
      this.get('selectedCriticalities').forEach( function (item, index, enumerable) {
        var criticalityString = '@fields.syslog_severity:\"' + item.get('label') + '\"';
        criticalitiesReturnArray.push(criticalityString);
      });
      returnVal.push('(' + criticalitiesReturnArray.join(' OR ') + ')');
    } else { //select list in logbar
      if (this.get('criticalitySelected.label')) {
        //if (App.isOdd(this.get('criticalitySelected.id'))) {
        if (App.isCriticalityPlus(this.get('criticalitySelected'))) {
          var currentIndex = this.get('criticalitySelected.id');
          var criticalitiesReturnArray = [];
          var criticalityString = '@fields.syslog_severity:\"' + this.get('criticalitySelected.label') + '\"';
          criticalitiesReturnArray.push(criticalityString);
          this.get('criticalities').forEach( function(item, index, enumerable) {
            //if ( (index >= currentIndex) && (App.isOdd(index) === false) ) {
            if ( (index >= currentIndex) && (App.isCriticalityPlus(item) === false) ) {
              var criticalityString = '@fields.syslog_severity:\"' + item.label + '\"';
              criticalitiesReturnArray.push(criticalityString);
            }
          });
          returnVal.push('(' + criticalitiesReturnArray.join(' OR ') + ')');
        } else {
          var criticalityString = '@fields.syslog_severity:\"' + this.get('criticalitySelected.label') + '\"';
          returnVal.push(criticalityString);
        }
      }
    }
    //Vms
    if (this.get('selectedVms').length > 0) { //using advanced search or multiple global selections
      if (this.get('selectedVms')) {
        vmsReturnArray = [];
        this.get('selectedVms').forEach(function (item, index, enumerable) {
          var vmString = '@fields.vm_id:\"' + item.get('id') + '\"';
          vmsReturnArray.push(vmString);
        });
        returnVal.push('(' + vmsReturnArray.join(' OR ') + ')');
      }
    }

    //Log Categories
    if (this.get('selectedLogCategories').length > 0) { //using advanced search or multiple global selections
      if (this.get('selectedLogCategories')) {
        var returnArray = [];
        this.get('selectedLogCategories').forEach(function (item, index, enumerable) {
          var returnString = '@fields.category:\"' + item.get('label') + '\"';
          returnArray.push(returnString);
        });
        returnVal.push('(' + returnArray.join(' OR ') + ')');
      }
    }

    return returnVal.join(' AND ');
  }.property('searchText', 'nodeSelected', 'criticalitySelected', 'selectedNodes.@each','App.Node.@each','selectedCriticalities.@each', 'selectedLogCategories.@each'),
  updateLogsFrame: function() {
    var currentURL = frames['allLogsFrame'].location.href;
    currentURL = currentURL.split("#");
    currentURL = atob(currentURL[1]);
    currentURL = jQuery.parseJSON(currentURL);
    var newURL = currentURL;

    //Time
    if (this.get('shortCutTimeSelected.label') == 'Custom') {
      newURL['timeframe'] = 'custom';
      if (this.get('timeFrom') !== "") { newURL.time.from = moment(this.get('timeFrom')).format(); }
      if (this.get('timeTo') !== "") { newURL.time.to = moment(this.get('timeTo')).format(); }
     // if ((this.get('timeFrom')) == "" && (this.get('timeTo') == "")) { delete newURL.time; } 
    } else {
       newURL['timeframe'] = App.logTimeToSeconds(this.get('shortCutTimeSelected.label'));
       //console.log('App.logTimetoSeconds:' + App.logTimeToSeconds(this.get('shortCutTimeSelected.value')));
       //console.log('shortCutTimeSelected.value:' + this.get('shortCutTimeSelected.value'));
    }
    //Search Text Query (node, criticality, and search text)
    newURL['search'] = this.get('searchTextQuery');
    newURL = JSON.stringify(newURL);
    newURL = btoa(newURL);

    frames['allLogsFrame'].location.href = 'kibana/#' + newURL;
  },
  reset: function () {

    //var defaultQueryString = 'eyJzZWFyY2giOiIoQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHk6XCJXYXJuaW5nK1wiIE9SIEBmaWVsZHMuc3lzbG9nX3NldmVyaXR5OlwiRXJyb3JcIiBPUiBAZmllbGRzLnN5c2xvZ19zZXZlcml0eTpcIkNyaXRpY2FsXCIpIiwiZmllbGRzIjpbIkBzb3VyY2VfaG9zdCIsIkBtZXNzYWdlIiwiQGZpZWxkcy5zeXNsb2dfcHJvZ3JhbSIsIkBmaWVsZHMuc3lzbG9nX3NldmVyaXR5Il0sIm9mZnNldCI6MCwidGltZWZyYW1lIjoiYWxsIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM2ODgyODA0ODYzMX0=';
    var defaultQueryString = 'eyJzZWFyY2giOiIoQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHk6XCJXYXJuaW5nK1wiIE9SIEBmaWVsZHMuc3lzbG9nX3NldmVyaXR5OlwiRXJyb3JcIiBPUiBAZmllbGRzLnN5c2xvZ19zZXZlcml0eTpcIkNyaXRpY2FsXCIpIiwiZmllbGRzIjpbIkBzb3VyY2VfaG9zdCIsIkBtZXNzYWdlIiwiQGZpZWxkcy5jYXRlZ29yeSIsIkBmaWVsZHMuc3lzbG9nX3NldmVyaXR5Il0sIm9mZnNldCI6MCwidGltZWZyYW1lIjoiYWxsIiwiZ3JhcGhtb2RlIjoiY291bnQiLCJ0aW1lIjp7InVzZXJfaW50ZXJ2YWwiOjB9LCJzdGFtcCI6MTM2ODgyODA0ODYzMX0=';
    frames['allLogsFrame'].location.href = 'kibana/#' + defaultQueryString;

    this.set('shortCutTimeSelected', this.shortCutTimes.objectAt(7));
    this.set('criticalitySelected', this.criticalities.objectAt(3));
    this.set('nodeSelected', '');

    this.set('selectedNodes', []);
    this.set('selectedVms', []);
    this.set('selectedCriticalities', []);
    this.set('selectedLogCategories', []);

    App.currentSelections.resetSelection('selectedNodes');
    App.currentSelections.resetSelection('selectedVms');
    App.currentSelections.resetSelection('selectedCriticalities');
    App.currentSelections.resetSelection('selectedLogCategories');

    this.set('timeFrom', '');
    this.set('timeTo', '');
    this.set('searchText', '');
    
    setTimeout(function () {
      frames['allLogsFrame'].sbctl('hide', true);
    }, 3000);

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
      },
      updateLogsFrame: function () {
        this.styleLogsFrame();
        //App.logBar.updateLogsFrame();
        this.get('controller').updateLogsFrame();
        this.modalHide();
      },
      styleLogsFrame: function () {
        setTimeout(function () {
          try {
            frames['allLogsFrame'].sbctl('hide', true);
          } catch(error) {
            // Kibana is not loaded in iFrame
          }
        }, 3000);
      }
    }).appendTo('body');
  }

});

//App.logBar = App.LogBarController.create();
