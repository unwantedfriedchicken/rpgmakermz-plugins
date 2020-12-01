# Change Log

## Version 1.1 - dev

- CHANGE: Add chance parameter to effects, effect parameter is become ( `ID EFFECT | EFFECT | DURATION | CHANCE` ) If `CHANCE` not stated it's automatic become `100`, ex: `cold|80|240|50` -> `ID cold | 80% decrease movement speed | 4s duration | 50% chance`
- BUGFIX: Effect cold to pick most effective effect
- ADD: Stun effect, effects -> `stun|0|240|80` -> `ID stun | NOTHING | duration stun | chance stun`
- ADD: Rage effect, make the enemy walk faster -> `rage|100|240|30` -> `ID rage | 100% increase movement speed | 4s duration | 30% chance`
- ADD: Enemy types, tower only can attack same type or all type. current type is `air | ground | all`. There is new plugin command variable for setup enemy it is `Enemy Type`. For tower need note `<attacktype:all>` value need lower case. If enemy type is all then any tower attack type can attack it, also same with tower
