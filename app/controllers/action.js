App.ActionController = Ember.ObjectController.extend({
  isDisabled: function() {
    return this.get('node.isRebooting') && this.get('disabledWhileRebooting');
  }.property('node.@each', 'node.isRebooting'),
  isListItem: function() {
    switch (this.get('method')) {
      case 'exportTrustReport':
        return App.mtWilson.get('isInstalled');
      case 'removeTrust':
        return (App.mtWilson.get('isInstalled')) ? this.get('node.isTrustRegistered') : false;
      case 'addTrust':
        return (App.mtWilson.get('isInstalled')) ? !this.get('node.isTrustRegistered') : false;
      case 'trustFingerprint':
        return App.mtWilson.get('isInstalled');
      case 'configureTrustAgent':
        return App.mtWilson.get('isInstalled');
      case 'unschedule':
        return this.get('node.isScheduled');
      case 'schedule':
        return false;
      case 'unregister':
        return this.get('node.samRegistered');
      case 'setMonitored':
        return this.get('node.isAgentInstalled') && !this.get('node.isMonitored');
      case 'setAssured':
        return this.get('node.isAgentInstalled') && !this.get('node.isAssured');
      default:
        return false;
    }
  }.property('node.isAssured', 'node.isMonitored', 'node.samRegistered', 'node.isScheduled', 'node.isTrustRegistered'),

  additionalListItems: function() {
    var additionalListItems = [];
    if (this.get('method') == 'schedule') {
      if (this.get('node') && !this.get('node.isScheduled')) {
        this.get('node.socketsEnum').forEach( function(item, index, enumerable) {
          additionalListItems.push('<li {{bind-attr class="isDisabled:disabled"}}><a {{action "performAction" method contextNode '+item+'}}><i class="icon-magnet"></i> Place VMs on Socket '+item+'</a></li>');
        });
        return Ember.View.extend({
          tagName: '',
          template: Ember.Handlebars.compile(additionalListItems.join(''))
        });
      } else {
        return false;
      }
    }
  }.property('node.socketsEnum.@each', 'node.isScheduled'),

  actions: {
    performAction: function(method, contextNode, socket) {
      if (method == 'schedule') {
        contextNode.get('parentController').send(method, contextNode, socket);
      } else {
        contextNode.get('parentController').send(method, contextNode);
      }
    }
  }

});
