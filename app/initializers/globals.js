import selectTab from '../utils/select-tab';

export default {
  name: 'globals',
  initialize: function(container, application) {
    if (typeof window.App === 'undefined') window.App = {};
    window.App.selectTab = selectTab;
  }
};
