App.ProfileController = App.FormController.extend({
    getMailServer: false,
    redirectOnSave: '',
    username: '',
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
    email: '',
    id: '#profile',
    validated_fields:['oldPassword', 'newPassword1', 'newPassword2', 'email'],
    reset_fields:['oldPassword', 'newPassword1', 'newPassword2'],
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
                controller.showNotification("Passwords don't match");
            }
            else {
                record.newPassword = record.newPassword1;
                delete record.newPassword1;
                delete record.newPassword2;
                model.setProperties(record);
                var nextRoute = controller.get('redirectOnSave');
                var updateStatus = function(message, isSuccess) {
                    return function(model, controller, route) {
                        if(nextRoute != '') {
                            route.controllerFor(nextRoute).showNotification(message);
                        }
                        else {
                            controller.showNotification(message);
                        }
                        model.reload();
                        controller.reset_form();
                        if (isSuccess) {
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
                    var doNothing = updateStatus('');
                    doNothing();
                }
            }
            if(controller.getMailServer) {
                var mail_controller = route.controllerFor('settings.mailserver');
                mail_controller.saveConfig(route, false);
            }                        
        }
    },
    sendTestEmail: function(route) {
        var controller = this;
        if(controller.getMailServer) {
            var mail_controller = route.controllerFor('settings.mailserver');
            mail_controller.saveConfig(route, true);
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