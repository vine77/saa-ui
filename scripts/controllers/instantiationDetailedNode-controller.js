App.InstantiationDetailedNodeController = Ember.ObjectController.extend({
  freeCoresTotal: function() {
    var freeCores = 0;
    if (this.get('freeCores.sockets')) {
      var freeCores = this.get('freeCores.sockets').reduce(function(previousValue, item, index, enumerable) {
        return previousValue + item.cores;
      }, 0);
    }
    return freeCores;
  }.property()
});