App.StatusSerializer = App.ApplicationSerializer.extend({
  extractArray: function(store, type, payload) {
    var json = JSON.parse(JSON.stringify(payload));
    json.statuses.map( function(item, index, enumerable) {
      item.offspring_ids = JSON.parse(JSON.stringify(item.children_ids));
    });
    return this._super(store, type, json);
  }
});

App.Status = DS.Model.extend({
  name: DS.attr('string'),
  message: DS.attr('string'),
  health: DS.attr('number'),
  isNotification: DS.attr('boolean'),
  parent: DS.hasMany('status'),
  offspring: DS.hasMany('status'),

  // Computed properties
  colorClass: function () {
    return "text-" + App.priorityToType(this.get('health'));
  }.property('health')
});
