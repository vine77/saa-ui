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
      this.store.find('trustNode').then(function() { //updating all trust nodes
        //check if any nodes are registered anywhere with this mle ...
        if (mle.get('trustNode.length') > 0) {
          App.event('Failed to delete fingerprint, you must first remove trust from all of the fingerprint\'s associated nodes.', App.ERROR);
        } else {
          var confirmed = confirm('Are you sure you want to delete this fingerprint?');
          if (confirmed) {
            mle.deleteRecord();
            mle.save();
          }
        }
      });
    }
  }
});
