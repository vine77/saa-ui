App.VmsColumnsController = App.ColumnsController.extend({
  content: [{
    description: 'State (Health/Operational State)',
    sortBy: 'state',
    icon: 'icon-off'
  }, {
    description: 'Trust Status',
    sortBy: 'isTrusted',
    icon: 'icon-lock'
  }, {
    description: 'SLA Status',
    sortBy: 'status.sla_status',
    icon: 'icon-trophy'
  }, {
    description: 'Noisy Neighbor',
    sortBy: 'noisy',
    icon: 'icon-bullhorn'
  }, {
    title: 'VM Name',
    sortBy: 'name'
  }, {
    title: 'Hostname',
    sortBy: 'nodeName'
  }, {
    title: 'vCPUs × SCU',
    sortBy: 'vcpusTimesSu'
  }, {
    title: 'SCU',
    description: 'The Service Compute Unit (SCU) is a measure of compute consumption on the host server',
    sortBy: 'utilization.su_current'
  }, {
    title: 'Memory',
    description: 'Memory utilization',
    sortBy: 'utilization.memory'
  }, {
    title: 'Contention',
    description: 'LLC cache contention',
    sortBy: 'contention.system.llc.value'
  }, {
    title: 'Actions'
  }]
});


App.VmsController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  needs: ['vmsColumns', 'application'],
  itemController: 'vm',
  sortProperty: 'name',
  filterProperties: ['name', 'nodeName'],
  multipleVmsAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  isTreemapVisible: false,
  treemapData: {
    'name': 'Cluster',
    'children': []
  },

  numberOfPages: function () {
    return Math.ceil(this.get('length')/this.get('listView.pageSize'));
  }.property('listView.pageSize', 'length'),
  isFirstPage: Ember.computed.equal('listView.currentPage', 1),
  isLastPage: function () {
    return this.get('listView.currentPage') === this.get('numberOfPages');
  }.property('listView.currentPage', 'numberOfPages'),
  visibleRows: function () {
    return Math.min(this.get('listView.pageSize'), this.get('length'));
  }.property('listView.pageSize', 'length'),

  // Actions
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.everyProperty('isSelected');
      this.setEach('isSelected', !isEverythingSelected);
    },
    refresh: function () {
      this.store.find('vm');
    },
    expand: function (model) {
      if (!model.get('isExpanded')) {
          this.transitionToRoute('vmsVm', model);
        } else {
          this.transitionToRoute('vms');
        }
    },
    exportTrustReport: function (model) {
      var self = this;
      this.set('isActionPending', true);
      this.store.find('vmTrustReport', model.get('id')).then(function (vmTrustReport) {
        model = vmTrustReport;
        if ((vmTrustReport !== undefined) && (vmTrustReport !== null) && (model.get('vmAttestations.length') > 0)) {
          var title = 'VM Trust Report';
          var subtitle = model.get('vmName');
          var rowContent = [];
          rowContent.push("item.get('vmAttestationNode.attestationTimeFormatted')");
          rowContent.push("item.get('vmAttestationNode.reportMessage')");
          App.pdfReport(model, rowContent, title, subtitle, 'vmAttestations');
        } else {
          App.notify('Trust attestation logs were not found.');
        }
        self.set('isActionPending', false);
      }, function (xhr) {
        self.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to load VM trust report.');
      });
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
            su_allocated: item.get('capabilities.su_allocated')
          },
          utilization: {
            memory: App.readableSizeToBytes(item.get('utilization.memory')),
            su_current: item.get('su_current.su_current')
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

  /*
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
  */
