module.exports = function (grunt) {

  // Import dependencies
  grunt.loadNpmTasks('grunt-typescript');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      lib: { // <-- compile all the files in ../ to PROJECT.js
        src: ['src/*.ts', 'src/browser/*.ts'],
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMaps: false,
          declaration: false,
          removeComments: false
        }
      }
    }
  });

  // Register the default tasks to run when you run grunt
  grunt.registerTask('default', ['typescript']);
}
