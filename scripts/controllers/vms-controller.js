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
    sortBy: 'name',
    sortAscending: true
  }, {
    title: 'Hostname',
    sortBy: 'nodeName',
    sortAscending: true
  }, {
    title: 'vCPU',
    sortBy: 'capabilities.cores'
  }, {
    title: 'Allocation',
    sortBy: 'sortScuRange'
  }, {
    title: 'Utilization',
    description: 'The Service Compute Unit (SCU) is a measure of compute consumption on the host server',
    sortBy: 'scuTotal'
  }, {
    title: 'Memory',
    description: 'Percentage of memory allocated',
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
  sortAscending: true,
  filterProperties: ['name', 'nodeName'],
  isMatch: function (record) {
    if (!this.get('selectedTenant')) return true;
    if (Ember.isEmpty(record.get('tenant'))) return false;
    return record.get('tenant.id') === this.get('selectedTenant.id');
  },
  isMatchObserves: ['selectedTenant'],
  selectedTenant: null,
  multipleVmsAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),

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
      var isEverythingSelected = this.filterBy('isSelectable').everyProperty('isSelected');
      this.filterBy('isSelectable').setEach('isSelected', !isEverythingSelected);
    },
    refresh: function () {
      this.store.find('vm');
    },
    expand: function (model) {
      var item = this.findBy('id', model.get('id'));
      if (!model.get('isExpanded')) {
          this.transitionToRoute('vmsVm', item);
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
    }
  }
});
