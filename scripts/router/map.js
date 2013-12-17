App.Router.map(function () {
  this.resource('login');
  this.resource('profile', {path: '/profiles/:user_id'});
  this.resource('tempPassword');
  this.resource('app', function () {  // Routes under /app must be authenticated
    this.resource('dashboard');
    App.statusMap(this);
    this.resource('settings', function () {
      this.route('upload');
      this.route('network');
      this.route('mailserver');
      this.route('users');
      this.route('dev');
      this.route('log');
      this.route('trust');
    });
    this.resource('data', function () {  // Routes under /data must have successful promises
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
      });
    });
  });
});
