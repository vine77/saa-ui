App.Router.map(function () {
  this.resource('login');
  this.resource('tempPassword');
  this.resource('profile', {path: 'profiles/:user_id'});
  this.resource('modal');
  this.resource('dashboard');
  this.resource('help');
  this.resource('roles');
  this.resource('nodes', function () {
    this.resource('nodesNode', {path: '/:node_id'}, function () {
      this.route('graphs');
      this.route('vms');
    });
  });
  this.resource('vms', function () {
    this.resource('vmsVm', {path: '/:vm_id'}, function () {
      this.route('graphs');
    });
  });
  this.resource('data');
  this.resource('logs');
  this.resource('services', function () {
    this.resource('slas', function () {
      this.route('create');
      this.resource('sla', {path: '/:sla_id'}, function () {
        this.route('edit');
      });
    });
    this.resource('flavors', function () {
      this.route('create');
      this.resource('flavor', {path: '/:flavor_id'}, function () {
        this.route('edit');
      });
    });
  });
  this.resource('trust', function () {
    this.resource('trust.mles', {path: 'mles'}, function () {
     this.resource('trust.mle', {path: '/:trustMle_id'});
    });
    this.route('dashboard');
  });
  this.resource('settings', function () {
    this.route('upload');
    this.route('network');
    this.route('mailserver');
    this.route('users');
    this.route('dev');
    this.route('log');
    this.route('trust');
  });
  this.resource('statuses', function () {
    this.resource('status1', {path: '/:status1_id'}, function () {
      this.resource('status2', {path: '/:status2_id'}, function () {
        this.resource('status3', {path: '/:status3_id'}, function () {
          this.resource('status4', {path: '/:status4_id'}, function () {
            this.resource('status5', {path: '/:status5_id'}, function () {
              this.resource('status6', {path: '/:status6_id'}, function () {
                this.resource('status7', {path: '/:status7_id'}, function () {
                  this.resource('status8', {path: '/:status8_id'}, function () {
                    this.resource('status9', {path: '/:status9_id'}, function () {
                      this.resource('status10', {path: '/:status10_id'});
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
