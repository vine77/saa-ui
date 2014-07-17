import Ember from 'ember';

var Router = Ember.Router.extend({
  location: SaaUiENV.locationType
});

Router.map(function() {
  this.resource('login');
  this.resource('blocked');
  this.resource('profile', {path: '/profiles/:user_id'});
  this.resource('tempPassword');
  this.resource('app', function () {  // Routes under /app must be authenticated
    this.resource('dashboard');
    this.resource('settings', function () {
      this.route('upload');
      this.route('network');
      this.route('mailserver');
      this.route('users');
      this.route('user', {path: 'users/:user_id'});
      this.route('dev');
      this.route('log');
      this.route('trust');
      this.route('controller');
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
                        this.resource('status10', {path: '/:status10_id'}, function () {
                          this.resource('status11', {path: '/:status11_id'}, function () {
                            this.resource('status12', {path: '/:status12_id'}, function () {
                              this.resource('status13', {path: '/:status13_id'}, function () {
                                this.resource('status14', {path: '/:status14_id'}, function () {
                                  this.resource('status15', {path: '/:status15_id'}, function () {
                                    this.resource('status16', {path: '/:status16_id'}, function () {
                                      this.resource('status17', {path: '/:status17_id'}, function () {
                                        this.resource('status18', {path: '/:status18_id'}, function () {
                                          this.resource('status19', {path: '/:status19_id'}, function () {
                                            this.resource('status20', {path: '/:status20_id'});
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

export default Router;
