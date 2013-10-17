App.TrustMlesColumnsController = App.ColumnsController.extend({
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

App.TrustMlesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  itemController: 'trustMle',
  sortProperty: 'name',
  actions: {
    deleteMle: function (mle) {
      // Prevent action if any nodes are registered with this MLE
      if (mle.get('trustNode.length') > 0) {
        App.event('Failed to delete MLE. You must first remove trust from all of the MLE\'s associated nodes.', App.ERROR);
      } else {
        var confirmed = confirm('Are you sure you want to delete this MLE?');
        if (confirmed) {
          mle.deleteRecord();
          mle.save().then(function () {
            App.event('Successfully deleted MLE.', App.SUCCESS);
          }, function (xhr) {
            mle.rollback();
            App.xhrError(xhr, 'An error occured while attempting to delete the MLE.');
          });
        }
      }
    }
  }
});
