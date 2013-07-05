App.Store.registerAdapter('App.Template', DS.FixtureAdapter.extend());

App.Template = DS.Model.extend({
  actions: DS.hasMany('App.Action'),
  vms: DS.hasMany('App.Vm'),
  numberOfVms: function () {
    return this.get('vms.length');
  }.property('vms.@each'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  version: DS.attr('string'),
  template: DS.attr('string'),
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive')
});

App.Template.FIXTURES = [{
    id: 1,
    name: 'Drupal',
    description: 'Drupal is an open source content management platform powering millions of websites and applications. This template installs a singe instance deployment with a local MySQL database for storage.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 2,
    name: 'Gollum',
    description: 'Gollum is a simple wiki system built on top of Git that powers GitHub Wikis. This template installs a Gollum Wiki stack on a single instance.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 3,
    name: 'Insoshi',
    description: 'Insoshi is an open source social networking platform in Ruby on Rails. This template creates a Insoshi stack using a single instance and a local MySQL database for storage.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 4,
    name: 'Joomla',
    description: 'Joomla! is a free, open-source content management system (CMS) and application framework. This template installs a single-instance Joomla! deployment using a local MySQL database to store the data.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 5,
    name: 'Redmine',
    description: 'Redmine is a  flexible project management web application which includes a gantt chart, calendar, wiki, forums, multiple roles, and email notification. This template installs a Redmine stack using a single instance with a local MySQL database for storage.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 6,
    name: 'Tracks',
    description: 'Tracks is a web-based application to help you implement David Allens Getting Things Done methodology. This template installs a Tracks stack using a single instance with a local MySQL database for storage.',
    version: '2010-09-09',
    vms: []
  }, {
    id: 7,
    name: 'WordPress',
    description: 'WordPress is web software you can use to create a beautiful website or blog. This template installs a single-instance WordPress deployment using a local MySQL database to store the data.',
    version: '2010-09-09',
    vms: []
  }
];
