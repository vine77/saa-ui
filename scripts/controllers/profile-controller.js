App.ProfileController = App.FormController.extend({
    getMailServer: false,
    getEmail: true,
    redirectOnSave: '',
    username: '',
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
    email: '',
    id: '#profile',
    validated_fields:['oldPassword', 'newPassword1', 'newPassword2'],
    reset_fields:['oldPassword', 'newPassword1', 'newPassword2'],
    errorString: function(error) {
        var errorTbl = {
            'unauthorized.' : 'Invalid password.',
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
        username: 'user name',
        oldPassword: 'current password',
        newPassword1: 'new password',
        newPassword2: 'new password',
        email: 'user email'
    },
    initFields: function(model) {
        this.set('username', model.get('username'));
        this.set('email', model.get('email'));
        this.set('oldPassword', '');
        this.set('newPassword1', '');
        this.set('newPassword2', '');
    },
    saveProfile: function (route) {
        var controller = this;
        var model = controller.get('model');
        var record = {
                'username' : controller.username,
                'oldPassword' : controller.oldPassword,
                'newPassword1' : controller.newPassword1,
                'newPassword2' : controller.newPassword2,
                'email' : controller.email,
        };

        if(controller.prepare_commit(record)) {
            if(controller.newPassword1 != controller.newPassword2) {
                controller.showNotification("Passwords don't match.");
                controller.reset_form();                
            }
            else {
                var email_configured = false;
                email_configured = (controller.email != '');
                if(controller.getMailServer) {
                    var mailServerValid = true;
                    var mail_controller = route.controllerFor('settings.mailserver');
                    mailServerValid = mail_controller.saveConfig(route, false);
                    if(!mailServerValid) {
                        email_configured = false;
                    }
                }
                if(!email_configured) {
                    if(!confirm('Invalid email address or mail server configuration.\
 A valid email configuration is needed to recover if you forget the password.\
\nClick \'Ok\' to continue without this information.')) {
                        controller.reset_form();
                        return false;
                    }
                }
                record.newPassword = record.newPassword1;
                delete record.newPassword1;
                delete record.newPassword2;
                model.setProperties(record);
                var nextRoute = controller.get('redirectOnSave');
                var updateStatus = function(message, isSuccess) {
                    return function(model, controller, route, error_args) {
                        if(isSuccess && (nextRoute != '')) {
                            route.controllerFor(nextRoute).showNotification(message);
                        }
                        else {
                            if(!isSuccess) {
                                var error = error_args[0].error;
                                if(typeof(error) != 'undefined') {
                                    message = message + ' ' + controller.errorString(error);
                                }                        
                            }
                            controller.showNotification(message);
                        }
                        model.reload();
                        controller.reset_form();
                        if (isSuccess) {
                            controller.set('getEmail', true);
                            controller.set('getMailServer', false);
                        }
                    }
                };
                if(model.get('isDirty')) {
                    var handlers = {
                        'didUpdate': {postFun:updateStatus('Profile saved successfully.', true)},
                        'becameError': {postFun:updateStatus('Failed to save profile.', false), resetState: true},
                    };
                    if(nextRoute != '') {
                        handlers['didUpdate'].nextRoute = nextRoute;
                    }
                    controller.setDisable(true);
                    App.modelhelper.doTransaction(model, controller, route, handlers);
                }
                else {
                    controller.showNotification('');
                    controller.reset_form();
                }
            }
        }
        else {
            return false;
        }
        return true;
    },
    sendTestEmail: function(route) {
        var controller = this;
        if(controller.getMailServer) {
            var updateNotification = function(msg) {
                controller.showNotification(msg);
            };
            var mail_controller = route.controllerFor('settings.mailserver');
            mail_controller.saveConfig(route, true, updateNotification);
        }                    
    },
    resetProfile: function(route) {
        var controller = this;
        var model = this.get('model');
        controller.reset_form();
        controller.setDisable(true, 'username');
        controller.initFields(model);
        if(controller.getMailServer) {
            var mail_controller = route.controllerFor('settings.mailserver');
            mail_controller.resetConfig(route);
        }
    }
  });
