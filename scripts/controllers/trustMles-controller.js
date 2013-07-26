App.TrustMlesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  
  columns: ['mleType', 'name', 'oemname', 'attestationType', 'osname', 'version', 'osversion'],
  filteredModel: function () {
    return App.TrustMle.find();
  }.property('App.TrustMle.@each'),
  filterProperties: ['name', 'version', 'attestationType', 'mleType', 'osname', 'oemname'],
  deleteMle: function (mle) {
    App.TrustNode.find().then(function() { //updating all trust nodes 
      //check if any nodes are registered anywhere with this mle ...
      if (mle.get('trustNode.length') > 0) {
        App.event('Failed to delete fingerprint, you must first remove trust from all of the fingerprint\'s associated nodes.', App.ERROR);
      } else {
        var confirmed = confirm('Are you sure you want to delete this fingerprint?');
        if (confirmed) {          
          var ajaxOptions = $.extend({
            type: 'DELETE',
            url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/trust_mles/' + mle.get('id'),
            contentType: "application/json",
            dataType: "json"
          }, App.ajaxSetup);
          App.ajaxPromise(ajaxOptions).then(function (data, textStatus, jqXHR) {
            mle.deleteRecord();
            App.event('Successfully deleted fingerprint "' + mle.get('name') + '"', App.SUCCESS);
          }, function (qXHR, textStatus, errorThrown) {
            App.event('Failed to delete fingerprint "' + mle.get('name') + '"', App.ERROR);
          });
          
          //mle.get('transaction').commit();
        }
      }
    });
  },
  expand: function (model) {
    if (!model.get('isActive')) {
      //model.set('isActive', true);
      this.transitionToRoute('trust.mle', model);
    } else {
      this.transitionToRoute('trust.mles');
    }
  }
  
  /*
  frameUrl: function () {
    // Mt. Wilson Whitelist Portal
    return 'https://' + window.location.hostname + ':8181/WhiteListPortal/';
  }.property()
  */
});
