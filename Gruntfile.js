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
                console.log(req.method, req.url);
                if (req.method === 'POST') {
                //if (req.originalUrl == '/api/v1/nodes.json' && req.method === 'GET') {
                  res.writeHead(404, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({'errors': {'name': 'Invalid parameter'}}));
                } else {
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Access-Control-Allow-Methods', '*');
                  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
                  next();
                }
              },
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pathsConfig.source),
              connect.static(options.base),     // Serve static files
              connect.directory(options.base)   // Make empty directories browsable,

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
        src: ['../<%= paths.destination %>']  // This clean path should match the last copy path (one dir up)
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
    'jshint',
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
    'copy:project',
    'copy:dist',
    'clean:dist'
  ]);

    grunt.registerTask('build-lite', [
    'clean:dist',
    'jshint',
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
    'copy:project',
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


  grunt.registerTask('default', ['build']);
};
