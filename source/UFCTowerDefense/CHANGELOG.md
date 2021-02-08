# Change Log

## Version 1.3 - dev

- ADD: Add new parameter `Tower Action Settings` for tower action setting position
- ADD: Add ability to using save/load function, now you can save during gameplay
- ADD: Add upgrade with material, with `<upgradematerial>` to require multiple material use `,` seprator and to set ammount use `|` after the item ID

```markdown
<upgrade:32|200> -> upgrade ID | Price
<upgradematerial:2,3|3>
-> upgrade material need:
-> ITEM ID 2 ammount 1
-> ITEM ID 3 ammount 3
<upgrade2:33> -> upgrade 2 ID | Price
<upgrade2material:3>
-> upgrade 2 material need:
-> ITEM ID 3 ammount 1
```

- ADD: Add new note for item, if want to get displayed in backpack add `<ufcTDMaterial>`
- ADD: Add Quick Shop option for Shop Button, new plugin parameters `Shop Type` and `Quick Shop Setting`
- ADD: Add damage text, if plugin `UFCTextHelper` is imported
- ADD: Add enemy health GUI and add new configuration in plugin parameters
- ADD: Add sound settings in plugin parameters
- ADD: Add `Animate Tower` in plugin parameters, if set to `true` this will animate tower when idle
- ADD: Add `Attack Speed` to `Setup enemy data`, this will define attack speed for the enemy when attacking (1/60 sec)
- ADD: Add `Grid Trap Color` and `Grid Trap Color Opacity` to plugin parameters, for trap grid color
- ADD: Add `Tower Trap` trap can be used for blocking or damage enemy. this will add `type` to tower note for make tower trap set `<type:trap>`. Current trap only attack if `through` is `false`, if is `true` then the trap is only used for blocking enemy
- ADD & CHANGE: Add and change some in tower note

```markdown
<bulletspritename:?> -> become optional. Default: ?
<bulletspriteindex:0> -> become optional. Default: 0
<bulletspriteindexy:0> -> become optional. Default: 0
<bulletspeed:600> -> bulletspeed become optional. Default: 600
<type:tower>(optional) -> Add tower type , has 2 type tower/trap. Default: tower
<through:false>(optional) -> Add through option for tower . This make if the tower is through or not. Default: false
<health:1>(optional) -> Add health to the tower . This is used for trap. Default: 1
<sedestroy:Blow4>(optional) -> Add custom sound effect when tower is destroyed, if not stated destroy se using destroy sound in plugin parameter. Default:null
<sedestroyvolume:25>(optional) -> Setting volume for destroyed volume. Default: 25
<characterindexx:0>(optional) -> Setting for X index in character sprite, used for TRAP. Default: 0
<durability:false>(optional) -> Setting if through trap has durability or not. Default: false
<durabilityvalue:1>(optional) -> If `durability` set true, then when trap attacking this value will decrease, and reach 0 the trap is destroyed. Default: 1
<attackspritey:3>(optional) -> When trap through attacking, the sprite will change to this Y index. Default: 0
```

- CHANGE: Change BSPD in tower action to ATK Type, Status will also change if the tower is trap type

## Version 1.2.2 - 21/12/2020

- BUGFIX: Fix crash in upgrade tower
- ADD: add visustella compatibility

## Version 1.2.1 - 20/12/2020

- BUGFIX: When using keyboard and move tower, the grid is slightly off
- BUGFIX: When mouse hover in upgrade menu and hit cancel button, backpack ui show
- BUGFIX: Fix hover upgrade info sometimes display first upgrade not the one that selected
- CHANGE: Cleanup some parameters Thanks [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/)

## Version 1.2 - 20/12/2020

