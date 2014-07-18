import ColumnsController from 'columns';

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
    title: 'Capacity (SCU)',
    sortBy: 'vcpusTimesSu'
  }, {
    title: 'Utilization (SCU)',
    description: 'The Service Compute Unit (SCU) is a measure of compute consumption on the host server',
    sortBy: 'utilization.scu_total'
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
