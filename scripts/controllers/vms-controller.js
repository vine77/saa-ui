App.VmsController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  itemController: 'vm',
  columns: ['select', 'health', 'state', 'trusted', 'sla_status', 'noisy', 'name', 'node', 'cpu', 'utilization.gips', 'utilization.ipc', 'utilization.mp10ki', 'actions'],
  filteredModel: function () {
    return this.store.find('vm');
  }.property('model.@each'),
  filterProperties: ['name'],
  isGrouped: function () {
    return (!!this.get('sortProperties') && this.get('sortProperties')[0] === 'node');
  }.property('sortProperties'),
  groupedModel: function () {
    if (this.get('isGrouped')) {
      var groupBy = 'node.name';
      var groups = {};
      this.forEach(function (item, index, enumerable) {
        var groupName = item.get(groupBy);
        if (typeof groups[groupName] === 'undefined') groups[groupName] = [];
        groups[groupName].push(item);
      });
      indexedGroups = [];
      $.each(groups, function (index, item) {
        indexedGroups.push(item);
      });
      return indexedGroups;
    } else {
      return [this];
    }
  }.property('model.@each', 'sortProperties', 'sortAscending'),
  multipleVmsAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  isTreemapVisible: false,
  treemapData: {
    'name': 'Cluster',
    'children': []
  },

  // Actions
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    refresh: function () {
      this.store.find('vm', undefined, true);
    },
    exportTrustReport: function (reportContent) {
      this.store.find('vmTrustReport', reportContent.get('id')).then(function (vmTrustReport) {
        reportContent = vmTrustReport;
        if ((vmTrustReport !== undefined) && (vmTrustReport !== null) && (reportContent.get('attestations.length') > 0)) {
          var title = "SAM VM Trust Report";
          var subtitle = reportContent.get('vmName');
          var rowContent = [];
          rowContent.push("item.get('node.attestation_time_formatted')");
          rowContent.push("((item.get('node.trust_status'))?'VM was started on node '+item.get('node.node_name')+' ('+item.get('node.ip_address')+') that was attested as trusted. ':'VM was started on node that failed to be found attested as trusted.')");
          rowContent.push("item.get('node.trust_message')");
          App.pdfReport(reportContent, rowContent, title, subtitle, 'attestations');
        } else {
          App.notify('Trust attestation logs were not found.');
        }
      });
    },
    trustReportModal: function(model){
      var controller = this;
        modal = Ember.View.create({
          templateName: "vmTrustReport-modal",
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
    },
    renderTreemap: function () {
      if (this.isTreemapVisible) {
        $('.treemap').slideUp();
        this.set('isTreemapVisible', false);
        return;
      }
      $('.treemap').slideDown();
      this.set('isTreemapVisible', true);

      // Generate object for D3 treemap layout
      var vms = {};
      var json = [];
      this.store.all('vm').forEach(function (item, index, enumerable) {
        if (!vms.hasOwnProperty(item.get('nodeName'))) vms[item.get('nodeName')] = [];
        vms[item.get('nodeName')].push({
          id: item.get('id'),
          name: item.get('name'),
          nodeName: item.get('nodeName'),
          status: {
            health: item.get('status.health')
          },
          capabilities: {
            memory_size: App.readableSizeToBytes(item.get('capabilities.memory_size')),
            gips_allocated: item.get('capabilities.gips_allocated')
          },
          utilization: {
            memory: App.readableSizeToBytes(item.get('utilization.memory')),
            gips_current: item.get('gips_current.gips_current')
          }
        });
      });
      for (var nodeName in vms) {
        if (!vms.hasOwnProperty(nodeName)) continue;
        var vmsOnHost = vms[nodeName];
        json.push({
          name: nodeName,
          children: vmsOnHost
        });
      }
      json = {
        name: 'Cluster',
        children: json
      };
      this.treemapData = json;

      // Draw treemap
      console.log('Drawing treemap...');
      var treemap = d3.layout.treemap()
        .sticky(true)
        .size([$('.treemap').width(), 200])
        .value(function (d) {
          if (d.capabilities && d.capabilities.memory_size) {
            return d.capabilities.memory_size;
          } else {
            return null;
          }
        });
      var container = d3.select('.treemap');
      var color = d3.scale.category20c();
      var treemapNodes = container.selectAll('.node')
        .data(treemap(this.treemapData))
        .enter()
        .append('div')
        .attr('class', 'node')
        .style('left', function (d) { return d.x + 'px'; })
        .style('top', function (d) { return d.y + 'px'; })
        .style('width', function (d) { return Math.max(0, d.dx - 1) + 'px'; })
        .style('height', function (d) { return Math.max(0, d.dy - 1) + 'px'; })
        .style('background', function (d) { return d.children ? null : color(d.nodeName); })
        .html(function (d) { return '<a href="/#/vms/' + d.id + '">' + d.name + '</a>'; });
    }
  }
});
