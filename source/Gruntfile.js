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
  });

  // load contrib task files
  // note: these should be installed from npm
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-terser");
  grunt.loadNpmTasks("grunt-remove-comments");
  grunt.loadNpmTasks("grunt-contrib-connect");

  // grunt.config.set("PATHDEST", "../dist/");

  let initTask = function (id, dest, watchRMProject = false) {
    let listTask = {
      connect: {},
      concat: {},
      remove_comments: {},
      terser: {
        options: {
          ecma: 2015,
        },
      },
    };
    let tasks = [];
    let tasksBuild = [];
    let files = [];
    const pluginPath = dest + "/js/plugins/";
    for (let taskid of id) {
      listTask["concat"][taskid] = {
        dest: pluginPath + taskid + ".js",
        src: [
          taskid + "/global/*.js",
          taskid + "/plugins/*.js",
          taskid + "/js/*.js",
          taskid + "/ext/*.js",
        ],
      };
      listTask["concat"][taskid + "help"] = {
        dest: pluginPath + taskid + ".js",
        src: [taskid + "/help/*.js", pluginPath + taskid + ".js"],
      };
      listTask["remove_comments"][taskid] = {
        dest: pluginPath + taskid + ".js",
        src: pluginPath + taskid + ".js",
      };
      listTask["terser"][taskid] = {
        dest: pluginPath + taskid + ".min.js",
        src: [pluginPath + taskid + ".js"],
      };

      let _task = [
        "concat:" + taskid,
        "remove_comments:" + taskid,
        "concat:" + taskid + "help",
      ];
      tasks.push(..._task);

      tasksBuild.push(..._task, "terser:" + taskid);

      files.push(taskid + "/**/*.js");
    }
    if (watchRMProject) files.push(dest + "/**/*");
    listTask["watch"] = {
      default: {
        files: files,
        options: { spawn: false, livereload: true },
        tasks: tasks,
      },
    };
    listTask["connect"]["server"] = {
      options: {
        port: 9001,
        base: dest,
        livereload: true,
      },
    };
    return {
      init: listTask,
      build: tasksBuild,
      files: files,
    };
  };

  const CONFIG = grunt.file.readJSON("config.gruntconfig.json");

  grunt.registerTask("td", "Tower Defense Task", function (dist) {
    // if (dest) {
    //   grunt.config.set("PATHDEST", dest);
    // }
    // grunt.config.set("NAMEPLUGIN", "UFCTowerDefense");
    // grunt.config.set("NAMEFOLDER", "towerdefense/");
    // if (isWatch) grunt.task.run("watch");
    // else grunt.task.run(DEFAULTTASK);
    let init = initTask(
      ["UFCTowerDefense", "UFCGuideAction", "UFCTextHelper"],
      dist || CONFIG.dest,
      true
    );
    grunt.config.init(init.init);
    grunt.task.run(["connect", "watch"]);
  });

  grunt.registerTask("run", "Run Task", function (taskName, connect, dist) {
    let init = initTask([...taskName.split(",")], dist || CONFIG.dest, connect);
    grunt.config.init(init.init);
    let task = ["watch"];
    if (connect) task.unshift("connect");
    grunt.task.run(task);
  });

  grunt.registerTask("default", DEFAULTTASK);
  grunt.registerTask("build", "Build Task", function (dist) {
    let init = initTask(
      ["UFCTowerDefense", "UFCGuideAction", "UFCTextHelper"],
      dist || CONFIG.dest
    );
    grunt.config.init(init.init);
    grunt.task.run(init.build);
  });
};
