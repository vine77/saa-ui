App.FormController = Ember.Controller.extend({
    id:'',
    message: '',
    validated_fields: [],
    reset_fields:[],
    actions: {
        removeNotification: function() {
            $(this.id + '-notification').hide();
            this.set('message', "");
        }
    },
    showTooltip: function(field) {
        field_id = this.id + '-' + field;
        $(field_id).tooltip({
          title: 'Please enter ' + this.fieldname[field] + '.',
          placement: 'right',
          trigger: 'manual'
        }).tooltip('show');
    },
    hideTooltips: function() {
        for(var i=0; i< this.validated_fields.length; i++)
        {
            field_id = this.id + '-' + this.validated_fields[i];
            if (typeof($(field_id).data('tooltip')) !== 'undefined')
            {
                $(field_id).tooltip('destroy');
            }
        }
    },
    showNotification: function(message) {
        this.set('message', message);
        $(this.id + '-notification').show();
    },
    setDisable: function(state, element) {
        var id;
        if (typeof element === 'undefined')
        {
            id = this.id;
            $( id + ' :input').prop('disabled', state);
        }
        else
        {
            id = this.id + '-' + element;
            if(state) {
                $(id).prop('disabled', state);
            }
            else {
                $(id).removeProp('disabled');
            }
        }
    },
    validate: function(obj) {
        for(var i=0; i < this.validated_fields.length; i++)
        {
            field = this.validated_fields[i];
            if(!obj[field]) {
                throw { name: 'ValidationError', 
                        error: field + ' cannot be blank.', 
                        field: field };
            }
        }
    },
    prepare_commit: function(record) {
        try
        {
            this.hideTooltips();
            this.validate(record);
            this.setDisable(true);
        }
        catch(e)
        {
            if (e.name == 'ValidationError')
            {
                this.showTooltip(e.field);
                return false;
            }
            throw e;
        }
        return true;
    },
    reset_form: function() {
        this.setDisable(false);
        for(var i=0; i < this.reset_fields.length; i++)
        {
            field = this.reset_fields[i];
            this.set(field, '');
        }
    }
});
