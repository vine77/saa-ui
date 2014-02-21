App.NodeActionsCollectionView = Ember.CollectionView.extend({
  tagName: '',
  node: '',
  sortProperties: ['sortOrder'],
  content: function() {
    return [
      {
        name: 'Export Trust Report',
        method: 'exportTrustReport',
        icon: 'icon-external-link',
        disabledWhileRebooting: false,
        sortOrder: 0
      },
      {
        name: 'Remove Trust',
        method: 'removeTrust',
        icon: 'icon-unlock',
        disabledWhileRebooting: true,
        sortOrder: 1
      },
      {
        name: 'Add Trust',
        method: 'addTrust',
        icon: 'icon-lock',
        disabledWhileRebooting: true,
        sortOrder: 2
      },
      {
        name: 'Fingerprint',
        method: 'trustFingerprint',
        icon: 'icon-hand-up',
        disabledWhileRebooting: true,
        sortOrder: 3
      },
      {
        name: 'Configure Trust Agent',
        method: 'configureTrustAgent',
        icon: 'icon-unlock-alt',
        disabledWhileRebooting: true,
        sortOrder: 4
      },
      {
        name: 'Unset for VM placement',
        method: 'unschedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: false,
        sortOrder: 5
      },
      {
        name: 'Place VMs on Socket',
        method: 'schedule',
        icon: 'icon-magnet',
        disabledWhileRebooting: true,
        sortOrder: 6
      },
      {
        name: 'Unregister',
        method: 'unregister',
        icon: 'icon-remove',
        disabledWhileRebooting: false,
        sortOrder: 7
      },
      {
        name: 'Set agent mode to monitored',
        method: 'setMonitored',
        icon: 'icon-eye-open',
        disabledWhileRebooting: true,
        sortOrder: 8
      },
      {
        name: 'Set agent mode to assured',
        method: 'setAssured',
        icon: 'icon-trophy',
        disabledWhileRebooting: true,
        sortOrder: 9
      },
    ];
  }.property(),

  itemViewClass: Ember.View.extend({
    tagName: '',
    node: function () {
      if (this.get('parentView')) {
        return this.get('parentView.node');
      }
    }.property('parentView'),
    isDisabled: function() {
      if (this.get('node.isRebooting') && (this.get('content.disabledWhileRebooting')) ) {
        return true;
      } else {
        return false;
      }
    }.property('node', 'node.isRebooting'),
    isListItem: function() {
      switch (this.get('content.method')) {
        case 'exportTrustReport':
          if (App.mtWilson.get('isInstalled')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'removeTrust':
          if (App.mtWilson.get('isInstalled') && this.get('node.isTrustRegistered')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'addTrust':
          if (App.mtWilson.get('isInstalled') && !this.get('node.isTrustRegistered')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'trustFingerprint':
          if (App.mtWilson.get('isInstalled')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'configureTrustAgent':
          if (App.mtWilson.get('isInstalled')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'unschedule':
          if (this.get('node.isScheduled')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'schedule':
          return false;
          break;
        case 'unregister':
          if (this.get('node.samRegistered')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'setMonitored':
          if (this.get('node.isMonitored')) {
            return true;
          } else {
            return false;
          }
          break;
        case 'setAssured':
          if (this.get('node.isAssured')) {
            return true;
          } else {
            return false;
          }
          break;
        default:
          return false;
      }
    }.property('node'),
    areAdditionalListItems: function() {
      var additionalListItems = [];
      if (this.get('content.method') == 'schedule') {
        if (!this.get('node.isScheduled') && this.get('node')) {
          this.get('node.socketsEnum').forEach( function(item, index, enumerable) {
            additionalListItems.push('<li {{bind-attr class="view.isDisabled:disabled"}}><a {{action "schedule" view.node '+item+'}}><i class="icon-magnet"></i> Place VMs on Socket '+item+'</a></li>');
          });
        }
      }
      return additionalListItems;
    }.property('node.socketsEnum.@each'),
    template: function () {
      if (this.get('isListItem')) {
        return Ember.Handlebars.compile('<li {{bind-attr class="view.isDisabled:disabled"}}>'+
                                        '{{#if view.isDisabled}}'+
                                        '<a><i class="'+this.get('content.icon')+'"></i> '+this.get('content.name')+'</a>'+
                                        '{{else}}'+
                                        '<a {{action "'+this.get('content.method')+'" view.node}}><i class="'+this.get('content.icon')+'"></i> '+this.get('content.name')+'</a>'+
                                        '{{/if}}'+
                                        '</li>');
      }
      if (this.get('areAdditionalListItems').length > 0) {
        return Ember.Handlebars.compile(this.get('areAdditionalListItems').join(''));
      }
    }.property('App.mtWilson.isInstalled', 'node.isRebooting', 'node', 'view.isDisabled')
  }),
});
