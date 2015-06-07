module.exports = function (grunt) {

  // Import dependencies
  grunt.loadNpmTasks('grunt-ts');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      lib: { // <-- compile all the files in ../ to PROJECT.js
        src: ['src/*.ts', 'src/browser/*.ts'],
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMap: false,
          declaration: false,
          removeComments: false
        }
      }
    }
  });

  // Register the default tasks to run when you run grunt
  grunt.registerTask('default', ['ts']);
}
