module.exports = function (grunt) {

    // load the task 
    grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-mocha-test");

    // Configure grunt here
    grunt.registerTask("default", ["connect", "ts:dev"]);
     grunt.registerTask("test", ["ts:test", "mochaTest:test" ]);

    grunt.initConfig({

		ts: {            
		    dev: {                                 // a particular target   
		        src: ["src/app/**/*.ts", "!src/app/test/**"],        // The source typescript files, http://gruntjs.com/configuring-tasks#files
		        html: ["src/app/**/*.html", "!src/app/test/**"], // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
		        reference: "./src/app/reference.ts",  // If specified, generate this file that you can use for your reference management
		        out: "src/app/out.js",                // If specified, generate an out.js file which is the merged js file                     		        
		        watch: "src/app",                     // If specified, watches this directory for changes, and re-runs the current target  
		        options: {                    // use to override the default options, http://gruntjs.com/configuring-tasks#options
		            target: "es5",            // 'es3' (default) | 'es5'
		            module: "amd",       // 'amd' (default) | 'commonjs'
		            sourcemap: true,          // true  (default) | false
		            declaration: false,       // true | false  (default)                
		            comments: false           // true | false (default)
		        },
		    },
		    test: {
		    	 src: ["src/app/test/**/*.ts"],
		    	 out: "artefacts/test.js",
		    	 reference: "./src/app/test/reference.ts",  
		    	 options: {
		    	 	module: "amd"
		    	 }
		    }
		},

		mochaTest: {
			test: {
				src: ["artefacts/**/*.js"],				
				options: {
					ui: "tdd",
					reporter: "spec"
				}				
			}
		},

		connect: {
			server: {
				options: {
					port: 8080,
					base: './src'
				}
			}
		}


    });
}