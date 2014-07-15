import ColumnsController from './columns';

export default ColumnsController.extend({
  content: [{
    description: 'State (Health/Operational State)',
    sortBy: 'state',
    icon: 'icon-off'
  }, {
    description: 'Trust Status',
    sortBy: 'isTrusted',
    icon: 'icon-lock'
  }, {
    description: 'Node Type (Assured, Monitored, Non-SAA)',
    sortBy: 'samControlled',
    icon: 'icon-trophy'
  }, {
    title: 'Hostname',
    sortBy: 'name',
    sortAscending: true
  }, {
    title: 'VMs',
    sortBy: 'vmInfo.count'
  }, {
    title: 'Capacity',
    sortBy: 'cpuSort'
  }, {
    title: 'Utilization (SCU)',
    description: 'The Service Compute Unit (SCU) is a measure of compute consumption on the host server',
    sortBy: 'utilization.scus.total.current'
  }, {
    title: 'Memory',
    description: 'Memory utilization',
    sortBy: 'utilization.memory'
  },{
    title: 'Load',
    description: 'Normalized Load',
    sortBy: 'utilization.normalized_load'
  }, {
    title: 'Contention',
    description: 'LLC cache contention',
    sortBy: 'contention.system.llc.value'
  }, {
    title: 'Actions'
  }]
});
