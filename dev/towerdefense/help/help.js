/*:
@target MZ

@plugindesc Add Tower Defense Mechanic
@author Unwanted Fried Chicken

@param setting.limitAnimation
@text Limit Animation
@desc If frame rate become low because so many effect try limit the animation
@type number

@param setting.towerHealthVarId
@text Tower Health variable ID
@desc This health of the tower set to your variable id
@type variable

@param setting.towerMaxHealthVarId
@text Tower Max Health variable ID
@desc This Max health of the tower set to your variable id
@type variable

@param setting.gameoverSwitchId
@text Game Over Switch Id
@desc When health <= 0 this switch will change to ON
@type switch

@param towerSettings
@text Tower Settings

@param attackRangeOpacity
@parent towerSettings
@text Attack Range Opcaity
@type number
@desc Set the opacity of towers' Attack Range
@decimals 1
@default 0.4

@param attackRangeColor
@parent towerSettings
@text Attack Range Color
@type text
@desc Set the color of towers' Attack Range. Default = #17b978
@default #17b978

@param auraRangeColor
@parent towerSettings
@text Aura Range Color
@type text
@desc Set the color of aura towers' Aura Range. Default = #17b978
@default #17b978

@param auraRangeOpacity
@parent towerSettings
@text Aura Range Opcaity
@type number
@desc Set the opacity of towers' Attack Range
@decimals 1
@default 0.4

@param debugMode
@text Debug Mode
@type boolean
@desc Enable debug mode?
@default false

@param tickerSpeed
@parent debugMode
@text Thick Speed
@type number
@desc Speed multiplier for ticker
@default 2

@param limitAnimation
@parent debugMode
@text Limit Animation
@type number
@desc Limit Animation
@default 5

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

@command triggerConfig
@text Trigger Config
@desc Trigger for specific config

@arg enemyType
@text Enemy Type
@type select
@option All
@option Air
@option Ground
@default All
@desc Defines enemy type

@arg onlyEnemy
@text Only Enemy
@type string[]
@desc Only this enemy will be trigger
@default []

@arg exceptEnemy
@text Except Enemy
@type string[]
@desc This enemy will not get triggered
@default []

@command triggerDestroy
@text Trigger Destroy Enemy
@desc Enemy will get destroy when go here

@arg attack
@text Attack
@desc Is enemy attack before get destroy?
@type boolean
@default true

@arg attackEventId
@text Attack Event ID
@desc If attack enemy, give attack animation to this event
@type number
@default 0

@arg animationId
@text Death Animation Id
@desc Give animation when enemy dead
@type animation
@default 0

@command triggerMove
@text Trigger Move Enemy
@desc Enemy will change their direction here

@arg direction
@text Direction
@desc Defines enemy direction, for multiple direction add "/" -> Left/Right/Up mean direction is left, right or up
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
@type file
@dir audio/se/
@desc Start wave sound effect

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
@desc Defines enemy default direction, for multiple direction add "/" -> Left/Right mean direction is left or right
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
@decimals 2
@default 3.5
@desc Defines this enemy move speed, can use float number

@arg gold
@text Gold
@type number
@default 100
@desc When enemy get killed get gold

@arg attackAnimation
@text Attack Animation ID
@type animation
@default 1
@desc Defines attack Animation when this enemy attack

@arg enemyType
@text Enemy Type
@type select
@option All
@option Air
@option Ground
@default All
@desc Defines enemy type

@arg isThrough
@text Is Through
@type boolean
@default false
@desc Is this enemy through?

@arg seDead
@text Dead SE
@type file
@dir audio/se/
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
@decimals 2
@desc Defines enemy scale

*/
