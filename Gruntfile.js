'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Define paths
  var pathsConfig = {
    source: '.',
    destination: 'public'
  };

  grunt.initConfig({
    paths: pathsConfig,
    watch: {
      emberTemplates: {
        files: ['<%= paths.source %>/scripts/templates/**/*.handlebars'],
        tasks: ['emberTemplates']
      },
      coffee: {
        files: ['<%= paths.source %>/scripts/*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/*.coffee'],
        tasks: ['coffee:test']
      },
      less: {
        files: ['<%= paths.source %>/styles/*.less', '<%= paths.source %>/styles/theme/*.less'],
        tasks: ['less']
      },
      livereload: {
        port: 8889,
        files: [
          '<%= paths.source %>/*.html',
          '{.tmp,<%= paths.source %>}/styles/*.css',
          '{.tmp,<%= paths.source %>}/scripts/*.js',
          '<%= paths.source %>/images/*.{png,jpg,jpeg}'
        ],
        tasks: ['livereload']
      }
    },
    livereload: {
      port: 8889
    },
    connect: {
      options: {
        hostname: null,
        port: 8000
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            return [
              function (req, res, next) {
                // Add CORS
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

                // Log requests to terminal
                console.log(req.method, req.url);

                /*
                if (req.method === 'POST') {
                  res.writeHead(404, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({'errors': {'name': 'Invalid parameter'}}));
                  return;
                }
                */

                // Serve API requests
                if (req.url.indexOf('/api/') === 0) {
                  // Remove trailing slashes
                  if (req.url.slice(-1) === '/') req.url = req.url.slice(0, -1);
                  // Add extension (including method for for non-GET requests, e.g. .post.json)
                  var extension = (req.method === 'GET') ? '.json' : '.' + req.method.toLowerCase() + '.json';
                  // Add .json extension
                  if (req.url.indexOf('.json') === -1) {
                    if (req.url.indexOf('?') === -1) {
                      req.url = req.url + extension;
                    } else {
                      req.url = req.url.split('?')[0] + extension + '?' + req.url.split('?')[1];
                    }
                  } else {
                    req.url = req.url.replace('.json', extension);
                  }
                  // If ids is specified in URL query string, compose response here programatically
                  // Otherwise use next() to pass it on to serve with connect.static
                  if (req.url.indexOf('?') !== -1 && req.url.split('?')[1].indexOf('ids=') === 0) {
                    var ids = req.url.split('?')[1].slice(4).split(',');
                    var path = require('path').resolve(pathsConfig.source + req.url.split('?')[0]);
                    if (!require('fs').existsSync(path)) {
                      res.writeHead(404, {'Content-Type': 'application/json'});
                      res.end(JSON.stringify({'errors': ['Could not find JSON file']}));
                      return;
                    } else {
                      // Get the full JSON response to start with all records
                      var json = JSON.parse(require('fs').readFileSync(path));
                      // Remove records that don't match ids from query string
                      for (var i = 0; i < json[Object.keys(json)[0]].length; i++) {
                        if (ids.indexOf(json[Object.keys(json)[0]][i].id.toString()) === -1) {
                          json[Object.keys(json)[0]].splice(i--, 1);
                        }
                      }
                    }
                    res.end(JSON.stringify(json, null, 2));
                    return;
                  }
                }
                next();
              },
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pathsConfig.source),
              connect.static(options.base),         // Serve static files
              connect.directory(options.base)       // Make empty directories browsable
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, pathsConfig.destination)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      temp: ['.tmp', '<%= paths.source %>/styles/theme.css', '<%= paths.source %>/scripts/templates.js'],
      public: {
        options: {
          force: true
        },
        src: ['../<%= paths.destination %>/**', '!../<%= paths.destination %>', '!../<%= paths.destination %>/kibana3/**']  // This clean path should match the last copy path (one dir up)
      },
      dist: ['.tmp', '<%= paths.destination %>', '<%= paths.source %>/styles/theme.css', '<%= paths.source %>/scripts/templates.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= paths.source %>/scripts/*.js',
        'test/spec/*.js'
      ]
    },
    emberTemplates: {
      options: {
        templateName: function (sourceFile) {
          return sourceFile.replace(pathsConfig.source + '/scripts/templates/', '');
        }
      },
      server: {
        files: {
          '.tmp/scripts/templates.js': ['<%= paths.source %>/scripts/templates/**/*.handlebars']
        }
      },
      dist: {
        files: {
          '<%= paths.source %>/scripts/templates.js': ['<%= paths.source %>/scripts/templates/**/*.handlebars']
        }
      }
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    coffee: {
      dist: {
        files: {
          '.tmp/scripts/coffee.js': '<%= paths.source %>/scripts/*.coffee'
        }
      },
      test: {
        files: [{
          expand: true,
          cwd: '.tmp/spec',
          src: '*.coffee',
          dest: 'test/spec'
        }]
      }
    },
    less: {
      options: {
        paths: ['<%= paths.source %>/styles']
      },
      server: {
        files: {
          '.tmp/styles/theme.css': '<%= paths.source %>/styles/theme.less'
        }
      },
      dist: {
        files: {
          '<%= paths.source %>/styles/theme.css': '<%= paths.source %>/styles/theme.less'
        }
      },
      debug: {
        files: {
          '<%= paths.destination %>/styles/theme.css': '<%= paths.source %>/styles/theme.less'
        }
      }
    },
    concat: {
      dist: {}
    },
    uglify: {
      dist: {
        files: {
          '<%= paths.destination %>/scripts/main.js': [
            '.tmp/scripts/*.js',
            '<%= paths.source %>/scripts/*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= paths.source %>/index.html',
      options: {
        dest: '<%= paths.destination %>'
      }
    },
    usemin: {
      html: ['<%= paths.destination %>/*.html'],
      css: ['<%= paths.destination %>/styles/*.css'],
      options: {
        dirs: ['.tmp', '<%= paths.destination %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.source %>/images/',
          dest: '<%= paths.destination %>/images/',
          src: [
            '*.{png,jpg}'
          ]
        }]
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          '<%= paths.destination %>/styles/main.css': '<%= paths.destination %>/styles/main.css'
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
        /*removeCommentsFromCDATA: true,
        // https://github.com/paths.grunt-usemin/issues/44
        //collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= paths.source %>',
          src: '*.html',
          dest: '<%= paths.destination %>'
        }]
      }
    },
    copy: {
      js: {
        files: [{
          expand: true,
          flatten: false,
          cwd: '<%= paths.source %>/scripts/',
          src: ['main.js', '**/*.js'],
          dest: '<%= paths.destination %>/scripts/'
        }]
      },
      definitions: {
        files: [{
          expand: true,
          flatten: false,
          cwd: '<%= paths.source %>/definitions/',
          src: ['**/*.json'],
          dest: '<%= paths.destination %>/definitions/'
        }]
      },
      components: {
        files: [{
          expand: true,
          flatten: false,
          cwd: '<%= paths.source %>/components/',
          src: ['**/*.js', '**/*.css'],
          dest: '<%= paths.destination %>/components/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= paths.source %>/images/',
          src: ['**', '!pastel/**'],
          dest: '<%= paths.destination %>/images/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= paths.source %>/font/',
          src: '**',
          dest: '<%= paths.destination %>/font/'
        }, {
          expand: true,
          cwd: '<%= paths.source %>/components/font-awesome/font/',
          src: '**',
          dest: '<%= paths.destination %>/font/'
        }]
      },
      project: {
        files: [{
          cwd: '<%= paths.source %>',
          src: ['*.{ico,txt}', '.htaccess'],
          dest: '<%= paths.destination %>',
          expand: true,
          dot: true
        }]
      },
      dist: {
        files: [{
          src: '<%= paths.destination %>/**',
          dest: '../',  // This copy path should match the clean path (one dir up)
          expand: true,
          dot: true
        }]
      }
    },
    bower: {
      rjsConfig: '<%= paths.source %>/scripts/main.js',
      indent: '  '
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:temp',
      'emberTemplates:server',
      'less:server',
      'livereload-start',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('cleanup', [
    'clean:temp'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'jshint',
    //'test',
    'emberTemplates:dist',
    'less:dist',
    'useminPrepare',
    //'imagemin',
    'htmlmin',
    'concat',
    'uglify',
    'usemin',
    'cssmin',
    'clean:public',
    'copy:images',
    'copy:fonts',
    'copy:definitions',
    'copy:project',
    'copy:dist',
    'clean:dist'
  ]);

  grunt.registerTask('build-lite', [
    'clean:dist',
    //'jshint',
    //'test',
    'emberTemplates:dist',
    'less:dist',
    'useminPrepare',
    //'imagemin',
    'htmlmin',
    'concat',
    //'uglify',
    'usemin',
    //'cssmin',
    'clean:public',
    'copy:images',
    'copy:fonts',
    'copy:fonts',
    'copy:definitions',
    'copy:dist',
    'clean:dist'
  ]);

  grunt.registerTask('build-debug', [
    'clean:dist',
    'jshint',
    //'test',
    'emberTemplates:dist',
    'less:debug',
    //'useminPrepare',
    //'imagemin',
    'htmlmin',
    'concat',
    //'uglify',
    //'usemin',
    //'cssmin',
    'clean:public',
    'copy',
    'clean:dist'
  ]);

  /**
   * API scraper task
   * To run: call "grunt scrape --server=127.0.0.1" from the command line
   */
  grunt.registerTask('scrape', 'Download JSON files from API', function () {
    var path = require('path');
    var fs = require('fs');
    var http = require('http');
    var request = require('request');
    var mkpath = require('mkpath');
    var done = this.async();

    var server = grunt.option('server') || 'localhost';
    var jsonFiles = [
      //'/api/v1/sessions/current_session.json',
      //'/api/v1/sessions.json',

      '/api/v1/status.json',
      '/api/v1/connectivity.json',
      '/api/v1/build.json',

      '/api/v1/quantumconfig',
      '/api/v1/openrcconfig',
      '/api/v1/novaconfig',
      '/api/v1/netconfig',
      '/api/v1/users.json',
      '/api/v1/logsettings',
      '/api/v1/override',
      '/api/v1/mailservers/default.json',

      '/api/v1/nodes.json',
      '/api/v1/vms.json',
      '/api/v1/configuration/flavors.json',
      '/api/v1/configuration/slas.json',
      '/api/v1/configuration/slos.json',
      //'/api/v1/graphs.json',

      '/api/v1/mtwilson/install',
      '/api/v1/trust_nodes.json',
      '/api/v1/trust_mles.json'
      //'/api/v1/node_trust_reports.json'

    ];

    jsonFiles.forEach(function (jsonFile) {
      var requestUrl = 'http://' + server + jsonFile;
      var absolutePath = __dirname + jsonFile.split('/').join(path.sep);
      request(requestUrl, function (error, response, body) {
        grunt.log.writeln(((response) ? response.statusCode : 'ERR') + ' GET ' + requestUrl);
        if (error) {
          grunt.log.writeln(error);
        } else if (response.statusCode === 200) {
          grunt.log.writeln(' Saving to ' + absolutePath);
          mkpath.sync(absolutePath.split(path.sep).slice(0, -1).join(path.sep));  // create folder
          var jsonObject = JSON.parse(body);
          var beautifiedJson = JSON.stringify(jsonObject, null, 2);
          fs.writeFile(absolutePath, beautifiedJson);
          // Download get_one child records
          var ids = [];
          var records = jsonObject[Object.keys(jsonObject)[0]];
          if (Array.isArray(records)) records.forEach(function (record) {
            if (record.id) ids.push(record.id);
          });
          ids.forEach(function (id) {
            var individualUrl = requestUrl.replace('.json', '') + '/' + id + '.json';
            var individualPath = __dirname + (jsonFile.replace('.json', '') + '/' + id + '.json').split('/').join(path.sep);
            request(individualUrl, function (error, response, body) {
              grunt.log.writeln(response.statusCode + ' GET ' + individualUrl);
              if (!error && response.statusCode === 200) {
                grunt.log.writeln(' Saving to ' + individualPath);
                mkpath.sync(individualPath.split(path.sep).slice(0, -1).join(path.sep));  // create folder
                fs.writeFile(individualPath, JSON.stringify(JSON.parse(body), null, 2));
              }
            });
          });
        }
      });
    });
  });

  /**
   * Project report generation
   * To run: call "grunt report" from the command line
   */
  grunt.registerTask('report', 'Generate report from tasks and repository', function () {
    var path = require('path');
    var fs = require('fs');
    var http = require('http');
    var request = require('request');
    var mkpath = require('mkpath');
    var done = this.async();

    var projectId = 513472;
    var requestUrl = 'https://teambox.com/api/2/activities?project_id=' + projectId;
    var teamboxUsername = 'intel-report';
    var teamboxPassword = 'WeAreRockStars1968';

    request.get({
      uri: requestUrl,
      auth: {
        'user': teamboxUsername,
        'pass': teamboxPassword
      }
    }, function (error, response, body) {
      grunt.log.writeln(((response) ? response.statusCode : 'ERR') + ' GET ' + requestUrl);
      if (error) {
        done(error);
      } else if (response.statusCode !== 200) {
        grunt.log.writeln(body);
        done(new Error('Encountered a ' + response.statusCode + ' response code.'));
      } else {
        var jsonObject = JSON.parse(body);
        var beautifiedJson = JSON.stringify(jsonObject, null, 2);
        grunt.log.writeln(beautifiedJson);
      }
    });
  });

  grunt.registerTask('default', ['build']);
};
