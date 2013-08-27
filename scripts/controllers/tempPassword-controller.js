App.TempPasswordController = App.FormController.extend({
    username: '',
    id: '#tempPassword',
    validated_fields: ['username'],    
    fieldname: {
        username: 'user name'
    },
    generatePassword: function(route) {
        var controller = this;
        var user = App.User.find(controller.get('username'));
        var request_reset = function(model, controller, route) {
            user.set('resetPassword', true);
            var updateUI = function(message) {
                return function(model, controller, route) {
                    controller.reset_form();
                    var login_controller = route.controllerFor('login');
                    login_controller.showNotification(message);
                    controller.setDisable(false);
                    model.reload();
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
