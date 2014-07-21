import Ember from 'ember';

export default Ember.Controller.extend({
  id:'',
  message: '',
  validated_fields: [],
  reset_fields:[],
  actions: {
    removeNotification: function() {
      Ember.$(this.id + '-notification').hide();
      this.set('message', "");
    }
  },
  showTooltip: function(field) {
    field_id = this.id + '-' + field;
    Ember.$(field_id).tooltip({
      title: 'Please enter ' + this.fieldname[field] + '.',
      placement: 'right',
      trigger: 'manual'
    }).tooltip('show');
  },
  hideTooltips: function() {
    for (var i=0; i< this.validated_fields.length; i++) {
      field_id = this.id + '-' + this.validated_fields[i];
      if (typeof(Ember.$(field_id).data('tooltip')) !== 'undefined') {
        Ember.$(field_id).tooltip('destroy');
      }
    }
  },
  showNotification: function(message) {
    this.set('message', message);
    Ember.$(this.id + '-notification').show();
  },
  setDisable: function(state, element) {
    var id;
    if (typeof element === 'undefined') {
      id = this.id;
      Ember.$( id + ' :input').prop('disabled', state);
    } else {
      id = this.id + '-' + element;
      if (state) {
        Ember.$(id).prop('disabled', state);
      } else {
        Ember.$(id).removeProp('disabled');
      }
    }
  },
  validate: function(obj) {
    for (var i=0; i < this.validated_fields.length; i++) {
      field = this.validated_fields[i];
      if (!obj[field]) {
        throw {
          name: 'ValidationError',
          error: field + ' cannot be blank.',
          field: field
        };
      }
    }
  },
  prepare_commit: function(record) {
    try {
      this.hideTooltips();
      this.validate(record);
      this.setDisable(true);
    } catch (e) {
      if (e.name == 'ValidationError') {
        this.showTooltip(e.field);
        return false;
      }
      throw e;
    }
    return true;
  },
  reset_form: function() {
    this.setDisable(false);
    for (var i=0; i < this.reset_fields.length; i++) {
      field = this.reset_fields[i];
      this.set(field, '');
    }
  }
});
