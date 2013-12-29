module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        options: { mangle: true },
        files: { 
            src: 'src/lib/*.js',  // source files mask
            dest: 'build/lib/',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.js'   // replace .js to .min.js
        }
    },
    copy: {
    	main: {
    		files: [
    		  { expand: true, flatten: true, src: ['src/manifest.json'], dest: 'build/.' },
    		  { expand: true, flatten: true, src: ['src/options.html'], dest: 'build/.' },
    		  { expand: true, flatten: true, src: ['src/options.js'], dest: 'build/.' },
          	  { expand: true, flatten: true,  src: ['src/img/*'], dest: 'build/img/.' }
    		]
    	}
    },
    compress: {
      main: {
        options: {
          archive: 'wpAdminBarHide.zip'
        },
        files: [
          { cwd: 'build/', flatten: false, expand: true, src: ['**'], dest: '' }
        ]
      }
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-compress');

// register at least this one task
grunt.registerTask('default', [ 'uglify', 'copy', 'compress' ]);


};