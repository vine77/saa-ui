App.TrustNodesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'health', 'state', 'status.trust', 'name', 'vmInfo.count', 'cpuFrequency', 'utilization.gips_current','utilization.ipc','utilization.memory'],
  //needs: ['logBar'],
  filteredModel: function () {
    return this.store.find('trustNode');
  }.property('model.@each'),
  filterProperties: ['name'],
  multipleNodesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  // Actions
  actions: {
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
    refresh: function () {
      this.store.all('node').clear();
      this.store.find('node');
    },
    exportTrustReport: function (reportContent) {
      this.store.find('nodeTrustReport', reportContent.get('id')).then(function (nodeTrustReport) {
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
    removeTrust: function (node) {
      var confirmed = confirm('Are you sure you want to unregister node "' + node.get('name') + ' as trusted"?');
      if (confirmed) {
        var ajaxOptions = $.extend({
          type: 'DELETE',
          url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust/nodes/' + node.get('id'),
          contentType: "application/json",
          dataType: "json"
        }, App.ajaxSetup);
        App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {
          node.reload();
          App.event('Successfully unregistered node "' + node.get('name') + '" as trusted', App.SUCCESS);
        }, function (qXHR, textStatus, errorThrown) {
          App.event('Failed to unregister node "' + node.get('name') + '" as trusted', App.ERROR);
        });
      }
    },
    addTrust: function (node) {
      var confirmed = confirm('Are you sure you want to register node "' + node.get('name') + '" as trusted?');
      if (confirmed) {
        var jsonData = {
          "node_ids": [{
            "node_id": node.get('id')
          }]
        };
        var ajaxOptions = $.extend({
          type: 'POST',
          url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust/nodes',
          data: JSON.stringify(jsonData),
          contentType: 'application/json',
          dataType: 'json'
        }, App.ajaxSetup);
        App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {
          node.reload();
          App.event('Successfully registered node "' + node.get('name') + '" as trusted', App.SUCCESS);
        }, function (qXHR, textStatus, errorThrown) {
          App.event('Failed to register node "' + node.get('name') + '" as trusted', App.ERROR);
        });
      }
    }
  },
  trustReportModal: function (model) {
    var controller = this;
    modal = Ember.View.create({
      templateName: "nodeTrustReport-modal",
      controller: controller,
      content: model,
      actions: {
        modalHide: function() {
          $('#modal').modal('hide');
          var context = this;
          //setTimeout(context.remove, 3000);
          this.remove(); //destroys the element
        }
      },
      didInsertElement: function (){
        $('#modal').modal('show');
      }
    }).appendTo('body');
  }
});
