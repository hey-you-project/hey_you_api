'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mongo-drop');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['Gruntfile.js', 'models/**/*.js', 'server.js', 'routes/**/*.js', 'test/**/*.js', 'lib/**/cl_crawl.js', 'lib/passport.js']
    },

    jscs: {
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js', 'lib/**/*.js', 'test/**/*js'],
      options: {
        config: '.jscsrc'
      }
    },

    simplemocha: {
      src: ['test/api/users_test.js', 
            'test/api/dots_test.js',
            'test/api/tos_test.js',
            'test/api/message_test.js']
    },

    mongo_drop: {
      test: {
        'uri': 'mongodb://localhost/hey_you_test',
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'mongo_drop', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};
