App.TempPasswordController = App.FormController.extend({
    username: '',
    id: '#tempPassword',
    validated_fields: ['username'],
    fieldname: {
        username: 'user name'
    },
    errorString: function(error) {
        var errorTbl = {
            'unauthorized.' : 'Temporary passwords can be generated only once every 120 mins.',
            'internal server error.' : 'Email not sent.',
        };
        var key = error.toLowerCase();
        if( typeof(errorTbl[key]) != 'undefined' ) {
            return errorTbl[key];
        }
        else {
            return error;
        }
    },
    generatePassword: function(route) {
        var controller = this;
        var user = this.store.find('user', controller.get('username'));
        var request_reset = function(model, controller, route) {
            user.set('resetPassword', true);
            var updateUI = function(message) {
                return function(model, controller, route, error_args) {
                    controller.reset_form();
                    var error = error_args[0].error;
                    if(typeof(error) != 'undefined') {
                        message = message + ' ' + controller.errorString(error);
                    }
                    var login_controller = route.controllerFor('login');
                    login_controller.showNotification(message);
                    controller.setDisable(false);
                    model.unloadRecord();
                }
            };
            var handlers = {
                'didUpdate' : {postFun:updateUI('Temporary password generated successfully.'), nextRoute:'login'},
                'becameError' : {postFun:updateUI('Failed to generate temporary password.'), resetState:true, nextRoute: 'login'}
            };
            App.modelhelper.doTransaction(model, controller, route, handlers);
        };
        var show_error = function(model, controller, route) {
            controller.setDisable(false);
            controller.showNotification('Failed to load user information');
        };
        var handlers = {
            'didLoad' : {postFun:request_reset},
            'becameError' : {postFun:show_error, resetState:true}
        };
        controller.setDisable(true);
        if(!user.get('isLoaded')) {
            App.modelhelper.doTransaction(user, controller, route, handlers);
        }
        else {
            request_reset(user, controller, route);
        }
    }
});
