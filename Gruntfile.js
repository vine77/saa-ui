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
            var bodyParser = require('body-parser');
            return [
              connect().use(bodyParser.json()).use(function (req, res, next) {
                // Add CORS
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

                // Log requests to terminal
                grunt.log.writeln(req.method, req.url);

                if (req.url === '/api/v2/actions.json' && req.method === 'POST' && req.body.actions[0].name === 'scheduler_mark') {
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify(
                    {
                      "nodes": [
                        {
                          "status": {
                            "uptime": null,
                            "locked": false,
                            "agent_version": "1.1.7susePoc.20",
                            "ipmi_sensors_in_error": null,
                            "trust_status": {
                              "trust_details": {
                                "bios": 3,
                                "vmm": 3
                              },
                              "trust_config_details": {
                                "tagent_installed": 1,
                                "tagent_actual_version": null,
                                "tagent_running": 1,
                                "tpm_enabled": 1,
                                "tagent_paired": 1,
                                "tagent_expected_version": "1.2.4",
                                "tboot_measured_launch": 1
                              },
                              "trust_config": 1,
                              "trust": 3
                            },
                            "long_message": "SAA agent is installed. Node is powered on. SAA Agent reports success. Compute service is working. Compute service is enabled. ",
                            "health": 1,
                            "mode": 4,
                            "ipmi": true,
                            "operational": 2,
                            "short_message": "SAA agent is installed. Node is powered on. SAA Agent reports success. Compute service is working. Compute service is enabled. "
                          },
                          "trust_node_id": null,
                          "ids": {
                            "platform_id": "00000000-0000-0000-0000-002590A349A6",
                            "mac": "00:25:90:a3:49:a6",
                            "ip_address": "192.168.124.82",
                            "cloud_id": "00000000-0000-0000-0000-002590A349A6"
                          },
                          "scheduler_persistent": false,
                          "links": {
                            "logs": "/api/v2/logs?node=00000000-0000-0000-0000-002590A349A6",
                            "vms": "/api/v2/vms?ids=55031260-021c-440c-b849-df16f6dd12a7,446b3180-3fef-42cb-af30-502c913a4e17",
                            "uri": "/api/v2/nodes/00000000-0000-0000-0000-002590A349A6"
                          },
                          "utilization": {
                            "ipc": 0.66,
                            "network": null,
                            "cpu_frequency_current": null,
                            "cpu": {
                              "iowait": 6972.99,
                              "idle": 56845027.41,
                              "total": 0.0,
                              "steal": 0.0,
                              "guest": 288113.2
                            },
                            "io": null,
                            "memory": {
                              "used": "4338508 KB",
                              "ksm_sharing": "0 KB"
                            },
                            "scu": {
                              "cgroups": [
                                {
                                  "max": 4.0,
                                  "type": "vm",
                                  "value": 3.11,
                                  "min": 0.0
                                },
                                {
                                  "max": 5.21,
                                  "type": "os",
                                  "value": 2.16,
                                  "min": 0.0
                                }
                              ],
                              "system": {
                                "max": 83.36,
                                "allocated": 7.21,
                                "value": 5.27,
                                "min": 0.0
                              },
                              "sockets": [
                                {
                                  "socket_number": 1,
                                  "max": 41.68,
                                  "allocated": 5.21
                                },
                                {
                                  "socket_number": 0,
                                  "max": 41.68,
                                  "allocated": 2.0
                                }
                              ]
                            },
                            "cores": {
                              "cgroups": [
                                {
                                  "used": [
                                    {
                                      "core": "-1",
                                      "socket": "0"
                                    }
                                  ],
                                  "type": "vm"
                                },
                                {
                                  "used": [
                                    {
                                      "core": "-1",
                                      "socket": "1"
                                    }
                                  ],
                                  "type": "os"
                                }
                              ],
                              "system": {
                                "max": 16,
                                "used": null
                              }
                            },
                            "normalized_load": 0.12,
                            "cloud": {
                              "vcpus": {
                                "max": 512,
                                "used": 14
                              },
                              "disk": {
                                "max": 914,
                                "used": 140
                              },
                              "memory": {
                                "max": 24075,
                                "used": 7168
                              }
                            }
                          },
                          "graphite_url": "/render?target=stats.SAM",
                          "aggregate_ids": [],
                          "uri": "/nodes/00000000-0000-0000-0000-002590A349A6",
                          "capabilities": {
                            "hyperthreading": true,
                            "cores_per_socket": 8,
                            "cpu_frequency": "2600 MHz",
                            "turbo_mode": true,
                            "max_scu_per_core": 2.6,
                            "memory_size": "16400 MB",
                            "cpu_type": "",
                            "cache_size": "20480 kB",
                            "sockets": 2
                          },
                          "node_name": "d00-25-90-a3-49-a6.slescloud.tld",
                          "scheduler_mark": 1,
                          "node_trust_report_id": null,
                          "vm_info": {
                            "count": 2,
                            "max": null
                          },
                          "logs_url": "/logs?node=00000000-0000-0000-0000-002590A349A6",
                          "tier": null,
                          "cloud_services": [
                            {
                              "last_update": "2014-11-10T16:24:38+0000",
                              "health": 1,
                              "name": "compute",
                              "operational": 2
                            }
                          ],
                          "id": "00000000-0000-0000-0000-002590A349A6",
                          "vm_ids": [
                            "55031260-021c-440c-b849-df16f6dd12a7",
                            "446b3180-3fef-42cb-af30-502c913a4e17"
                          ],
                          "contention": {
                            "llc": {
                              "cgroups": [
                                {
                                  "max": 50.0,
                                  "label": "LOW",
                                  "type": "os",
                                  "value": 1.14,
                                  "min": 0.0
                                },
                                {
                                  "max": 50.0,
                                  "label": "LOW",
                                  "type": "vm",
                                  "value": 0.03,
                                  "min": 0.0
                                }
                              ],
                              "sockets": [
                                {
                                  "socket_number": 1,
                                  "max": 50.0,
                                  "label": "LOW",
                                  "value": 2.7,
                                  "min": 0.0
                                },
                                {
                                  "socket_number": 0,
                                  "max": 50.0,
                                  "label": "LOW",
                                  "value": 0.04,
                                  "min": 0.0
                                }
                              ],
                              "system": {
                                "max": 50.0,
                                "label": "LOW",
                                "value": 0.07,
                                "min": 0.0
                              }
                            }
                          }
                        },
                        {
                          "status": {
                            "uptime": null,
                            "locked": false,
                            "agent_version": "1.1.7susePoc.20",
                            "ipmi_sensors_in_error": null,
                            "trust_status": {
                              "trust_details": {
                                "bios": 3,
                                "vmm": 3
                              },
                              "trust_config_details": {
                                "tagent_installed": 1,
                                "tagent_actual_version": null,
                                "tagent_running": 1,
                                "tpm_enabled": 1,
                                "tagent_paired": 1,
                                "tagent_expected_version": "1.2.4",
                                "tboot_measured_launch": 1
                              },
                              "trust_config": 1,
                              "trust": 3
                            },
                            "long_message": "SAA agent is installed. Node is powered on. SAA Agent reports success. Compute service is working. Compute service is enabled. ",
                            "health": 1,
                            "mode": 4,
                            "ipmi": true,
                            "operational": 2,
                            "short_message": "SAA agent is installed. Node is powered on. SAA Agent reports success. Compute service is working. Compute service is enabled. "
                          },
                          "trust_node_id": null,
                          "ids": {
                            "platform_id": "36353430-3831-4D58-5134-313530304E4D",
                            "mac": "a0:d3:c1:01:a7:08",
                            "ip_address": "192.168.124.86",
                            "cloud_id": "36353430-3831-4D58-5134-313530304E4D"
                          },
                          "scheduler_persistent": false,
                          "links": {
                            "uri": "/api/v2/nodes/36353430-3831-4D58-5134-313530304E4D",
                            "logs": "/api/v2/logs?node=36353430-3831-4D58-5134-313530304E4D"
                          },
                          "utilization": {
                            "ipc": 0.27,
                            "network": null,
                            "cpu_frequency_current": null,
                            "cpu": {
                              "iowait": 91.09,
                              "idle": 42485369.22,
                              "total": 0.0,
                              "steal": 0.0,
                              "guest": 137151.94
                            },
                            "io": null,
                            "memory": {
                              "used": "3135036 KB",
                              "ksm_sharing": "0 KB"
                            },
                            "scu": {
                              "cgroups": [
                                {
                                  "max": 4.68,
                                  "type": "os",
                                  "value": 0.17,
                                  "min": 0.0
                                }
                              ],
                              "system": {
                                "max": 56.16,
                                "allocated": 4.68,
                                "value": 0.17,
                                "min": 0.0
                              },
                              "sockets": [
                                {
                                  "socket_number": 1,
                                  "max": 28.08,
                                  "allocated": 4.68
                                },
                                {
                                  "socket_number": 0,
                                  "max": 28.08,
                                  "allocated": 0.0
                                }
                              ]
                            },
                            "cores": {
                              "cgroups": [
                                {
                                  "used": [
                                    {
                                      "core": "-1",
                                      "socket": "1"
                                    }
                                  ],
                                  "type": "os"
                                }
                              ],
                              "system": {
                                "max": 12,
                                "used": null
                              }
                            },
                            "normalized_load": 0.03,
                            "cloud": {
                              "vcpus": {
                                "max": 384,
                                "used": 6
                              },
                              "disk": {
                                "max": 273,
                                "used": 60
                              },
                              "memory": {
                                "max": 48301,
                                "used": 3072
                              }
                            }
                          },
                          "graphite_url": "/render?target=stats.SAM",
                          "aggregate_ids": [],
                          "uri": "/nodes/36353430-3831-4D58-5134-313530304E4D",
                          "capabilities": {
                            "hyperthreading": true,
                            "cores_per_socket": 6,
                            "cpu_frequency": "2500 MHz",
                            "turbo_mode": true,
                            "max_scu_per_core": 2.34,
                            "memory_size": "32768 MB",
                            "cpu_type": "",
                            "cache_size": "15360 kB",
                            "sockets": 2
                          },
                          "node_name": "da0-d3-c1-01-a7-08.slescloud.tld",
                          "scheduler_mark": null,
                          "node_trust_report_id": null,
                          "vm_info": {
                            "count": 0,
                            "max": null
                          },
                          "logs_url": "/logs?node=36353430-3831-4D58-5134-313530304E4D",
                          "tier": null,
                          "cloud_services": [
                            {
                              "last_update": "2014-11-10T16:24:38+0000",
                              "health": 1,
                              "name": "compute",
                              "operational": 2
                            }
                          ],
                          "id": "36353430-3831-4D58-5134-313530304E4D",
                          "vm_ids": [],
                          "contention": {
                            "llc": {
                              "cgroups": [
                                {
                                  "max": 50.0,
                                  "label": "MEDIUM",
                                  "type": "os",
                                  "value": 4.31,
                                  "min": 0.0
                                },
                                {
                                  "max": 50.0,
                                  "label": "LOW",
                                  "type": "vm",
                                  "value": 0.0,
                                  "min": 0.0
                                }
                              ],
                              "sockets": [
                                {
                                  "socket_number": 1,
                                  "max": 50.0,
                                  "label": "MEDIUM",
                                  "value": 4.29,
                                  "min": 0.0
                                },
                                {
                                  "socket_number": 0,
                                  "max": 50.0,
                                  "label": "LOW",
                                  "value": 0.0,
                                  "min": 0.0
                                }
                              ],
                              "system": {
                                "max": 50.0,
                                "label": "MEDIUM",
                                "value": 4.31,
                                "min": 0.0
                              }
                            }
                          }
                        }
                      ],
                      "actions": [
                        {
                          "status": 1,
                          "name": "scheduler_mark",
                          "links": {
                            "nodes": "/api/v2/nodes/00000000-0000-0000-0000-002590A349A6"
                          },
                          "started": "2014-12-03T23:41:00+00:00",
                          "options": {
                            "scheduler_mark": 0,
                            "scheduler_persistent": true
                          },
                          "sla_id": null,
                          "node_id": "00000000-0000-0000-0000-002590A349A6",
                          "done": true,
                          "flavor_id": null,
                          "blocking": false,
                          "message": "Socket 0 of \"compute2.maas\" node has been preselected for VMs placement.",
                          "last_update": "2014-12-03T23:41:00+00:00",
                          "vm_id": null,
                          "id": 26,
                          "user": null
                        }
                      ]
                    }
                  ));
                }

                if (req.url === '/api/v2/start' && req.method === 'PUT') {
                  res.writeHead(422, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({'code': 422, 'errors': ['This is a test of the error reporting system.', 'This is only a test.']}));
                  return;
                }

                if (req.method === 'PUT') req.method = 'GET';

                // Serve API requests
                if (req.url.indexOf('/api/') === 0) {
                  // Remove trailing slashes
                  if (req.url.slice(-1) === '/') req.url = req.url.slice(0, -1);
                  // Add extension (including method for for non-GET requests, e.g. .post.json)
                  var extension = (req.method === 'GET') ? '.json' : '.' + req.method.toLowerCase() + '.json';
                  req.method = 'GET';
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
              }),
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
      //'open',
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
    var apiEndpoints = [{
      url: '/api/v2/statuses.json'
    }, {
      url: '/api/v2/builds.json'
    }, {
      url: '/api/v2/quantumconfig'
    }, {
      url: '/api/v2/openrcconfig'
    }, {
      url: '/api/v2/novaconfig'
    }, {
      url: '/api/v2/netconfig'
    }, {
      url: '/api/v2/logsettings'
    }, {
      url: '/api/v2/nodes.json',
      links: ['node_trust_report']
    }, {
      url: '/api/v2/vms.json',
      links: ['vm_trust_report', 'vm_instantiation_simple', 'vm_instantiation_detailed']
    }, {
      url: '/api/v2/configuration/flavors.json'
    }, {
      url: '/api/v2/configuration/slas.json'
    }, {
      url: '/api/v2/configuration/slos.json'
    }, {
      url: '/api/v2/configuration/slo_templates.json'
    }, {
      url: '/api/v2/mtwilson/install'
    }, {
      url: '/api/v2/trust_nodes.json'
    }, {
      url: '/api/v2/trust_mles.json'
    }
    //'/api/v2/graphs.json'
    //'/api/v2/override'
    //'/api/v2/sessions/current_session.json'
    //'/api/v2/sessions.json'
    //'/api/v2/users.json'
    //'/api/v2/mailservers/default.json'
    ];
    var uncountable = ['vm_instantiation_simple', 'vm_instantiation_detailed'];

    apiEndpoints.forEach(function (apiEndpoint) {
      grunt.log.writeln('ENDPOINT URL:', apiEndpoint.url);
      var jsonFile = apiEndpoint.url;
      var requestUrl = 'http://' + server + jsonFile;
      var absolutePath = __dirname + jsonFile.split('/').join(path.sep) + ((jsonFile.indexOf('.json') === -1) ? '.json' : '');
      var requestOptions = {
        uri: requestUrl,
        json: true,
        headers: {
          'Accept-Language': 'en-US,en;q=0.8'
        }
      };
      request(requestOptions, function (error, response, body) {
        grunt.log.writeln(((response) ? response.statusCode : 'ERR') + ' GET ' + requestUrl);
        if (error || response.statusCode !== 200) {
          grunt.log.writeln('===== FAILURE RESPONSE =====>', JSON.stringify(body));
        } else {
          grunt.log.writeln(' Saving to ' + absolutePath);
          mkpath.sync(absolutePath.split(path.sep).slice(0, -1).join(path.sep));  // create folder
          var jsonObject = body;
          var beautifiedJson = JSON.stringify(jsonObject, null, 2);
          fs.writeFile(absolutePath, beautifiedJson);
          // Download get_one child records
          var individualRecords = [];
          var records = jsonObject[Object.keys(jsonObject)[0]];
          if (Array.isArray(records)) records.forEach(function (record) {
            if (record.id) individualRecords.push({
              url: requestUrl.replace('.json', '') + '/' + record.id + '.json',
              path: __dirname + (jsonFile.replace('.json', '') + '/' + record.id + '.json').split('/').join(path.sep)
            });
            if (apiEndpoint.links) apiEndpoint.links.forEach(function (link) {
              if (record[link + '_id']) {
                var linkId = record[link + '_id'];
                var pluralized = link + ((uncountable.indexOf(link) === -1) ? 's' : '');
                individualRecords.push({
                  url: 'http://' + server + '/api/v2/' + pluralized + '/' + linkId + '.json',
                  path: __dirname + ('/api/v2/' + pluralized + '/' + linkId + '.json').split('/').join(path.sep)
                });
              }
            });
          });
          individualRecords.forEach(function (individualRecord) {
            grunt.log.writeln('INDIVIDUAL URL: ', individualRecord.url);
            var requestOptions = {
              uri: individualRecord.url,
              json: true,
              headers: {
                'Accept-Language': 'en-US,en;q=0.8'
              }
            };
            request(requestOptions, function (error, response, body) {
              grunt.log.writeln(((response) ? response.statusCode : 'ERR') + ' GET ' + individualRecord.url);
              if (error || response.statusCode !== 200) {
                grunt.log.writeln('===== FAILURE RESPONSE =====>', JSON.stringify(body));
              } else {
                grunt.log.writeln(' Saving to ' + individualRecord.path);
                mkpath.sync(individualRecord.path.split(path.sep).slice(0, -1).join(path.sep));  // create folder
                fs.writeFile(individualRecord.path, JSON.stringify(body, null, 2));
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
