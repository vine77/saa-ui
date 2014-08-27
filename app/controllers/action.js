import Ember from 'ember';
import mtWilson from '../models/mt-wilson';
import Mode from '../utils/mappings/mode';

export default Ember.ObjectController.extend({
  isDisabled: function() {
    return this.get('node.isRebooting') && this.get('disabledWhileRebooting') || (this.get('method') == 'setAssuredVm');
  }.property('node.@each', 'node.isRebooting'),
  isListItem: function() {
    switch (this.get('method')) {
      case 'exportTrustReport':
        return mtWilson.get('isInstalled');
      case 'removeTrust':
        return (mtWilson.get('isInstalled')) ? this.get('node.isTrustRegistered') : false;
      case 'addTrust':
        return (mtWilson.get('isInstalled')) ? !this.get('node.isTrustRegistered') : false;
      case 'trustFingerprint':
        return mtWilson.get('isInstalled');
      case 'configureTrustAgent':
        return mtWilson.get('isInstalled');
      case 'unschedule':
        return this.get('node.isScheduled');
      case 'schedule':
        return false;
      case 'unregister':
        return this.get('node.samRegistered');
      case 'setMonitored':
        return (this.get('node.isAgentInstalled') && (this.get('node.samControlled') !== Mode.MONITORED));
      case 'setAssuredVcpu':
        return (this.get('node.isAgentInstalled') && (this.get('node.samControlled') !== Mode.ASSURED_SCU_VCPU));
      case 'setAssuredVm':
        return (this.get('node.isAgentInstalled') && (this.get('node.samControlled') !== Mode.ASSURED_SCU_VM));
      case 'setAssuredCores':
        return (this.get('node.isAgentInstalled') && (this.get('node.samControlled') !== Mode.ASSURED_CORES_PHYSICAL));
      default:
        return false;
    }
  }.property('node.isAssured', 'node.isMonitored', 'node.samRegistered', 'node.isScheduled', 'node.isTrustRegistered'),
  additionalListItems: function() {
    var additionalListItems = [];
    if (this.get('method') === 'schedule') {
      if (this.get('node') && !this.get('node.isScheduled')) {
        this.get('node.socketsEnum').forEach( function(item, index, enumerable) {
          additionalListItems.push('<li {{bind-attr class="isDisabled:disabled"}}><a {{action "performAction" method contextNode '+item+'}}><i class="icon-magnet"></i> Place VMs on Socket '+item+'</a></li>');
        });
      }
    }
    if (additionalListItems.length > 0) {
      return Ember.View.extend({
        tagName: '',
        template: Ember.Handlebars.compile(additionalListItems.join(''))
      });
    } else {
      return false;
    }
  }.property('node.socketsEnum.@each', 'node.isScheduled'),
  actions: {
    performAction: function(method, contextNode, thirdArgument) {
      if (method === 'schedule' || method === 'setAssured') {
        contextNode.get('parentController').send(method, contextNode, thirdArgument);
      } else {
        contextNode.get('parentController').send(method, contextNode);
      }
    }
  }
});
