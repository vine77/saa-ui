// TODO: Migrate Sunil's authentication code
App.SettingsMailserverController = App.FormController.extend({
    standalone: true,
    hostname:'',
    port:'',
    username:'',
    password:'',
    sender_email:'',
    id: '#mailserver',
    validated_fields: ['hostname', 'port', 'sender_email'],
    reset_fields: ['password'],
    errorString: function(error) {
        var errorTbl = {
            'internal server error.' : 'An internal error occured.',
        };
        var key = error.toLowerCase();
        if( typeof(errorTbl[key]) != 'undefined' ) {
            return errorTbl[key];
        }
        else {
            return error;
        }
    },
    fieldname: {
        hostname: 'mail server host name or IP address',
        port: 'mail server port number',
        username: 'mail server user name',
        password: 'mail server password',
        sender_email: 'sender email (from address)'
    },
    initFields: function(model) {
        this.set('hostname', model.get('hostname'));
        this.set('port', model.get('port'));
        this.set('username', model.get('username'));
        this.set('password', model.get('password'));
        this.set('sender_email', model.get('sender_email'));
    },
    saveConfig: function (route, testConfig, notify) {
        var controller = this;
        var model = controller.get('model');
        var record = {
                'hostname' : controller.hostname,
                'port' : controller.port,
                'username' : controller.username,
                'password' : controller.password,
                'sender_email' : controller.sender_email,
                'test_config': testConfig
        };
        if(controller.prepare_commit(record)) {
            model.setProperties(record);
            var updateStatus = function(message) {
                return function(model, contoller, route, error_args) {
                    var error = error_args[0].error;
                    if(typeof(error) != 'undefined') {
                        message = message + ' ' + controller.errorString(error);
                    }
                    if(controller.standalone) {
                        controller.showNotification(message);
                    }
                    else if (typeof notify != 'undefined') {
                        notify(message);
                    }
                    model.reload();
                    controller.reset_form();
                }
            };
            if(model.get('isDirty')) {
                successMsg = 'Mail server settings saved.';
                errorMsg = 'Failed to save mail server settings.';
                if(testConfig) {
                    successMsg = 'Sent test email to ' + this.get('sender_email');
                    errorMsg = 'Failed to send test email.';
                }
                var handlers = {
                    'didUpdate': {postFun:updateStatus(successMsg)},
                    'becameError': {postFun:updateStatus(errorMsg), resetState: true},
                };
                controller.setDisable(true);
                App.modelhelper.doTransaction(model, controller, route, handlers);
            }
            else {
                    controller.showNotification('');
                    controller.reset_form();
            }
        }
        else {
            return false;
        }
        return true;
    },
    resetConfig: function(route) {
        var controller = this;
        var model = this.get('model');
        model.get('transaction').rollback();
        controller.reset_form();
        controller.initFields(model);
    }
});
