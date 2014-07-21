import Ember from 'ember';
import FilterableMixin from './../mixins/filterable';
import SortableMixin from './../mixins/sortable';
import notify from '../utils/notify';
import readableSizeToBytes from '../utils/readable-size-to-bytes';
import pdfReport from '../utils/pdf-report';
import xhrError from '../utils/xhr-error';

export default Ember.ArrayController.extend(FilterableMixin, SortableMixin, {
  needs: ['vmsColumns', 'application'],
  itemController: 'vm',
  sortProperty: 'name',
  sortAscending: true,
  filterProperties: ['name', 'nodeName'],
  multipleVmsAreSelected: function() {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  isTreemapVisible: false,
  treemapData: {
    'name': 'Cluster',
    'children': []
  },

  numberOfPages: function() {
    return Math.ceil(this.get('length')/this.get('listView.pageSize'));
  }.property('listView.pageSize', 'length'),
  isFirstPage: Ember.computed.equal('listView.currentPage', 1),
  isLastPage: function() {
    return this.get('listView.currentPage') === this.get('numberOfPages');
  }.property('listView.currentPage', 'numberOfPages'),
  visibleRows: function() {
    return Math.min(this.get('listView.pageSize'), this.get('length'));
  }.property('listView.pageSize', 'length'),

  // Actions
  actions: {
    selectAll: function() {
      var isEverythingSelected = this.filterBy('isSelectable').everyProperty('isSelected');
      this.filterBy('isSelectable').setEach('isSelected', !isEverythingSelected);
    },
    refresh: function() {
      this.store.find('vm');
    },
    expand: function(model) {
      var item = this.findBy('id', model.get('id'));
      if (!model.get('isExpanded')) {
          this.transitionToRoute('vmsVm', item);
        } else {
          this.transitionToRoute('vms');
        }
    },
    exportTrustReport: function(model) {
      var self = this;
      this.set('isActionPending', true);
      this.store.find('vmTrustReport', model.get('id')).then(function(vmTrustReport) {
        model = vmTrustReport;
        if ((vmTrustReport !== undefined) && (vmTrustReport !== null) && (model.get('vmAttestations.length') > 0)) {
          var title = 'VM Trust Report';
          var subtitle = model.get('vmName');
          var rowContent = [];
          rowContent.push("item.get('vmAttestationNode.attestationTimeFormatted')");
          rowContent.push("item.get('vmAttestationNode.reportMessage')");
          pdfReport(model, rowContent, title, subtitle, 'vmAttestations');
        } else {
          notify('Trust attestation logs were not found.');
        }
        self.set('isActionPending', false);
      }, function(xhr) {
        self.set('isActionPending', false);
        xhrError(xhr, 'Failed to load VM trust report.');
      });
    },
    renderTreemap: function() {
      if (this.isTreemapVisible) {
        Ember.$('.treemap').slideUp();
        this.set('isTreemapVisible', false);
        return;
      }
      Ember.$('.treemap').slideDown();
      this.set('isTreemapVisible', true);

      // Generate object for D3 treemap layout
      var vms = {};
      var json = [];
      this.store.all('vm').forEach(function(item, index, enumerable) {
        if (!vms.hasOwnProperty(item.get('nodeName'))) vms[item.get('nodeName')] = [];
        vms[item.get('nodeName')].push({
          id: item.get('id'),
          name: item.get('name'),
          nodeName: item.get('nodeName'),
          status: {
            health: item.get('status.health')
          },
          capabilities: {
            memory_size: readableSizeToBytes(item.get('capabilities.memory_size')),
            scu_allocated: item.get('capabilities.scu_allocated_max')
          },
          utilization: {
            memory: readableSizeToBytes(item.get('utilization.memory')),
            scu_current: item.get('scu_current.scu_total')
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
        .size([Ember.$('.treemap').width(), 200])
        .value(function(d) {
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
        .style('left', function(d) { return d.x + 'px'; })
        .style('top', function(d) { return d.y + 'px'; })
        .style('width', function(d) { return Math.max(0, d.dx - 1) + 'px'; })
        .style('height', function(d) { return Math.max(0, d.dy - 1) + 'px'; })
        .style('background', function(d) { return d.children ? null : color(d.nodeName); })
        .html(function(d) { return '<a href="/#/vms/' + d.id + '">' + d.name + '</a>'; });
    }
  }
});
