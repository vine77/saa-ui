App.LoginController = App.FormController.extend({
    username: '',
    password: '',
    id: '#login',
    validated_fields: ['username', 'password'],    
    fieldname: {
        username: 'user name',
        password: 'password'
    },
    createSession: function(route) {
        var controller = this;
        var record = {'username': controller.get('username'), 'password': controller.get('password')};
        if(controller.prepare_commit(record))
        {
            controller.set('password', '');
            var updateUI = function(message) {
                return function(model, controller, route) {
                    controller.showNotification(message);
                    controller.reset_form();
                    }
            };
            var getUserProfile = function(model, controller, route, error_args) {
                var username = controller.get('username');
                var user = App.User.find(username);
                route.controllerFor('profile').set('message', 'Please change your password.');
                route.controllerFor('profile').set('redirectOnSave', 'login');
                route.controllerFor('profile').set('getMailServer', true);
                user.on('didLoad', function() {
                                        route.controllerFor('profile').initFields(user);
                                    });
                route.transitionTo('profile', user);
            };
            var session = App.Session.createRecord(record);
            var handlers = {
                'didCreate' : {postFun:updateUI(''), nextRoute:'index'},
                'becameError' : {postFun:updateUI('Invalid Credentials.'), resetState:true},
                'becameInvalid' : {postFun:getUserProfile}
            };
            App.modelhelper.doTransaction(session, controller, route, handlers);
        }
    }
});
