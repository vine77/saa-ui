import ColumnsController from 'columns';

export default ColumnsController.extend({
  content: [{
    title: 'MLE Name',
    sortBy: 'name'
  }, {
    title: 'MLE Type',
    sortBy: 'mleType'
  }, {
    title: 'OEM Name',
    sortBy: 'oemname'
  }, {
    title: 'Attestation Type',
    sortBy: 'attestationType'
  }, {
    title: 'OS Name',
    sortBy: 'osname'
  }, {
    title: 'Version',
    sortBy: 'version'
  }, {
    title: 'OS Version',
    sortBy: 'osversion'
  }, {
    title: 'Actions'
  }]
});
