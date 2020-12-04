const NAMEPLUGIN = "UFCTowerDefense";
const NAMEFOLDER = "towerdefense/";
const PATHDEST = "../";
const DEFAULTTASK = [
  "concat:source",
  "concat:plugins",
  "concat:globalVar",
  "concat:help",
];

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      files: [
        NAMEFOLDER + "js/*.js",
        NAMEFOLDER + "help/*.js",
        NAMEFOLDER + "global/*.js",
        NAMEFOLDER + "addon/*.js",
        NAMEFOLDER + "plugins/*.js",
      ],
      tasks: DEFAULTTASK,
    },
    // set up first custom task: concat
    // the options depend on the task you want to use
    concat: {
      help: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: [NAMEFOLDER + "help/help.js", PATHDEST + NAMEPLUGIN + ".js"],
      },
      globalVar: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: [NAMEFOLDER + "global/*.js", PATHDEST + NAMEPLUGIN + ".js"],
      },
      plugins: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: [NAMEFOLDER + "plugins/*.js", PATHDEST + NAMEPLUGIN + ".js"],
      },
      options: {
        // string to put between concatenated files
        // can be necessary when processing minified js code
        //separator: ';'
      },
      source: {
        dest: PATHDEST + NAMEPLUGIN + ".js",
        src: [NAMEFOLDER + "js/*.js"],
        options: {
          // banner: "(() => { \n 'use strict';\n",
          // footer: "})();",
        },
      },
    },
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        dest: PATHDEST + NAMEPLUGIN + ".min.js",
        src: PATHDEST + NAMEPLUGIN + ".js",
      },

      buildwAddon: {
        dest: PATHDEST + NAMEPLUGIN + ".min.js",
        src: [NAMEFOLDER + "addon/*.js", PATHDEST + NAMEPLUGIN + ".js"],
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
