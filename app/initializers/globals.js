import Ember from 'ember';
import selectTab from '../utils/select-tab';

export default {
  name: 'inflector',
  initialize: function(container, application) {
    if (typeof App === 'undefined') App = {};
    App.selectTab = selectTab;
  }
};
