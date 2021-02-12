# Tower Defense Plugins Documentation

This plugin will add tower defense mechanic to your rpg maker  
for demo check https://unwantedfriedchicken.itch.io/adventurer-guild-the-barrier-defender

## Demo

[**Demon Lord Training**](https://unwantedfriedchicken.itch.io/demon-lord-training-ufc-tower-defense-demo) This is made purely for demonstration of this plugins,
you can see the event that get used and some comment about it

## How to use

For more accurate to use, see source in **demo**

- Install **UFCGuideAction** & **UFCTowerDefense**
- If you want add text damage when attacking install **UFCTextHelper**
- Download **TDSet.png** & **TDShopIcon.png** from [**Resources**](https://github.com/unwantedfriedchicken/rpgmakermz-plugins/tree/master/resources) folder and place it to **img/system**
- And **!Weapon_TD.png** to **img/characters**
- Setup your plugin parameter
- Add tower to your database, see **Setup Tower** section
- Add enemy event, setup the character image and set trigger to parallel and add event **Setup Enemy Data** and **erase event**
- Add event with trigger parallel and Setup your variable health & max health also add plugin command **UFCTowerDefense -> Config Tower Defense** and add erase event since we only need to call it once, and this is important to initialize the tower defense mode
- (optional) if you want to immediately autorun to play towerdefense mode also add plugin command **Show Health Hud, Show Gold HUD, Show Item Slot GUI**
- Add enemy spawn location with add event and -> add plugin command **Set Enemy Spawn Location** -> add **Erase event**
- Add event for enemy damage the crystal with add event and add plugin command **Trigger Destroy Enemy** -> add Erase event
- Add event to summon enemy with **Plugin Command -> Start Tower Defense**
- done! your tower defense already configured

## Setup Tower

- Open Database -> items
- Add new item, set the **name**, **icon**, **price**, **Animation**. Animation is used when bullet hit enemy
- add this **note**

```
<ufcTD>
<attack:0>
<attackspeed:120>
<bulletspeed:600>
<bulletspritename:!Weapon_TD>
<bulletspriteindex:0>
<bulletspriteindexy:0>
<range:3>
<character:Actor3>
<characterindex:3>
<attacktype:all>
<upgrade:67|200>
<sellprice:30>
<effects:cold|60|300>
<auras:attack|6|fixed>
<note>
Can't attack
Increase +6 attack damage in range
</note>
</ufcTD>
```

you can delete any **optional** note

## Explanation For Setup Tower Note

**type** (optional) : Tower type, has 2 type `tower | trap`. **_Default : tower_**  
**attack** (optional) : Damage inflicted to the enemy, set to 0 if you want this tower not searching for target. **_Default : 0_**  
**attackspeed** (optional) : Attack speed of the tower **_Default : 240_**  
**bulletspeed** (optional) : Bullet speed when go to the target, don't make it too fast since it will become like orbit, if you want make seem like fast just make it invisible **_Default : 600_**  
**bulletspritename** (optional) : Sprite name in Character folder, this is using standard character sprite with seperator X by 3 sprite but Y by 1 **_Default : ?_**  
**bulletspriteindex** (optional) : X index from bulletspritename **_Default : 0_**  
**bulletspriteindexy** (optional) : Y index from bulletspritename **_Default : 0_**  
**range** (optional) : Range of the tower **_Default : 0_**  
**through** (optional) : Through option for tower . This make if the tower is through or not. **_Default : false_**  
**health** (optional) : health to the tower. This is used for trap. **_Default : 1_**  
**sedestroy** (optional) : Add custom sound effect when tower is destroyed, if not stated destroy se using destroy sound in plugin parameter. **_Default : null_**  
**sedestroyvolume** (optional) : Setting volume for destroyed volume. **_Default : 25_**  
**durability** (optional) : Setting if through trap has durability or not. **_Default : false_**  
**durabilityvalue** (optional) : If `durability` set true, then when trap attacking this value will decrease, and reach 0 the trap is destroyed. **_Default : 1_**  
**attackindexy** (optional) : When trap through attacking, the sprite will change to this Y index. **_Default : 0_**  
**character** : Character name in character folder  
**characterindex** : Index of the character 0 ~ 7  
**attacktype** (optional) : What monster type that this tower can attack the mode is  
`all | air | ground` all mean the tower can attack any types **_Default : all_**  
**upgrade** (optional) : Upgrade id for the tower, you can add multiple upgrade, for multiple upgrade add number in upgrade ex: `<upgrade2:23><upgrade3:34>` you can have many upgrade you want

> `ID TOWER | UPGRADE PRICE (OPTIONAL)`
>
> > **ID TOWER**  
> > Id of the upgrade tower

> > **PRICE**  
> > Price for upgrade the tower, if not stated price is using price in DB

> **Example**

```
<upgrade:23>
<upgrade2:34|200>
```

> Have 2 upgrade from this tower and the second upgrade price is 200

**upgradematerial** (optional) : Make upgrade to require multiple material use , seprator and to set ammount use | after the item ID

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

**note** : Note when tower is selected / in upgrade  
**sellprice** (optional) : if you want custom sellprice set here otherwise the sell price is half of the price item **_Default : Half of buy price_**  
**effects** (optional) : the effect this tower can inflict to the enemy, for multiple effects use , seprator.

> `ID EFFECT | EFFECT VALUE | DURATION | CHANCE (OPTIONAL)`

> > **ID EFFECT**
> >
> > > **cold** : decrease enemy movement, effect using percentage, ex: 50 mean increase 50% movementspeed  
> > > **stun** : stun enemy movement, effect doesnt matter here  
> > > **poison** : poison enemy, the effect is using damage per second, ex: 2 mean 2hp/s  
> > > **rage** : increase enemy movement, effect using percentage, ex: 50 mean increase 50% movementspeed  
> > > **steal** : increase gold per hit monster, effect duration doesnt matter here  
> > > **critical** : critical attack, with effect multiply from damage, ex: 1.3 mean damage \* 1.3, effect duration doesnt matter here

> > **EFFECT VALUE**  
> > the effect value that tower give

> > **DURATION**  
> > The duration effect in the enemy, using 1s/60

> > **CHANCE**  
> > Chance of the enemy have this effect, if not stated default is 100%

> **Example**  
> `<effects:cold|60|240|40,rage|40|120|60>`  
> Give 40% chance of getting cold with effect 60% decrease movement for 4s and  
> Give 60% chance of getting rage with effect 40% increase movement for 2s

**auras** (optional): The effect this tower give to surrounding tower, for multiple aura use , seprator and for negative aura use **-** **(minus)**

> `ID AURA | AURA VALUE | AURA TYPE MODE`

> > **ID AURA**
> >
> > > **attack** : increase/decrease tower damage  
> > > **attackspeed** : increase/decrease tower attack speed  
> > > **range**: increase/decrease tower range

> > **AURA VALUE**  
> > the aura value that tower give

> > **AURA TYPE MODE**
> >
> > > **fixed** : add fixed value to other tower  
> > > **percentage** : add percentage from the target tower

> **Example**  
> `<auras:attack|6|fixed,range|-2|fixed,attackspeed|-30|percentage>`  
> Give +6 attack damage but -2 range and attack speed slower 30%

**sedestroy** (optional): Custom sound effect when tower is destroyed, if not stated destroy se using destroy sound in plugin parameter  
**sedestroyvolume** (optional): Setting volume for destroyed volume. **_Default : 25_**

**TRAP NOTE** Only for trap  
**health** (optional) (trap only): Health to the tower. This is used for trap. **_Default : 1_**  
**characterindexx** (optional) (trap only): Setting for X index in character sprite, used for TRAP. **_Default : 0_**  
**durability** (optional) (trap only): Setting if through trap has durability or not **_Default : false_**  
**durabilityvalue** (optional) (trap only): If `durability` set true, then when trap attacking this value will decrease, and when reach 0 the trap is destroyed **_Default : 1_**  
**attackspritey** (optional) (trap only): When trap through attacking, the sprite will change to this Y index, then go back to 0 **_Default : 0_**  
<br>

---

## Plugin Commands

<br>

### **Config Tower Defense** (required)

This is used for configuration and initialize the mode make it parallel if you want current map have tower defense mode

### **Cache Tower Defense**

This plugin command will cache image.load that used by tower defense
For example if this not called when buying tower in shop,
the sprite will not get displayed for first time
This plugin is not needed if you already call plugin TowerDefense.Config

### **Disable Tower Defense**

This will disable & destroy any tower defense mode,

### **Limit Animation**

limit how many animations that get display, 0 mean unlimited

### **Trigger Config**

If you want specific trigger like control the enemy types with other trigger  
example: you want enemy to only set direction if enemy type is ground  
then add **Trigger Config** and set enemy type to ground then add **Trigger move enemy**

### **Trigger Destroy Enemy**

Most of the time this trigger is used for attacking the crystal/hp but if you want just destroy the enemy, set value **Attack** to **false**

### **Trigger Move Enemy**

Set enemy direction if want only specific enemy combine it with trigger config

### **Trigger Trigger Wait Enemy**

Enemy will wait in this area for configured duration before move

### **Start Tower Defense**

This is for spawning, after you configure it, this wave will start, you can have as many as you want and when this is call the $gameMap.isWaveEnd() will return false

### **Set Enemy Spawn Location**

This is spawn location for the enemy, and required for start tower defense

### **Setup enemy data**

This is for setup the enemy, after setup erase the event, if you want to make another enemy create another event. also the **ID need unique**

### **Show Item Slot GUI**

Show your backpack item slot

### **Show Health HUD**

Show your Health HUD

### **Show Gold HUD**

Show your Gold HUD

### **Update HUD**

When you decrease/increase the variable used by crystal health or any hud element call this to update the graphics

### **Shop GUI Items**

Change items appear in the Shop GUI

### **Shop GUI Items Reset**

Reset items in Shop GUI to default items

---

## Debug Mode

When debug mode is set to `true` in plugin parameters

- `press 1` to multiplier ticker speed so the game become more faster
- `press 2` to show all tower range
- `press 3` to cheat gold and crystal hp
- `press 4` to limit animation

---

## Special Command

### **$gameMap.isWaveEnd()**

This is for checking if the wave is end, it will check if every monster is defeated and every wave is spawned

---

## Released Game

[**Adventurer Guild**](https://unwantedfriedchicken.itch.io/adventurer-guild-the-barrier-defender) This plugin is made because of this game, it's more complicated than prev demo since it's complete game, this is game using old version of this plugin, you can see the source, with download source version
