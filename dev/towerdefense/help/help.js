/*:
@target MZ

@plugindesc Add Tower Defense Mechanic
@author Unwanted Fried Chicken

@command config
@text Config Tower Defense
@desc Configuration

@arg onlyTerrain
@text Place building terrain
@desc Set place building terrain tag, if set 0 then building can be placed anywhere except where player can't pass. multiple tag use , to seprate
@type text
@default 0

@arg exceptTerrain
@text Can't place in this terrain
@desc Set place where building can't be set with terrain tag. multiple tag use , to seprate
@type text
@default 0

@arg limitAnimation
@text Limit Animation
@desc If frame rate become low because so many effect try limit the animation
@type number
@default 0

@arg towerHealthVarId
@text Tower Health variable ID
@desc This health of the tower set to your variable id
@type number
@default 0

@arg towerMaxHealthVarId
@text Tower Max Health variable ID
@desc This Max health of the tower set to your variable id
@type number
@default 0

@arg gameoverSwitchId
@text Game Over Switch Id
@desc When health <= 0 this switch will change to ON
@type number
@default 0

@command showHealthBar
@text Show Health HUD
@desc Show Health HUD

@arg show
@text Show
@desc Show Health Hud
@type boolean
@default true

@command showGold
@text Show Gold HUD
@desc Show Gold HUD

@arg show
@text Show
@desc Show Gold Hud
@type boolean
@default true

@command updateHealthHud
@text Update Health Hud
@desc Update Health Hud To Current Variable Value

@command limitAnimation
@text Limit Animation
@desc Set limit animation

@arg limit
@text Total Limit animation
@desc This will limit animation, set 0 to unlimited animation
@type number
@default 0

@command triggerDestroy
@text Trigger Destroy Enemy
@desc Enemy will get destroy when go here

@arg attack
@text Attack
@desc Is enemy attack before get destroy?
@type select
@option true
@option false
@default true

@arg attackEventId
@text Attack Event ID
@desc If attack enemy, give attack animation to this event
@type number
@default 0

@arg animationId
@text Death Animation Id
@desc Give animation when enemy dead, set 0 to no animation
@type number
@default 0

@command triggerMove
@text Trigger Move Enemy
@desc Enemy will change their direction here

@arg direction
@text Direction
@desc Defines enemy direction
@type select
@option Left
@option Right
@option Up
@option Down
@option Left/Right
@option Down/Left
@option Down/Right
@option Up/Down
@option Up/Right
@option Up/Left
@option Random
@default Left

@command startWave
@text Start Tower Defense
@desc When this fired the game will play

@arg spawnLocationId
@text Spawn Location ID
@type number
@default 1
@desc Defines this enemy spanw location

@arg enemy
@text Enemy Name
@type text
@default Jombi
@desc Defines this enemy name

@arg numberSpawn
@text Total Spawn
@type number
@default 5
@desc Defines total enemy number

@arg delayPerSpawn
@text Time Per Spawn
@type number
@default 60
@desc Defines time between each spawn number is perframe 1/60s

@arg delay
@text Delay Before Spawn
@type number
@default 0
@desc This usefull if have multiple spawn wave and want have delay between them

@arg startSE
@text Start Wave SE
@type text
@default 0
@desc Start wave sound effect, leave 0 to disable

@arg startSEVolume
@text Start Wave SE Volume
@type text
@default 100
@desc Start wave sound effect Volume

@command setSpawn
@text Set Enemy Spawn Location
@desc Set up where enemy will spawn

@arg direction
@text Direction Spawn
@desc Defines this enemy default direction
@type select
@option Left
@option Right
@option Up
@option Down
@default Left

@command setupEnemy
@text Setup enemy data
@desc Setup enemy data

@arg id
@text ID
@type text
@default anon
@desc Defines this enemy id, no space or special character

@arg name
@text Name
@type text
@default Anon
@desc Defines this enemy name

@arg health
@text Health
@type number
@default 10
@desc Defines this enemy health

@arg attackDamage
@text Attack Damage
@type number
@default 10
@desc Defines attack damage

@arg moveSpeed
@text Move Speed
@type number
@default 3.5
@desc Defines this enemy move speed, can use float number

@arg gold
@text Gold
@type number
@default 100
@desc When enemy get killed get gold

@arg attackAnimation
@text Attack Animation ID
@type number
@default 1
@desc Defines attack Animation when this enemy attack

@arg seDead
@text Dead SE
@type text
@default Slash2
@desc Defines Sound effect when dead

@arg seDeadVolume
@text Dead SE Volume
@type number
@default 90
@desc Defines Sound effect when dead volume

@arg scale
@text Enemy Scale
@type number
@default 1
@desc Defines enemy scale
*/
