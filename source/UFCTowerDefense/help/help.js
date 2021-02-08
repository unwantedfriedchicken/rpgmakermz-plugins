/*:
@target MZ
@plugindesc Add Tower Defense Mechanic
@author Unwanted Fried Chicken
@url https://unwantedfriedchicken.itch.io
@help
Author: UnwantedFriedChicken
Version: 1.3
Itch.io : https://unwantedfriedchicken.itch.io
Github : https://github.com/unwantedfriedchicken/rpgmakermz-plugins/

This plugin add tower defense mechanic for more detail explaination checkout the documentation

Documentation
https://github.com/unwantedfriedchicken/rpgmakermz-plugins/blob/master/dev/towerdefense/README.md

Changelog
https://github.com/unwantedfriedchicken/rpgmakermz-plugins/blob/master/dev/towerdefense/CHANGELOG.md

Found bug? report the bug here:
https://forums.rpgmakerweb.com/index.php?threads/ufc-tower-defense.130384/
https://github.com/unwantedfriedchicken/rpgmakermz-plugins/issues

Need support or want private convo? I can easly reachout by email
unwantedfriedchicken<at>gmail.com

@param setting_crystalName
@text Crystal Name
@desc Name of the crystal/gate
@type string
@default Crystal Health

@param setting_limitAnimation
@text Limit Animation
@desc If frame rate become low because so many effect try limit the animation
@type number

@param setting_towerHealthVarId
@text Tower Health variable ID
@desc This health of the tower set to your variable id
@type variable

@param setting_towerMaxHealthVarId
@text Tower Max Health variable ID
@desc This Max health of the tower set to your variable id
@type variable

@param setting_gameoverSwitchId
@text Game Over Switch Id
@desc When health <= 0 this switch will change to ON
@type switch

@param setting_soundSettings
@text Sound Settings
@desc Setting sounds for tower defense
@type struct<SoundSettings>
@default {"effectSteal":"Coin","towerDestroy":"Door2","towerCancel":"Cancel1","towerPlace":"Equip1","towerUpgrade":"Coin","towerSell":"Coin"}

@param hudguiSettings
@text HUD/GUI Settings

@param gui_itemBackpackSlotSize
@parent hudguiSettings
@text Item Size
@type number
@desc Set the size of the item backpack slot
@default 64

@param gui_itemBackpackSlotCol
@parent hudguiSettings
@text Item Display Number
@type number
@desc Set the number item that display in backpack
@default 12

@param gui_itemBackpackBackgroundType
@parent hudguiSettings
@text Item Background Type
@type select
@option Default
@value 0
@option Dim
@value 1
@option Nothing
@value 2
@desc Background type for window
@default 0

@param gui_itemBackpackNumSize
@parent hudguiSettings
@text Item Ammount Size
@type number
@desc Size of the numsize item
@default 24

@param towerSettings
@text Tower Settings

@param animateTower
@parent towerSettings
@text Animate Tower
@type boolean
@desc Animate tower idle
@default false

@param attackRangeColor
@parent towerSettings
@text Attack Range Color
@type text
@desc Set the color of towers' Attack Range. Default = #17b978
@default #17b978

@param attackRangeOpacity
@parent towerSettings
@text Attack Range Opcaity
@type number
@desc Set the opacity of towers' Attack Range
@decimals 1
@default 0.4

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

@param gridColor
@parent towerSettings
@text Grid Tower Color
@type text
@desc Set the color of grid. Default = #61FFB4
@default #61FFB4

@param gridColorOpacity
@parent towerSettings
@text Grid Tower Color Opcaity
@type number
@desc Set the opacity of grid 
@decimals 1
@default 0.4

@param gridTrapColor
@parent towerSettings
@text Grid Trap Color
@type text
@desc Set the color of grid. Default = #F20505
@default #F20505

@param gridTrapColorOpacity
@parent towerSettings
@text Grid Trap Color Opcaity
@type number
@desc Set the opacity of grid 
@decimals 1
@default 0.4

@param enemySettings
@text Enemy Settings

@param enemyHealthUI
@parent enemySettings
@text Enemy Health UI
@desc Configuration for enemy health UI
@type select
@option Show
@value show
@option Only When Damaged
@value onlyWhenDamaged
@option Hide
@value hide
@default hide

@param enemyHealthWidth
@parent enemySettings
@text Enemy Health Width
@desc Enemy Health
@default 48
@type number

@param enemyHealthHeight
@parent enemySettings
@text Enemy Health Height
@desc Enemy Health
@default 5
@type number

@param enemyHealthColor
@parent enemySettings
@text Enemy Health Color
@type text
@desc Set the color of health enemy. Default = #85DB18
@default #85DB18

@param enemyHealthColorOpacity
@parent enemySettings
@text Enemy Health Color Opcaity
@type number
@desc Set the opacity of health enemy 
@decimals 1
@default 1

@param tooltip
@text Tooltip
@type boolean
@desc Enable tooltip?
@default true

@param tooltipYPosition
@parent tooltip
@text Y Position
@type number
@min -99999
@desc Y position of tooltip
@default -40

@param tooltipFontSize
@parent tooltip
@text Font Size
@type number
@desc Tooltip font size
@default 18

@param tooltipBackgroundType
@parent tooltip
@text Background Type
@type select
@option Default
@value 0
@option Dim
@value 1
@option Nothing
@value 2
@desc Background type for tooltip
@default 1

@param shopgui
@text Add Shop Button
@type boolean
@desc Add shop button gui
@default true

@param shopguiType
@parent shopgui
@type select
@option Quick Buy
@option Open Shop
@text Shop Type
@default Open Shop
@desc Type shop when press shop button

@param shopguiQSSetting
@parent shopgui
@default {"backgroundType":"0","width":"280","height":"300","itemHeight":"60","itemTextSize":"18"}
@type struct<QuickShopSettings>
@text Quick Shop Setting
@desc Quick Shop Setting

@param shopguiDefaultItems
@parent shopgui
@text Default Items
@type item[]
@desc Default items appear in shop
@default []

@param shopguiMultiplier
@parent shopgui
@text Price Multiplier
@type number
@decimals 2
@desc Price multiplier when buy from shop button
@default 1.2

@param shopguiRoundPrice
@parent shopgui
@text Round Price
@type number
@default 1
@desc Round the price power 10, 0 = disable, 1 = 10, 2 = 100. ex: value 2 -> price 140 -> become 200

@param shopguiIconWidth
@parent shopgui
@text Shop Button Width
@type number
@default 144
@desc Shop Button Width

@param shopguiIconHeight
@parent shopgui
@text Shop Button Height
@type number
@default 72
@desc Shop Button Height

@param shopguiIconXPosition
@parent shopgui
@text Shop Button X Position
@type number
@min -99999
@default 0
@desc Icon X Position

@param shopguiIconYPosition
@parent shopgui
@text Shop Button Y Position
@type number
@min -99999
@default 0
@desc Shop Button Y Position

=========================== DEBUG =================================

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
@desc Limit Animation
@default 5
@type number



=========================== Plugin Command =================================
@command config
@text Config Tower Defense
@desc Configuration

@arg placeTower
@text Place Tower

@arg placeTowerTerrain
@parent placeTower
@text Terrain

@arg onlyTerrain
@parent placeTowerTerrain
@text Place building terrain
@desc Set place building only in this terrain tag, If empty building can be placed anywhere
@type number[]
@default []

@arg exceptTerrain
@parent placeTowerTerrain
@text Can't place terrain
@desc Set place where building can't be set with this terrain tag.
@type number[]
@default []

@arg placeTowerRegionID
@parent placeTower
@text RegionID

@arg onlyRegionID
@parent placeTowerRegionID
@text Place building region ID
@desc Set place building only in this region ID
@type number[]
@default []

@arg exceptRegionID
@parent placeTowerRegionID
@text Can't place region ID
@desc Set place where building can't be set with this region ID.
@type number[]
@default []

@arg placeTrap
@text Place Trap

@arg placeTrapTerrain
@parent placeTrap
@text Terrain

@arg onlyTrapTerrain
@parent placeTrapTerrain
@text Place trap terrain
@desc Set place trap only in this terrain tag, If empty trap can be placed anywhere
@type number[]
@default []

@arg exceptTrapTerrain
@parent placeTrapTerrain
@text Can't place terrain
@desc Set place where trap can't be set with this terrain tag.
@type number[]
@default []

@arg placeTrapRegionID
@parent placeTrap
@text RegionID

@arg onlyTrapRegionID
@parent placeTrapRegionID
@text Place trap region ID
@desc Set place trap only in this region ID
@type number[]
@default []

@arg exceptTrapRegionID
@parent placeTrapRegionID
@text Can't place region ID
@desc Set place where trap can't be set with this region ID.
@type number[]
@default []

@command disableTowerDefense
@text Disable Tower Defense
@desc Disable Tower Defense mean will destroy any tower defense element, to go back to tower defense mode need to call Config again

@arg destroyTower
@type boolean
@default false
@text Destroy Tower
@desc Destroy/delete any placed tower

@arg destroyEnemy
@type boolean
@default false
@text Destroy Enemy
@desc Destroy/delete any enemy

@arg deleteTDItems
@type boolean
@default true
@text Delete Tower Defense Item
@desc Delete every tower defense items in backpack

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
@value all
@option Air
@value air
@option Ground
@value ground
@default all
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

@command triggerWait
@text Trigger Wait Enemy
@desc Trigger for wait

@arg duration
@text Duration
@desc duration frames (1/60 sec)
@type number
@default 60

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

@arg attackSpeed
@text Attack Speed
@type number
@default 120
@desc Defines attack speed

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
@value all
@option Air
@value air
@option Ground
@value ground
@default all
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

@arg itemDrop
@text Item Drop
@desc Item Drop
@type struct<ItemDrops>[]
@default []

@arg resistance
@text Effects Resistance
@desc Effect resistance
@type select[]
@option Cold
@value cold
@option Poison
@value poison
@option Stun
@value stun
@option Rage
@value rage
@option Steal
@value steal
@option Critical
@value critical
@default []

@command showGUIItemSlot
@text Show Item Slot GUI
@desc Show Item Slot GUI

@arg show
@text Show
@desc Show Item Slot GUI
@type boolean
@default true

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

@command updateHUD
@text Update Hud
@desc Update every Hud To Current Variable Value

@command shopGUIItemsEdit
@text Shop GUI Items
@desc Change items appear in the Menu Shop

@arg items
@text Items
@desc Items appear in the GUI Shop
@type item[]
@default []

@command shopGUIItemsReset
@text Shop GUI Items Reset
@desc Reset GUI Shop to default
*/

