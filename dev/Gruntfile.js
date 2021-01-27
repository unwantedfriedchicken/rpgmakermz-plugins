const DEFAULTTASK = [
  "concat:source",
  "concat:ext",
  "concat:plugins",
  "concat:globalVar",
  "remove_comments:target",
  "concat:help",
];

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    remove_comments: {
      options: {
        // Task-specific options go here.
      },
      target: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: ["<%= PATHDEST %><%= NAMEPLUGIN %>.js"],
      },
    },
    watch: {
      files: [
        "<%= NAMEFOLDER %>js/*.js",
        "<%= NAMEFOLDER %>help/*.js",
        "<%= NAMEFOLDER %>global/*.js",
        "<%= NAMEFOLDER %>addon/*.js",
        "<%= NAMEFOLDER %>plugins/*.js",
      ],
      options: { spawn: false },
      tasks: DEFAULTTASK,
    },
    // set up first custom task: concat
    // the options depend on the task you want to use
    concat: {
      help: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: [
          "<%= NAMEFOLDER %>help/help.js",
          "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        ],
      },
      globalVar: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: [
          "<%= NAMEFOLDER %>global/*.js",
          "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        ],
      },
      plugins: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: [
          "<%= NAMEFOLDER %>plugins/*.js",
          "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        ],
      },
      ext: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: [
          "<%= NAMEFOLDER %>ext/*.js",
          "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        ],
      },
      options: {
        // string to put between concatenated files
        // can be necessary when processing minified js code
        //separator: ';'
      },
      source: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        src: ["<%= NAMEFOLDER %>js/*.js"],
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
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.min.js",
        src: "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
      },

      buildwAddon: {
        dest: "<%= PATHDEST %><%= NAMEPLUGIN %>.min.js",
        src: [
          "<%= NAMEFOLDER %>addon/*.js",
          "<%= PATHDEST %><%= NAMEPLUGIN %>.js",
        ],
      },
    },
  });

  // load contrib task files
  // note: these should be installed from npm
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks("grunt-remove-comments");

  // grunt.config.set("PATHDEST", "../dist/");

  let initTask = function (id, dest) {
    let listTask = {
      concat: {},
      remove_comments: {},
    };
    let tasks = [];
    let files = [];
    for (let taskid of id) {
      listTask["concat"][taskid] = {
        dest: dest + taskid + ".js",
        src: [
          taskid + "/global/*.js",
          taskid + "/plugins/*.js",
          taskid + "/js/*.js",
          taskid + "/ext/*.js",
        ],
      };
      listTask["concat"][taskid + "help"] = {
        dest: dest + taskid + ".js",
        src: [taskid + "/help/*.js", dest + taskid + ".js"],
      };
      listTask["remove_comments"][taskid] = {
        dest: dest + taskid + ".js",
        src: [dest + taskid + ".js"],
      };

      tasks.push(
        "concat:" + taskid,
        "remove_comments:" + taskid,
        "concat:" + taskid + "help"
      );
      files.push(taskid + "/**/*.js");
    }
    listTask["watch"] = {
      files: files,
      options: { spawn: false },
      tasks: tasks,
    };
    return {
      init: listTask,
      files: files,
    };
  };

  const CONFIG = grunt.file.readJSON("config.gruntconfig.json");

  grunt.registerTask("td", "Tower Defense Task", function () {
    // if (dest) {
    //   grunt.config.set("PATHDEST", dest);
    // }
    // grunt.config.set("NAMEPLUGIN", "UFCTowerDefense");
    // grunt.config.set("NAMEFOLDER", "towerdefense/");
    // if (isWatch) grunt.task.run("watch");
    // else grunt.task.run(DEFAULTTASK);
    let init = initTask(["UFCTowerDefense", "UFCGuideAction"], CONFIG.dest);
    grunt.config.init(init.init);
    grunt.task.run("watch");
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
