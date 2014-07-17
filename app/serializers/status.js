App.StatusSerializer = App.ApplicationSerializer.extend({
  extractArray: function(store, type, payload) {
    var json = JSON.parse(JSON.stringify(payload));
    json.statuses.map( function(item, index, enumerable) {
      item.offspring_ids = JSON.parse(JSON.stringify(item.children_ids));
    });
    return this._super(store, type, json);
  }
});
