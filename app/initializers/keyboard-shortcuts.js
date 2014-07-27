import Ember from 'ember';

export default {
  name: 'keyboard-shortcuts',
  initialize: function(container, application) {
    window.Mousetrap.bind('shift+ctrl+alt+i', function(e) {
      Ember.$('footer').toggle();
    });
  }
};
