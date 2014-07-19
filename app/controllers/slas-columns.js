import ColumnsController from './columns';

export default ColumnsController.extend({
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
