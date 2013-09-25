App.NodesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'health', 'state', 'status.trust', 'isTrustRegistered', 'name', 'vmInfo.count', 'cpuFrequency', 'utilization.gips_current','utilization.ipc','utilization.memory'],
  //needs: ['logBar'],
  filteredModel: function () {
    return App.Node.find();
  }.property('App.Node.@each'),
  filterProperties: ['name'],
  multipleNodesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  totalVms: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vmInfo.count') > 0) ? item.get('vmInfo.count') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vmInfo.count'),
  totalVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('vcpus.used') > 0) ? item.get('vcpus.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.vcpus.used'),
  maxVcpus: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var max = (item.get('vcpus.max') > 0) ? item.get('vcpus.max') : 0;
      return previousValue + max;
    }, 0);
  }.property('model.@each.vcpus.max'),
  totalVcpusMessage: function () {
    var maxVcpus = (this.get('maxVcpus') == 0) ? 'N/A' : this.get('maxVcpus');
    return this.get('totalVcpus') + ' out of ' + maxVcpus + ' vCPUs';
  }.property('totalVcpus', 'maxVcpus'),
  totalVcpusWidth: function () {
    var percentage = (this.get('maxVcpus') == 0) ? 0 : (this.get('totalVcpus')/this.get('maxVcpus')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalVcpus', 'maxVcpus'),
  totalRam: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var count = (item.get('memory.used') > 0) ? item.get('memory.used') : 0;
      return previousValue + count;
    }, 0);
  }.property('model.@each.memory.used'),
  maxRam: function () {
    if (this.get('model') === undefined) return null;
    return this.get('model').reduce(function (previousValue, item, index, enumerable) {
      var max = (item.get('memory.max') > 0) ? item.get('memory.max') : 0;
      return previousValue + max;
    }, 0);
  }.property('model.@each.memory.max'),
  totalRamMessage: function () {
    return App.readableSize(this.get('totalRam') * 1048576) + ' out of ' + App.readableSize(this.get('maxRam') * 1048576);
  }.property('totalRam', 'maxRam'),
  totalRamWidth: function () {
    var percentage = (this.get('maxRam') == 0) ? 0 : (this.get('totalRam')/this.get('maxRam')) * 100;
    return 'width:' + percentage + '%;';
  }.property('totalRam', 'maxRam'),

  // Actions
  selectAll: function () {
    var isEverythingSelected = this.get('model').everyProperty('isSelected');
    this.get('model').setEach('isSelected', !isEverythingSelected);
  },
  expand: function (model) {
    if (!model.get('isActive')) {
      this.transitionToRoute('nodesNode', model);
    } else {
      this.transitionToRoute('nodes');
    }
  },
  exportTrustReport: function (reportContent){
    App.NodeTrustReport.find(reportContent.get('id')).then(function (nodeTrustReport) {
      if (nodeTrustReport !== null && (nodeTrustReport.get('attestations.length') > 0)) {
        var title = "SAM Node Trust Report";
        var subtitle = reportContent.get('name') + ' ('+reportContent.get('ids.ip_address')+')';
        var rowContent = [];
        rowContent.push("item.get('attestation_time_formatted')");
        rowContent.push("((item.get('trust_status'))?'The node was booted and was found attested as trusted.':'The node was booted and failed to be found attested as trusted.')");
        rowContent.push("item.get('trust_message')");
        App.pdfReport(nodeTrustReport, rowContent, title, subtitle, 'attestations');
      } else {
        App.Event('No trust attestation logs were found for this node.', App.WARNING);
      }
    }, function () {
      App.Event('Failed to load node trust report', App.ERROR);
    });
  },
  trustReportModal: function (model) {
    var controller = this;
    modal = Ember.View.create({
      templateName: "nodeTrustReport-modal",
      controller: controller,
      content: model,
      modalHide: function() {
        $('#modal').modal('hide');
        var context = this;
        //setTimeout(context.remove, 3000);
        this.remove(); //destroys the element
      },
      didInsertElement: function (){
        $('#modal').modal('show');
      }
    }).appendTo('body');
  },
  unregister: function (node) {
    var confirmed = confirm('Note: You must uninstall the SAM node agent before doing the unregister action, or the node will be re-register once the SAM agent sends its next heartbeat message. Are you sure you want to unregister node "' + node.get('name') + '"? It will thereafter not be managed by ' + App.application.title + ' and disappear from this list of nodes. ');
    if (confirmed) {
      // TODO: add error handling for this delete node action
      node.deleteRecord();
      node.get('transaction').commit();
    }
  },
  reboot: function (node) {
    var confirmed = confirm('Are you sure you want to reboot node "' + node.get('name') + '"?');
    if (confirmed) {
      var jsonData = {
        "node": {
          "status": {
            "operational": 4
          }
        }
      };
      var ajaxOptions = $.extend({
        type: 'PUT',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/nodes/' + node.get('id'),
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      $.ajax(ajaxOptions).then(function (data, textStatus, jqXHR) {
        node.set('status.operational', App.REBOOTING);
        node.get('stateManager').transitionTo('rootState.loaded.saved');
        App.event('Successfully started rebooting node "' + node.get('name') + '"', App.SUCCESS);
      }, function (jqXHR, textStatus, errorThrown) {
        App.event('Failed to reboot node "' + node.get('name') + '"', App.ERROR);
      });
    }
  },
  control: function (node) {
    var confirmed = confirm('Are you sure you want to put node "' + node.get('name') + '" under the control of ' + App.application.get('title') + '?');
    if (confirmed) {
      var jsonData = {
        "node": {
          "under_sam_control": true
        }
      };
      var ajaxOptions = $.extend({
        type: 'PUT',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/nodes/' + node.get('id'),
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      $.ajax(ajaxOptions).then(function (data, textStatus, jqXHR) {
        node.set('underSamControl', true);
        node.get('stateManager').transitionTo('rootState.loaded.saved');
        App.event('Successfully put node "' + node.get('name') + '" under the control of ' + App.application.get('title'), App.SUCCESS);
      }, function (jqXHR, textStatus, errorThrown) {
        App.event('Failed to put node "' + node.get('name') + '" under the control of ' + App.application.get('title'), App.ERROR);
      });
    }
  },
  uncontrol: function (node) {
    var confirmed = confirm('Are you sure you want to remove node "' + node.get('name') + '" from the control of ' + App.application.get('title') + '?');
    if (confirmed) {
      var jsonData = {
        "node": {
          "under_sam_control": false
        }
      };
      var ajaxOptions = $.extend({
        type: 'PUT',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/nodes/' + node.get('id'),
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      $.ajax(ajaxOptions).then(function (data, textStatus, jqXHR) {
        node.set('underSamControl', false);
        node.get('stateManager').transitionTo('rootState.loaded.saved');
        App.event('Successfully removed node "' + node.get('name') + '" from the control of ' + App.application.get('title'), App.SUCCESS);
      }, function (jqXHR, textStatus, errorThrown) {
        App.event('Failed to removed node "' + node.get('name') + '" from the control of ' + App.application.get('title'), App.ERROR);
      });
    }
  },
  schedule: function (node, socketNumber) {
    socketNumber = Ember.isEmpty(socketNumber) ? 0 : parseInt(socketNumber.toFixed());
    var confirmed = confirm('Are you sure you want all future VMs to be placed on node "' + node.get('name') + '"?');
    if (confirmed) {
      var jsonData = {
        "node": {
          "scheduler_mark": socketNumber,
          "scheduler_persistent": true
        }
      };
      var ajaxOptions = $.extend({
        type: 'PUT',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/nodes/' + node.get('id'),
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      $.ajax(ajaxOptions).then(function (data, textStatus, jqXHR) {
        // Unset all other nodes
        App.Node.all().filterProperty('isScheduled', true).forEach(function (item, index) {
          item.set('schedulerMark', null);
          item.get('stateManager').transitionTo('rootState.loaded.saved');
        });
        // Set this node for VM placement
        node.set('schedulerMark', 0);
        node.set('schedulerPersistent', true);
        node.get('stateManager').transitionTo('rootState.loaded.saved');
        App.event('Successfully set node "' + node.get('name') + '" for VM placement', App.SUCCESS);
      }, function (jqXHR, textStatus, errorThrown) {
        App.event('Failed to set node "' + node.get('name') + '" for VM placement', App.ERROR);
      });
    }
  },
  unschedule: function (node) {
    var confirmed = confirm('Are you sure you want to unset node "' + node.get('name') + '" for future VM placement and return to standard VM placement?');
    if (confirmed) {
      var jsonData = {
        "node": {
          "scheduler_mark": null
        }
      };
      var ajaxOptions = $.extend({
        type: 'PUT',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/nodes/' + node.get('id'),
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      $.ajax(ajaxOptions).then(function (data, textStatus, jqXHR) {
        node.set('schedulerMark', null);
        node.get('stateManager').transitionTo('rootState.loaded.saved');
        App.event('Successfully unset node "' + node.get('name') + '" for VM placement', App.SUCCESS);
      }, function (jqXHR, textStatus, errorThrown) {
        App.event('Failed to unset node "' + node.get('name') + '" for VM placement', App.ERROR);
      });
    }
  },
  addTrust: function (node) {
    var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
    if (confirmed) {

      trustNode = App.TrustNode.createRecord({
        node: App.Node.find(node.get('id'))
      });
      trustNode.get('transaction').commit();
      trustNode.get('store').commit();

      trustNode.on('becameError', function () {
        var errorMessage = (trustNode.get('error')) ? trustNode.get('error') : 'An error occured while trusting node. Please try again.';
        App.event(errorMessage, App.ERROR);
        trustNode.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        trustNode.deleteRecord();
        //controller.set('isFlavorCreating', false);
      });
      trustNode.on('becameInvalid', function () {
        var errorMessage = (trustNode.get('error')) ? trustNode.get('error') : 'An error occured while trusting node. Please try again.';
        App.event(errorMessage, App.WARNING);
        trustNode.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        trustNode.deleteRecord();
        //controller.set('isFlavorCreating', false);
      });
      trustNode.on('didCreate', function () {
        App.event('Successfully trusted node "' + node.get('name') + '"', App.SUCCESS);
      });
      /*
      var jsonData = {
        "node_ids": [{
          "node_id": node.get('id')
        }]
      };
      var ajaxOptions = $.extend({
        type: 'POST',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust_nodes',
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {
        App.event('Successfully registered node "' + node.get('name') + '" as trusted', App.SUCCESS);
        if (App.TrustNode.find(node.get('id')).get('isLoaded')) {
          App.TrustNode.find(node.get('id')).get('stateManager').transitionTo('rootState.loaded.saved');
          App.TrustNode.find(node.get('id')).reload().then(function() {
            node.reload();
          }, function (){
            node.reload();
          });
        } else {
          App.TrustNode.find(node.get('id')).then(function(){
            node.reload();
          });
        }
      }, function (qXHR, textStatus, errorThrown) {
        App.event('Failed to register node "' + node.get('name') + '" as trusted', App.ERROR);
      });
      */

    }
  },
  removeTrust: function (node) {
    var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
    
    if (confirmed) {
      App.event('Successfully unregistered node "' + node.get('name') + '" as trusted', App.SUCCESS);
      node.get('trustNode').deleteRecord();
      node.get('transaction').commit();
      node.get('store').commit();
    }

    node.on('becameError', function () {
        var errorMessage = (node.get('error')) ? node.get('error') : 'An error occured while removing trust.';
        App.event(errorMessage, App.ERROR);
    });

    /**Solution leaves cache still populated. 
    /**Cache needs to be destroyed, and isTrustRegistered computed property needs to be triggered.

    if (confirmed) {
      var ajaxOptions = $.extend({
        type: 'DELETE',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust_nodes/' + node.get('id'),
        contentType: "application/json",
        dataType: "json"
      }, App.ajaxSetup);
      App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {

        App.event('Successfully unregistered node "' + node.get('name') + '" as trusted', App.SUCCESS);
        App.TrustNode.all().clear();
        App.TrustMle.all().clear();
        App.TrustNode.find();
        App.TrustMle.find();

      }, function (qXHR, textStatus, errorThrown) {
        App.event('Failed to unregister node "' + node.get('name') + '" as trusted', App.ERROR);
      });
    }
    **/
  },
  trustFingerprint: function (node) {
    var confirmed = confirm('Are you sure you want to fingerprint node "' + node.get('name') + '"?');
    if (confirmed) {

      trustMle = App.TrustMle.createRecord({
        node: App.Node.find(node.get('id'))
      });

      trustMle.get('transaction').commit();
      trustMle.get('store').commit();

      trustMle.on('becameError', function () {
        var errorMessage = (trustMle.get('error')) ? trustMle.get('error') : 'An error occured while fingerprinting node. Please try again.';
        App.event(errorMessage, App.ERROR);
        trustMle.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        trustMle.deleteRecord();
        //controller.set('isFlavorCreating', false);
      });
      trustMle.on('becameInvalid', function () {
        var errorMessage = (trustMle.get('error')) ? trustMle.get('error') : 'An error occured while fingerprinting node. Please try again.';
        App.event(errorMessage, App.WARNING);
        trustMle.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        trustMle.deleteRecord();
        //controller.set('isFlavorCreating', false);
      });
      trustMle.on('didCreate', function () {
        //Work around for zombie record with null id. Only when json-api-serializer extract is: //this.extractMany.apply(this, json, type, records);
        /*
        App.TrustMle.find().forEach( function(item, index, enumerable) {
          if ((item.get('id') == null)) {
            item.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
            item.deleteRecord();
          }
        });
      */
        //App.event('Successfully trusted node "' + trustMle.get('name') + '"', App.SUCCESS);
        App.event('Successfully fingerprinted node ' + node.get('name') + '.', App.SUCCESS);
      });

      /* Old Implementation ...
      var jsonData = {
        "node_id": node.get('id')
      };
      var ajaxOptions = $.extend({
        type: 'POST',
        url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust_mles',
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json'
      }, App.ajaxSetup);
      App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {
        App.event('Successfully fingerprinted node "' + node.get('name') + '"', App.SUCCESS);
        node.reload();
        node.get('trustNode').reload();
      }, function (qXHR, textStatus, errorThrown) {
        App.event('Failed to fingerprint node "' + node.get('name') + '"', App.ERROR);
      });
      */
    }
  },
  refresh: function () {
    if (!this.get('isUpdating')) {
      if (App.mtWilson.get('isInstalled') === true) {
        App.TrustNode.find(undefined, true).then(function() {
          App.Node.find(undefined, true);
        });
      } else {
        App.Node.find(undefined, true);
      }
    }
  }
});
