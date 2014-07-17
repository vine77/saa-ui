App.SlasColumnsController = App.ColumnsController.extend({
  content: [{
    title: 'SLA Name',
    sortBy: 'name'
  }, {
    title: '# of SLOs',
    sortBy: 'slos.length'
  }, {
    title: 'SLO Types',
    sortBy: 'sloTypes'
  }, {
    title: 'Actions'
  }]
});
