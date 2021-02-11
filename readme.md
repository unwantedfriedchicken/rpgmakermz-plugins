# Collection exercise for rpg maker mz

This is using grunt to concat the files, also configured for watch and livereload.

When using command **td** static web server is served. You can open in browser `http://localhost:9001/`  
You can use **run** to serve webserver see the **COMMAND list**

to enable livereload add `<script src="//localhost:35729/livereload.js"></script>` to your `index.html` in your project folder

## Instruction to develop

### Configuration

- Open source folder and rename _`sample.gruntconfig.json`_ to _`config.gruntconfig.json`_
- Open it and set dest to set default destination when export the task
- example : `"D:/rpgmakermz/project game"`

### Running task

- open source folder with terminal/cmd
- type **npm install**
- type **npx grunt COMMAND**

## COMMAND list

Task Command `td:DESTINATION(optional)`  
**td** : To watching and export task for Tower Defense plugins, this will export -> UFCTowerDefense,UFCTextHelper,UFCGuideAction. To set destination export use **:** example: `npx grunt td:../dist/`

Task Command `run:TASK:SERVE WEBSERVER(optional):DESTINATION(optional)`  
**run** : To custom watching and export some folder, to multiple folder task use **,** seprator. to serve web server add `true` after the task. example: `npx grunt run:UFCTexthelper,UFCGuideAction:true:../dist/`

Task Command `build:DESTINATION(optional)`  
**build** : to build everything and minify using terser, and the name will have `.min.js`. example: `npx grunt build:../dist/`

License MIT
