import Ember from 'ember';
import selectTab from '../utils/select-tab';

export default {
  name: 'globals',
  initialize: function(container, application) {
    if (typeof App === 'undefined') App = {};
    window.App.selectTab = selectTab;
  }
};
