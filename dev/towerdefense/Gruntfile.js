const NAMEPLUGIN = "UFCTowerDefense";
const PATHDEST = "../../";
const DEFAULTTASK = ["concat:source", "concat:globalVar", "concat:help"];

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      // If any .less file changes in directory "less" then run the "less" task.
      files: ["js/*.js", "help/*.js", "global/*.js", "addon/*.js"],
      tasks: DEFAULTTASK,
    },
    // set up first custom task: concat
    // the options depend on the task you want to use
    concat: {
      help: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: ["help/help.js", PATHDEST + NAMEPLUGIN + ".js"],
      },
      globalVar: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: ["global/*.js", PATHDEST + NAMEPLUGIN + ".js"],
      },
      options: {
        // string to put between concatenated files
        // can be necessary when processing minified js code
        //separator: ';'
      },
      source: {
        // files to concat together
        src: ["js/*.js"],
        // location of result file
        dest: PATHDEST + NAMEPLUGIN + ".js",
        options: {
          banner: "(() => { \n 'use strict';\n",
          footer: "})();",
        },
      },
      uglify: {
        // files to concat together
        src: ["js/*.js"],
        // location of result file
        dest: "../../" + NAMEPLUGIN + ".js",
      },
    },
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        src: PATHDEST + NAMEPLUGIN + ".js",
        dest: PATHDEST + NAMEPLUGIN + ".min.js",
      },

      buildwAddon: {
        src: ["addon/*.js", PATHDEST + NAMEPLUGIN + ".js"],
        dest: PATHDEST + NAMEPLUGIN + ".min.js",
      },
    },
  });

  // load contrib task files
  // note: these should be installed from npm
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");

  // a custom task
  // no configuration for this task, it just logs stuff
  grunt.registerTask("default", "Log stuff.", function () {
    grunt.log.write("I am a custom task...").ok();
  });
  // register what to do when using the default 'grunt' command
  grunt.registerTask("default", DEFAULTTASK);
  grunt.registerTask("build", [
    "concat:source",
    "uglify:build",
    "uglify:buildwAddon",
    "concat:globalVar",
  ]);
};
