# Change Log

## Version 1.1 - dev

Special thanks to [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/), [@estriole](https://forums.rpgmakerweb.com/index.php?members/estriole.2487/) for their inputs!

- CHANGE: Add chance parameter to effects, effect parameter is become ( `ID EFFECT | EFFECT | DURATION | CHANCE` ) If `CHANCE` not stated it's automatic become `100`, ex: `cold|80|240|50` -> `ID cold | 80% decrease movement speed | 4s duration | 50% chance`
- CHANGE: If tower base attack 0, the tower will stop/never searching enemy, it's usefull if want make pure auras tower
- CHANGE: Tower now will display range attack when get selected, range is also updated when get buff range from aura tower
- CHANGE: Effect now will to pick most effective effect
- CHANGE: Change all string SE to type `file -> dir/audio/se`
- ADD: Stun effect, effects -> `stun|0|240|80` -> `ID stun | do nothing | duration stun | chance stun`
- ADD: Rage effect, make the enemy walk faster -> `rage|100|240|30` -> `ID rage | 100% increase movement speed | 4s duration | 30% chance`
- ADD: Enemy types, tower can only attack same type or all type. current type is `air | ground | all`. There is new plugin command variable for `Setup Enemy` it is `Enemy Type`. For tower need note `<attacktype:all>` value need lower case. If enemy type is all then any tower attack type can attack it, also same with tower
- ADD: Aura tower type, this aura give buff to other tower that in aura tower range, tower can give negative & multiple effect. the tower need note `<auras:attack|2|fixed>` this mean -> `ID auratype | value | aura type mode`, there's 2 aura type mode `fixed | percentage`. `fixed` mean tower will give fixed increment/decrement to the tower ex: `<auras:attack|2|fixed>` mean the tower attack will increase by _2_. `percentage` is percentage of the tower ex: `<auras:attackspeed|90|percentage>` mean the tower will increase 90% more faster. to give negative effect add - infront the value `<auras:range|-2|fixed>` will decrease range by _2_. For multi aura use `,` seprator -> `<auras:range|-2|fixed,attack|10|fixed>`
- ADD: Debug option in parameter when debug mode `hold 1` to multiplier thick speed so the game become more faster. `press 2` to switch always show all tower range. `press 3` to cheat gold and crystal hp, `press 4` to limit animation
- ADD: Trigger Config, make trigger only for specific enemy, ex: event have `Trigger Move Enemy` and if you also add `Trigger Config` you can set if the enemy only move if confition in config meet. Order checking trigger config is **ExceptEnemy** -> **OnlyEnemy** -> **EnemyType**
- ADD: add `Is Through` option to `Setup Enemy` default is `false`
- ADD: Add customization `Opacity & Color` for attack range & aura in plugin setting parameters. Thanks [@wrigty12](https://forums.rpgmakerweb.com/index.php?members/wrigty12.25770/)
