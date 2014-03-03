module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'src',
      tests: 'test',
      dist: 'build',
      fonts: 'bower_components/font-awesome',
      samples: 'example'
    },

    jshint: {
      src: [
        ['<%=config.sources %>']
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        jshintrc: true
      }
    },

    karma: {
      single: {

        browsers: [ 'Chrome' ],
        autoWatch: false,
        singleRun: true,

        configFile: '<%= config.tests %>/config/karma.unit.js',

        browserify: {
          watch: false,
          debug: false,
          transform: [ 'debowerify' ]
        }
      },
      unit: {
        configFile: '<%= config.tests %>/config/karma.unit.js',
      
        singleRun: false,
        autoWatch: true,
        browsers: [ 'Chrome' ]
      }
    },
    browserify: {
      vendor: {
        src: [ 'bower_components/snapsvg/index.js', 'node_modules/lodash/lodash.js' ],
        dest: '<%= config.dist %>/common.js',
        options: {
          debug: true,
          alias: [
            'bower_components/snapsvg/index.js:snapsvg',
            'node_modules/lodash/lodash.js:lodash'
          ]
        }
      },
      src: {
        files: {
          '<%= config.dist %>/diagram.js': [ '<%= config.sources %>/**/*.js' ]
        },
        options: {
          debug: true,
          external: [ 'snapsvg', 'lodash' ],
          alias: [
            '<%= config.sources %>/Diagram.js:diagram'
          ]
        }
      }
    },
    copy: {
      samples: {
        files: [
          // copy sample files
          {
            expand: true,
            cwd: '<%= config.samples %>/',
            src: ['*.{js,css,html,png}'],
            dest: '<%= config.dist %>/<%= config.samples %>'
          }
        ]
      },
      fonts:  {
        files: [
          {
            expand: true,
            cwd: '<%= config.fonts %>/',
            src: ['fonts/*.woff'],
            dest: '<%= config.dist %>'
          }
        ]
      }
    },
    watch: {
      sources: {
        files: [ '<%= config.sources %>/**/*.js' ],
        tasks: [ 'concurrent:sources']
      },
      samples: {
        files: [ '<%= config.samples %>/*.{html,css,js}' ],
        tasks: [ 'copy:samples']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/*.js',
          '<%= config.dist %>/<%= config.samples %>/*.{html,css,js}'
        ]
      }
    },
    connect: {
      options: {
        port: 9003,
        livereload: 35726,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },
    jsdoc: {
      dist: {
        src: [ '<%= config.sources %>/**/*.js' ],
        options: {
          destination: 'doc',
          plugins: [ 'plugins/markdown' ]
        }
      }
    },
    concurrent: {
      'sources': [ 'browserify:src', 'jshint' ],
      'build': [ 'jshint', 'build', 'jsdoc' ]
    }
  });

  // tasks
  
  grunt.registerTask('test', [ 'karma:single' ]);
  grunt.registerTask('build', [ 'browserify', 'copy' ]);

  grunt.registerTask('auto-test', [ 'karma:unit' ]);

  grunt.registerTask('auto-build', [
    'concurrent:build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [ 'test', 'build', 'jsdoc' ]);
};