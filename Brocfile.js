/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var app = new EmberApp();

var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var trees = [];

// Import app-specific dependencies
app.import('vendor/bootstrap/js/bootstrap.js');
app.import('vendor/bootstrap-datepicker/js/bootstrap-datepicker.js');
app.import('vendor/pnotify/jquery.pnotify.js');
app.import('vendor/jquery-cookie/jquery.cookie.js');

app.import('vendor/zynga-scroller/src/Animate.js');
app.import('vendor/zynga-scroller/src/Scroller.js');
app.import('vendor/list-view/dist/list-view.prod.js');
app.import('vendor/ember-json-api/dist/json_api_adapter.js');
app.import('vendor/group-helper/packages/group-helper/lib/main.js');
app.import('vendor/modernizr/modernizr.js');
app.import('vendor/moment/moment.js');
app.import('vendor/d3/d3.js');
app.import('vendor/mousetrap/mousetrap.js');
app.import('vendor/jspdf/dist/jspdf.min.js');
app.import('vendor/filesaver/FileSaver.js');
app.import('vendor/natural-sort/naturalSort.js');

trees.push(pickFiles('vendor', {
  srcDir: '/font-awesome/font',
  files: ['*.woff', '*.ttf', '*.svg', '*.eot'],
  destDir: '/fonts'
}));

trees.push(app.toTree());
tree = mergeTrees(trees);

module.exports = tree;
