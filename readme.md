# Collection exercise for rpg maker mz

This is using grunt to concat the files

## Instruction to develop

### Configuration

- Open source folder and rename _sample.gruntconfig.json_ to _config.gruntconfig.json_
- Open it and set dest to set default destination when export the task
- example : "D:/rpgmakermz/project/js/plugins/"

### Running task

- open source folder with terminal/cmd
- type **npm install**
- type **npx grunt COMMAND**

## COMMAND list

Task Command `td:DESTINATION(optional)`  
**td** : To watching and export task for Tower Defense plugins, this will export -> UFCTowerDefense,UFCTextHelper,UFCGuideAction. To set destination export use **:** example: `npx grunt td:../dist/`

Task Command `run:TASK:DESTINATION(optional)`  
**run** : To custom watching and export some folder, to multiple folder task use **,** seprator. example: `npx grunt run:UFCTexthelper,UFCGuideAction:../dist/`

Task Command `build:DESTINATION(optional)`  
**build** : to build everything and minify using terser, and the name will have `.min.js`. example: `npx grunt build:../dist/`

License MIT