/*~struct~ItemDrops:
@param items
@text Items
@desc Items
@type item
@default 0

@param amount
@text Amount
@desc amount drop
@type number
@default 1

@param chance
@text Chance
@desc chance drop
@type number
@default 100
*/

/*~struct~SoundSettings:
@param effectSteal
@text Effect Steal
@desc Effect Steal sound
@type file
@dir audio/se/
@default Coin

@param towerDestroy
@text Destroy Tower
@desc Destroy Tower sound
@type file
@dir audio/se/
@default Door2

@param towerCancel
@text Cancel Tower Select
@desc Cancel Tower Select sound
@type file
@dir audio/se/
@default Cancel1

@param towerPlace
@text Place Tower
@desc Place Tower sound
@type file
@dir audio/se/
@default Equip1

@param towerUpgrade
@text Upgrade Tower
@desc Upgrade Tower sound
@type file
@dir audio/se/
@default Coin

@param towerSell
@text Sell Tower
@desc Sell Tower sound
@type file
@dir audio/se/
@default Coin
*/

/*~struct~QuickShopSettings:
@param backgroundType
@text Background Type
@type select
@option Default
@value 0
@option Dim
@value 1
@option Nothing
@value 2
@desc Background type for window
@default 0

@param width
@text Width
@desc Width
@type number
@default 250

@param height
@text Height
@desc Height
@type number
@default 250

@param itemHeight
@text Item Height
@desc Item Height
@type number
@default 60

@param itemTextSize
@text Item Text Size
@desc Item Text Size
@type number
@default 18
*/
