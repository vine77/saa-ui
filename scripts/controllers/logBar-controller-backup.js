App.LogBarController = Ember.ObjectController.extend({
  shortCutTimes: [{"id": 1, "label":"Last 15min"}, 
                  {"id":2, "label":"Last 60min"},
                  {"id":3, "label":"Last 4h"},
                  {"id":4, "label":"Last 12h"},
                  {"id":5, "label":"Last 24h"},
                  {"id":6, "label":"Last 48h"},
                  {"id":7, "label":"Last 7d"},
                  {"id":8, "label":"All Time"},
                  {"id":9, "label":"Custom"}],
  criticalities: [{"id": 1, "label":"Debug"}, 
                  {"id": 2, "label":"Notice"}, 
                  {"id": 3, "label":"Warning"}, 
                  {"id": 4, "label":"Error"},
                  {"id": 5, "label":"Critical"}],
  criticalitySelected: null,
  shortCutTimeSelected: null,
  searchText: '',
  nodeSelected: '',
  timeFrom: '',
  timeTo: '',
  useContextSelected: false,
  useContextTip : '<strong>Use Context Feature</strong><br>Use the checkboxes outside of this pane on the Nodes and VMs pages to select components by which to filter.',
  selectedNodes: [],
  selectedVms: [],
  needs: ["nodes"],
  container: App.__container__,
  nodes: function() {
    if (this.get('useContextSelected')) {
      return [{value:"context", label:"Using Context"}];
    } else {
      var returnArray = [];
      App.Node.all().forEach( function (item, index, enumerable) {
        var nodeObj = {"value": item.get('id'), "label": item.get('name')};
        returnArray.pushObject(nodeObj);
      });
      return returnArray;
    }
  }.property('useContextSelected','controllers.nodes.model.@each'),
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
  searchTextQuery: function() { //composed of :text search, node, and criticality
    var returnVal = [];
    //Text search
    if (this.get('searchText')) {
      returnVal.push(this.get('searchText'));
    }
    //Node
    if (this.get('useContextSelected') && (App.get('currentPath') == 'nodes.index')) {
      if (this.get('selectedNodes')) {
        //update select list for nodes...
        var nodesReturnArray = [];
        //this.set('nodes', [{value:"context", label:"Using Context"}]);
        this.set('nodeSelected', this.nodes.objectAt(0));
        this.get('selectedNodes').forEach(function (item, index, enumerable) {
          var nodeString = '@fields.host_id:\"' + item.get('id') + '\"';
          nodesReturnArray.push(nodeString);
        });
        if (nodesReturnArray.length > 0) { returnVal.push('(' + nodesReturnArray.join(' OR ') + ')'); }
      }
    } else {
      //this.set('nodes', this.get('nodesLookup'));
      //App.logBar.propertyDidChange('nodes');
      //App.logBar.propertyDidChange('nodesLookup');
      //this.set('nodeSelected', null);
      if (this.get('nodeSelected.value') && this.get('nodeSelected.value') != 'context') {
        //"search":" @fields.host_id:\"E7F5D9ABC294E111BD1D001E6747F682\""
        var nodeString = '@fields.host_id:\"' + this.get('nodeSelected.value') + '\"';
        returnVal.push(nodeString);
      }
    }
    //Criticality @fields.syslog_severity_code
    if (this.get('criticalitySelected.label')) {
      var criticalityString = '@fields.syslog_severity:\"' + this.get('criticalitySelected.label') + '\"';
      returnVal.push(criticalityString);
    }

    //Vms
    if (this.get('useContextSelected') && (App.get('currentPath') == 'vms.index')) {
      if (this.get('selectedVms')) {
        //this.set('vms', [{value:"context", label:"Using Context"}]);
        //this.set('vmSelected', this.nodes.objectAt(0));
        vmsReturnArray = [];
        this.get('selectedVms').forEach(function (item, index, enumerable) {
          var vmString = '@fields.vm_id:\"' + item.get('id') + '\"';
          vmsReturnArray.push(vmString);
        });
        returnVal.push('(' + vmsReturnArray.join(' OR ') + ')');
      }
    }
    
    //var returnValues = returnVal.join(' AND ') + ((nodesReturnArray)?' OR '+nodesReturnArray:'');
    //return returnValues;

    return returnVal.join(' AND ');

  }.property('searchText', 'nodeSelected', 'criticalitySelected', 'selectedNodes.@each','App.Node.@each','useContextSelected'),
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
    //Consider calling this on didInsertElement of the logBarView also. (Might not need to do this since it is being set on logsUrl.)
    //var defaultQueryString = 'eyJzZWFyY2giOiIiLCJmaWVsZHMiOlsiQHNvdXJjZV9ob3N0IiwiQG1lc3NhZ2UiLCJAZmllbGRzLnN5c2xvZ19wcm9ncmFtIiwiQGZpZWxkcy5zeXNsb2dfcHJvZ2FtIiwiQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHkiXSwib2Zmc2V0IjowLCJ0aW1lZnJhbWUiOiJhbGwiLCJncmFwaG1vZGUiOiJjb3VudCIsInRpbWUiOnsidXNlcl9pbnRlcnZhbCI6MH0sInN0YW1wIjoxMzY4ODI4MDQ4NjMxfQ==';
    var defaultQueryString = 'eyJzZWFyY2giOiIiLCJmaWVsZHMiOlsiQHNvdXJjZV9ob3N0IiwiQG1lc3NhZ2UiLCJAZmllbGRzLnN5c2xvZ19wcm9ncmFtIiwiQGZpZWxkcy5zeXNsb2dfc2V2ZXJpdHkiXSwib2Zmc2V0IjowLCJ0aW1lZnJhbWUiOiJhbGwiLCJncmFwaG1vZGUiOiJjb3VudCIsInRpbWUiOnsidXNlcl9pbnRlcnZhbCI6MH0sInN0YW1wIjoxMzY4ODI4MDQ4NjMxfQ==';
    frames['allLogsFrame'].location.href = 'kibana/#' + defaultQueryString;

    this.set('shortCutTimeSelected', this.shortCutTimes.objectAt(7));
    this.set('timeFrom', '');
    this.set('timeTo', '');
    this.set('criticalitySelected', null);
    this.set('nodeSelected', null);
    this.set('searchText', '');
  }

});

App.logBar = App.LogBarController.create();



  /*
  useContext: function(selectedNodes) {
    //fetch the number of nodes selected
    console.log('useContext')
    if (this.get('useContextSelected')) {

      if (this.get('selectedNodes')) {
        //update select list for nodes...
        this.set('nodes', [{value:"context", label:"Using Context"}]);
        this.set('nodeSelected', this.nodes.objectAt(0));
      }
    }
  }.observes('useContextSelected')
  */