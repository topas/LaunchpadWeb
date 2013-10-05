module.exports = function (grunt) {

    // load the task 
    grunt.loadNpmTasks("grunt-ts");

    // Configure grunt here
    grunt.registerTask("default", ["ts:dev"]);

    grunt.initConfig({

		ts: {            
		    dev: {                                 // a particular target   
		        src: ["src/app/**/*.ts"],        // The source typescript files, http://gruntjs.com/configuring-tasks#files
		        html: ["src/app/**/*.html"], // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
		        reference: "./src/app/reference.ts",  // If specified, generate this file that you can use for your reference management
		        out: 'src/app/out.js',                // If specified, generate an out.js file which is the merged js file                     		        
		        watch: 'src/app',                     // If specified, watches this directory for changes, and re-runs the current target  
		        options: {                    // use to override the default options, http://gruntjs.com/configuring-tasks#options
		            target: 'es3',            // 'es3' (default) | 'es5'
		            module: 'commonjs',       // 'amd' (default) | 'commonjs'
		            sourcemap: true,          // true  (default) | false
		            declaration: false,       // true | false  (default)                
		            comments: false           // true | false (default)
		        },
		    }
		}

    });
}