Thanks to [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/) for their [extension!](https://forums.rpgmakerweb.com/index.php?threads/ufc-tower-defense.130384/post-1141044) now there's Shop GUI!

- CHANGE: Change update `updateHealthHud` to `updateHUD`. `updateHUD` will update every hud gold and health
- CHANGE: Now if there's no `Plugin Command Config` in the map, the game will not create hud or any tower defense mechanic.
- ADD: `Plugin Command: Disable Tower Defense` This will destroy any tower defense element and enable menu
- ADD: Add tooltip to backpack item selection
- ADD: `Trigger Wait Enemy`, make enemy wait when touch with the event
- ADD: Shop GUI, setting can be configured in plugins parameters, this will also add `Plugin Command Shop GUI Items` & `Plugin Command Shop GUI Items Reset`
- ADD: Steal effect, steal gold per hit -> `steal|2|0|80` -> `ID steal | gold per hit | do nothing | chance steal`
- ADD: Critical effect, add critical chance -> `critical|2|0|50` -> `ID critical | damage multiplier | do nothing | chance critical`
- ADD: Resistance effect option to `Setup Enemy`, if configured this will make the enemy resist with the effect
- ADD: Item Drop option to `Setup Enemy`, if you want enemy drop certain items when defeated

## Version 1.1 - 6/12/2020

Special thanks to [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/), [@estriole](https://forums.rpgmakerweb.com/index.php?members/estriole.2487/) for their inputs!

- BUGFIX: Fix sometimes tower can be placed to blocked area when map scrolled
- CHANGE: Add chance parameter to effects, effect parameter is become ( `ID EFFECT | EFFECT | DURATION | CHANCE` ) If `CHANCE` not stated it's automatic become `100`, ex: `cold|80|240|50` -> `ID cold | 80% decrease movement speed | 4s duration | 50% chance`
- CHANGE: If tower base attack 0, the tower will stop/never searching enemy, it's usefull if want make pure auras tower
- CHANGE: Tower now will display range attack when get selected, range is also updated when get buff range from aura tower
- CHANGE: Effect now will to pick most effective effect
- CHANGE: Change all string SE to type `file -> dir/audio/se`
- CHANGE: Change any animation type from `number` to `animation`
- CHANGE: Change `<effectnote>` to `<note> note </note>` so it's become more easy to use multi line

```
<note>
Cold Effect
slow \C[3]30%\C movement
for \C[3]4s
</note>
```

- CHANGE: Change `HealthVariable, HealthMaxVariable, GameOverSwitch, LimitAnimation` location from `plugin command` to `plugin settings`
- CHANGE: Change how tower get stored, now get seprated with normal item
- CHANGE: Placing tower now using backpack gui
- CHANGE: Tower Action GUI & add `pickup` option
- CHANGE: Change upgrade system, now using `<upgrade:ID|UPGRADE PRICE>` price is optional if not stated price is using price in DB, and now can use have multiple upgrade, for multiple upgrade add number in upgrade ex: `<upgrade2:23><upgrade3:ID>` you can have as many upgrade you want just add number infront of upgrade
- ADD: Stun effect, effects -> `stun|0|240|80` -> `ID stun | do nothing | duration stun | chance stun`
- ADD: Rage effect, make the enemy walk faster -> `rage|100|240|30` -> `ID rage | 100% increase movement speed | 4s duration | 30% chance`
- ADD: Enemy types, tower can only attack same type or all type. current type is `air | ground | all`. There is new plugin command variable for `Setup Enemy` it is `Enemy Type`. For tower need note `<attacktype:all>` value need lower case. If enemy type is all then any tower attack type can attack it, also same with tower
- ADD: Aura tower type, this aura give buff to other tower that in aura tower range, tower can give negative & multiple effect. the tower need note `<auras:attack|2|fixed>` this mean -> `ID auratype | value | aura type mode`, there's 2 aura type mode `fixed | percentage`. `fixed` mean tower will give fixed increment/decrement to the tower ex: `<auras:attack|2|fixed>` mean the tower attack will increase by _2_. `percentage` is percentage of the tower ex: `<auras:attackspeed|90|percentage>` mean the tower will increase 90% more faster. to give negative effect add - infront the value `<auras:range|-2|fixed>` will decrease range by _2_. For multi aura use `,` seprator -> `<auras:range|-2|fixed,attack|10|fixed>`
- ADD: Debug option in parameter when debug mode `hold 1` to multiplier ticker speed so the game become more faster. `press 2` to show all tower range. `press 3` to cheat gold and crystal hp, `press 4` to limit animation
- ADD: Trigger Config, make trigger only for specific enemy, ex: event have `Trigger Move Enemy` and if you also add `Trigger Config` you can set if the enemy only move if condition in config meet. Order checking trigger config is **ExceptEnemy** -> **OnlyEnemy** -> **EnemyType**
- ADD: Add `Is Through` option to `Setup Enemy` default is `false`
- ADD: Add customization `Opacity & Color` for `attack range, aura range, grid` in plugin setting parameters. Thanks [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/)
- ADD: Add backpack tower gui for placing tower
