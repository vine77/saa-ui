App.statusMap = function (context) {
  return context.resource('statuses', function () {
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
};
