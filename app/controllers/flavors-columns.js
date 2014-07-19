import ColumnsController from './columns';

export default ColumnsController.extend({
  content: [{
    title: 'Flavor Name',
    sortBy: 'name'
  }, {
    title: '# of VMs',
    sortBy: 'vms.length'
  }, {
    title: 'SLA',
    sortBy: 'sla.name'
  }, {
    title: 'Actions'
  }]
});
