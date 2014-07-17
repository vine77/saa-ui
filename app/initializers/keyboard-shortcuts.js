import Ember from 'ember';

export default {
  name: 'keyboard-shortcuts',
  initialize: function(container, application) {
    Mousetrap.bind('shift+ctrl+alt+i', function (e) {
      $('footer').toggle();
    });
  }
};
