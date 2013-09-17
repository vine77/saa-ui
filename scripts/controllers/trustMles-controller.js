App.TrustMlesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  
  columns: ['mleType', 'name', 'oemname', 'attestationType', 'osname', 'version', 'osversion'],
  filteredModel: function () {
    return App.TrustMle.find();
  }.property('App.TrustMle.@each'),
  filterProperties: ['name', 'version', 'attestationType', 'mleType', 'osname', 'oemname'],
  actions: {
    expand: function (model) {
      if (!model.get('isActive')) {
        //model.set('isActive', true);
        this.transitionToRoute('trust.mle', model);
      } else {
        this.transitionToRoute('trust.mles');
      }
    },
    deleteMle: function (mle) {
      App.TrustNode.find().then(function() { //updating all trust nodes 
        //check if any nodes are registered anywhere with this mle ...
        if (mle.get('trustNode.length') > 0) {
          App.event('Failed to delete fingerprint, you must first remove trust from all of the fingerprint\'s associated nodes.', App.ERROR);
        } else {
          var confirmed = confirm('Are you sure you want to delete this fingerprint?');
          if (confirmed) {
            mle.deleteRecord();
            mle.get('transaction').commit();
            mle.get('store').commit();
          }
        }
      });
    }
  }
});
