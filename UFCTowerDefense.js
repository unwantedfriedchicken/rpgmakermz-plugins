/*:
@target MZ

@plugindesc Add Tower Defense Mechanic
@author Unwanted Fried Chicken
@url https://unwantedfriedchicken.itch.io

@help
Author: UnwantedFriedChicken
Version: 1.1
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
@type number
@desc Background type for window item, 0 = default, 1 = dim, 2 = nothing
@default 0

@param gui_itemBackpackNumSize
@parent hudguiSettings
@text Item Ammount Size
@type number
@desc Size of the numsize item
@default 24

@param towerSettings
@text Tower Settings

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
@text Grid Color
@type text
@desc Set the color of grid. Default = #61FFB4
@default #61FFB4

@param gridColorOpacity
@parent towerSettings
@text Grid Color Opcaity
@type number
@desc Set the opacity of grid 
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
@desc Set place building only in this terrain tag, If empty building can be placed anywhere
@type number[]
@default []

@arg exceptTerrain
@text Can't place in this terrain
@desc Set place where building can't be set with this terrain tag.
@type number[]
@default []

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
*/

var Imported = Imported || {};
Imported.UFCTowerDefense = true;

var UFC = UFC || {};
UFC.UFCTD = UFC.UFCTD || {};
UFC.UFCTD.VERSION = 1.0;
UFC.UFCTD.ALIAS = UFC.UFCTD.ALIAS || {};

var $dataTDEnemy = $dataTDEnemy || {};
var $dataTDSpawnLocation = $dataTDSpawnLocation || {};
var $dataTDTrigger = $dataTDTrigger || {};

UFC.UFCTD.PARAMETERS = PluginManager.parameters("UFCTowerDefense");

UFC.UFCTD.CONFIG = {
  limitAnimation: +UFC.UFCTD.PARAMETERS["setting_limitAnimation"],
  healthVarId: +UFC.UFCTD.PARAMETERS["setting_towerHealthVarId"],
  healthMaxVarId: +UFC.UFCTD.PARAMETERS["setting_towerMaxHealthVarId"],
  gameOverSwitchId: +UFC.UFCTD.PARAMETERS["setting_gameoverSwitchId"],
  crystalName: UFC.UFCTD.PARAMETERS["setting_crystalName"],
};

UFC.UFCTD.HUDGUI = {
  SETTINGS: {
    itemSize: +UFC.UFCTD.PARAMETERS["gui_itemBackpackSlotSize"],
    itemCol: +UFC.UFCTD.PARAMETERS["gui_itemBackpackSlotCol"],
    itemWindowType: +UFC.UFCTD.PARAMETERS["gui_itemBackpackBackgroundType"],
    itemNumSize: +UFC.UFCTD.PARAMETERS["gui_itemBackpackNumSize"],
  },
  MESSAGE: {
    isHoverHUDItem: false,
  },
};

UFC.UFCTD.TOWERSETTINGS = {
  attackRangeOpacity: +UFC.UFCTD.PARAMETERS["attackRangeOpacity"],
  auraRangeOpacity: +UFC.UFCTD.PARAMETERS["auraRangeOpacity"],
  attackRangeColor: PIXI.utils.string2hex(
    UFC.UFCTD.PARAMETERS["attackRangeColor"]
  ),
  auraRangeColor: PIXI.utils.string2hex(UFC.UFCTD.PARAMETERS["auraRangeColor"]),
  gridColor: UFC.UFCTD.PARAMETERS["gridColor"],
  gridColorOpacity: +UFC.UFCTD.PARAMETERS["gridColorOpacity"] * 255,
};

UFC.UFCTD.DEBUGMODE = {
  enable: UFC.UFCTD.PARAMETERS["debugMode"] == "true",
  tickerSpeed: +UFC.UFCTD.PARAMETERS["tickerSpeed"],
  limitAnimation: +UFC.UFCTD.PARAMETERS["limitAnimation"],
};

PluginManager.registerCommand("UFCTowerDefense", "setupEnemy", function (args) {
  args.characterName = $gameMap._events[this._eventId]._characterName;
  args.characterIndex = $gameMap._events[this._eventId]._characterIndex;
  args["enemyType"] = args["enemyType"].toLowerCase();
  TowerDefenseManager.addDBEnemy(args);
});

PluginManager.registerCommand("UFCTowerDefense", "setSpawn", function (args) {
  if (!$dataTDSpawnLocation[this._mapId])
    $dataTDSpawnLocation[this._mapId] = {};

  args._x = $gameMap._events[this._eventId]._x;
  args._y = $gameMap._events[this._eventId]._y;
  $dataTDSpawnLocation[this._mapId][this._eventId] = new ufcTowerSpawnData(
    args
  );
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "showGUIItemSlot",
  function (args) {
    TowerDefenseManager.showGUIItemSlot(args);
  }
);

PluginManager.registerCommand("UFCTowerDefense", "showGold", function (args) {
  TowerDefenseManager.showHUDTDGold(args);
});

PluginManager.registerCommand("UFCTowerDefense", "updateHUD", function () {
  TowerDefenseManager.updateHUD();
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "showHealthBar",
  function (args) {
    TowerDefenseManager.showHUDTDHealth(args);
  }
);

PluginManager.registerCommand("UFCTowerDefense", "config", function (args) {
  TowerDefenseManager.config(args);
});

PluginManager.registerCommand("UFCTowerDefense", "startWave", function (args) {
  $gameMap.addTowerDefenseNewWave(args);
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "limitAnimation",
  function (args) {
    TowerDefenseManager.setLimitAnimation(+args["limit"]);
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerMove",
  function (args) {
    TowerDefenseManager.addDBTrigger(
      this._mapId,
      this._eventId,
      TowerDefenseManager.TRIGGERTYPE.DIRECTION,
      args["direction"]
    );
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerDestroy",
  function (args) {
    TowerDefenseManager.addDBTrigger(
      this._mapId,
      this._eventId,
      TowerDefenseManager.TRIGGERTYPE.DESTROY,
      {
        attack: args["attack"] == "true",
        attackEventId: args["attackEventId"],
        animationId: args["animationId"],
      }
    );
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerConfig",
  function (args) {
    TowerDefenseManager.addDBTrigger(
      this._mapId,
      this._eventId,
      TowerDefenseManager.TRIGGERTYPE.CONFIG,
      {
        enemyType: args["enemyType"].toLowerCase(),
        onlyEnemy: JSON.parse(args["onlyEnemy"]),
        exceptEnemy: JSON.parse(args["exceptEnemy"]),
      }
    );
  }
);

const Data_ufcGrid = function () {
  this.initialize(...arguments);
};

Data_ufcGrid.prototype.initialize = function () {
  this._event = new PIXI.utils.EventEmitter();
  this._gridData = [];
  this._eventData = [];
  this._bitmap = new Bitmap(
    $gameMap.width() * $gameMap.tileWidth(),
    $gameMap.height() * $gameMap.tileHeight()
  );
  this._lineSize = 4;
  this._gridColor = UFC.UFCTD.TOWERSETTINGS.gridColor;
  this._updateEventFreq = 60;
  this._updateEventTime = 0;
};

Data_ufcGrid.prototype.setVisible = function (visible) {
  this._event.emit("showGrid", visible);
};

Data_ufcGrid.prototype.getData = function () {
  return this._gridData;
};

Data_ufcGrid.prototype.calcGrid = function () {
  let bit = 0x0f;
  for (let x = 0; x < $gameMap.width(); x++) {
    for (let y = 0; y < $gameMap.height(); y++) {
      if (!this._gridData[x]) {
        this._gridData[x] = [];
      }

      this._gridData[x][y] = true;
      if (
        !$gameMap.checkPassage(x, y, bit) ||
        $gamePlayer.getGuideAction().checkTerrainTag(x, y)
      ) {
        this._gridData[x][y] = false;
        this.clearGrid(x, y);
      } else {
        this.fillGrid(x, y);
      }
    }
  }
  for (const event of $gameMap.events()) {
    if (!event.isThrough()) {
      this.clearGrid(event.x, event.y);
    }
    this._eventData.push({ event: event, pos: { x: event.x, y: event.y } });
  }

  this.updateEvents();
};

Data_ufcGrid.prototype.updateEvents = function () {
  this._updateEventTime--;
  if (this._updateEventTime > 0) return;

  this._updateEventTime = this._updateEventFreq;
  // Clear Event
  for (const event of this._eventData) {
    if (event.event._erased) {
      if (this._gridData[event.pos.x][event.pos.y])
        this.fillGrid(event.pos.x, event.pos.y);
      this._eventData.remove(event);
    }
    if (!event.event.pos(event.pos.x, event.pos.y)) {
      this.fillGrid(event.pos.x, event.pos.y);
      this.clearGrid(event.event.x, event.event.y);
      event.pos.x = event.event.x;
      event.pos.y = event.event.y;
    }
  }
};

Data_ufcGrid.prototype.getGrid = function () {
  return this._gridData;
};

Data_ufcGrid.prototype.posX = function (x) {
  return x * $gameMap.tileWidth();
};

Data_ufcGrid.prototype.posY = function (y) {
  return y * $gameMap.tileHeight();
};

Data_ufcGrid.prototype.fillGrid = function (x, y) {
  this._bitmap.fillRect(
    this.posX(x) + this._lineSize / 2,
    this.posY(y) + this._lineSize / 2,
    $gameMap.tileWidth() - this._lineSize,
    $gameMap.tileHeight() - this._lineSize,
    this._gridColor
  );
};

Data_ufcGrid.prototype.clearGrid = function (x, y) {
  this._bitmap.clearRect(
    this.posX(x),
    this.posY(y),
    $gameMap.tileWidth(),
    $gameMap.tileHeight()
  );
};

function Game_TDEnemy() {
  this.initialize(...arguments);
}

Game_TDEnemy.prototype = Object.create(Game_Character.prototype);
Game_TDEnemy.prototype.constructor = Game_TDEnemy;

Game_TDEnemy.prototype.initialize = function (enemyName, spawnId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._enemyData = Object.assign({}, $dataTDEnemy[enemyName]);
  this._spawn = $dataTDSpawnLocation[this._mapId][spawnId];
  this._direction = TowerDefenseManager.convertDirection(
    this._spawn._direction
  );
  this._effects = {};
  for (const effect in TowerDefenseManager.EFFECTS) {
    this._effects[TowerDefenseManager.EFFECTS[effect]] = {
      enable: false,
      effect: null,
    };
  }
  this._x = this._spawn._x;
  this._y = this._spawn._y;
  this._realX = this._spawn._x;
  this._realY = this._spawn._y;
  this._destroy = false;
  this.setDirection(this._direction);
  this._realMoveSpeed = +this._enemyData.moveSpeed;
  this._moveSpeed = this._realMoveSpeed;
  this._moveSpeedEffects = {};
  this._isStun = false;
  this._animationPlaying = false;
  this._through = this._enemyData.isThrough == "true";
  this._event = new PIXI.utils.EventEmitter();
};

Game_TDEnemy.prototype.isSameType = function (type) {
  if (
    type === TowerDefenseManager.ENEMYTYPE.ALL ||
    type === this._enemyData.enemyType ||
    this._enemyData.enemyType === TowerDefenseManager.ENEMYTYPE.ALL
  )
    return true;

  return false;
};

Game_TDEnemy.prototype.getEnemyData = function () {
  return this._enemyData;
};

Game_TDEnemy.prototype.isStarting = function () {
  return false;
};

Game_TDEnemy.prototype.isTriggerIn = function () {
  return false;
};

Game_TDEnemy.prototype.refresh = function () {
  return false;
};

Game_TDEnemy.prototype.checkTriggerConfig = function (config) {
  if (!config) return true;

  if (
    config.exceptEnemy.includes(this._enemyData.id) &&
    config.exceptEnemy.length > 0
  ) {
    return false;
  }

  if (
    !config.onlyEnemy.includes(this._enemyData.id) &&
    config.onlyEnemy.length > 0
  ) {
    return false;
  }

  if (
    config.enemyType === TowerDefenseManager.ENEMYTYPE.ALL ||
    config.enemyType === this._enemyData.enemyType ||
    this._enemyData.enemyType === TowerDefenseManager.ENEMYTYPE.ALL
  ) {
    return true;
  }

  return false;
};

Game_TDEnemy.prototype.update = function () {
  Game_Character.prototype.update.call(this);

  this.updateEffects();
  if (!this.isMoving()) {
    let getTrigger = TowerDefenseManager.getTrigger(
      this._mapId,
      this._x,
      this._y
    );
    if (getTrigger) {
      if (this.checkTriggerConfig(getTrigger.config)) {
        for (let trigger in getTrigger) {
          switch (trigger) {
            case TowerDefenseManager.TRIGGERTYPE.DIRECTION:
              this.setDirection(
                TowerDefenseManager.convertDirection(getTrigger[trigger])
              );
              break;
            case TowerDefenseManager.TRIGGERTYPE.DESTROY:
              this.triggerDestroy(getTrigger[trigger]);
              return;
          }
        }
      }
    }
    this.moveStraight(this._direction);
  }
};

Game_TDEnemy.prototype.updateEffects = function () {
  for (const effect in this._effects) {
    if (!this._effects[effect].effect) continue;

    if (!this._effects[effect].enable) {
      if (!this._effects[effect].effect.getChanceEffect()) {
        this._effects[effect].enable = false;
        this._effects[effect].effect = null;
        continue;
      }
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this.addMoveSpeedEffect(
            effect,
            -this._realMoveSpeed *
              (this._effects[effect].effect.getEffect() / 100),
            true
          );
          break;
        case TowerDefenseManager.EFFECTS.POISON:
          this._effects[effect].effect.setEPSCallback(() =>
            this.attacked({ damage: this._effects[effect].effect.getEffect() })
          );
          break;
        case TowerDefenseManager.EFFECTS.STUN:
          this._isStun = true;
          break;
        case TowerDefenseManager.EFFECTS.RAGE:
          this.addMoveSpeedEffect(
            effect,
            this._realMoveSpeed *
              (this._effects[effect].effect.getEffect() / 100),
            false
          );
          break;
      }
      this._event.emit("addEffect", effect);
      this._effects[effect].enable = true;
    }
    this._effects[effect].effect.update();
    if (this._effects[effect].effect.isDone()) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
        case TowerDefenseManager.EFFECTS.RAGE:
          this.removeMoveSpeedEffect(effect);
          break;
        case TowerDefenseManager.EFFECTS.STUN:
          this._isStun = false;
          break;
      }
      this._effects[effect].enable = false;
      this._effects[effect].effect = null;
      this._event.emit("removeEffect", effect);
    }
  }
};

Game_TDEnemy.prototype.updateMoveSpeed = function () {
  let newSpeed = this._realMoveSpeed;
  for (let speedEffect in this._moveSpeedEffects) {
    newSpeed += this._moveSpeedEffects[speedEffect];
  }
  this._moveSpeed = newSpeed;
};

Game_TDEnemy.prototype.removeMoveSpeedEffect = function (effect) {
  delete this._moveSpeedEffects[effect];
  this.updateMoveSpeed();
};

Game_TDEnemy.prototype.addMoveSpeedEffect = function (effect, value, isSlow) {
  if (!this._moveSpeedEffects[effect]) {
    this._moveSpeedEffects[effect] = value;
  } else if (
    (this._moveSpeedEffects[effect] < value && isSlow) ||
    (this._moveSpeedEffects[effect] > value && !isSlow)
  ) {
    this._moveSpeedEffects[effect] = value;
  } else {
    return;
  }
  this.updateMoveSpeed();
};

Game_TDEnemy.prototype.distancePerFrame = function () {
  if (this._isStun) return 0;
  else return Game_Character.prototype.distancePerFrame.call(this);
};

Game_TDEnemy.prototype.triggerDestroy = function (destroyData) {
  if (destroyData.attack) {
    this.attack(destroyData.attackEventId);
  }
  if (+destroyData.animationId != 0) {
    TowerDefenseManager.requestAnimation([this], +destroyData.animationId);
  }

  this.destroy();
};

Game_TDEnemy.prototype.attack = function (eventid) {
  TowerDefenseManager.requestAnimation(
    [$gameMap._events[eventid]],
    +this._enemyData.attackAnimation
  );
  TowerDefenseManager.attackTower(+this._enemyData.attackDamage);
};

Game_TDEnemy.prototype.attacked = function (damage) {
  this._enemyData.health -= damage.damage;
  if (this._enemyData.health <= 0 && !this._destroy) {
    if (this._enemyData.seDead)
      AudioManager.playSe({
        name: this._enemyData.seDead,
        volume: this._enemyData.seDeadVolume,
        pitch: 100,
        pan: 0,
      });
    this.destroy();
    return;
  }

  // Effects
  if (damage.effects && damage.effects.length > 0) {
    let _ef = damage.effects;
    for (const effect in _ef) {
      this._effects[_ef[effect].name].effect = new ufcTowerEffects(_ef[effect]);
    }
  }
};

Object.defineProperty(Game_TDEnemy.prototype, "health", {
  get: function () {
    return this._enemyData.health;
  },
});

Game_TDEnemy.prototype.isMoving = function () {
  return this._realX !== this._x || this._realY !== this._y;
};

Game_TDEnemy.prototype.destroy = function () {
  $gameMap.ufcDestroyEnemy(this);
  this._destroy = true;
  $gameParty.gainGold(+this._enemyData.gold);
  TowerDefenseManager.updateHUDGold();
};

Game_TDEnemy.prototype.isDestroyed = function () {
  return this._destroy;
};

function Game_TowerDefense() {
  this.initialize(...arguments);
}

Game_TowerDefense.prototype = Object.create(Game_Character.prototype);
Game_TowerDefense.prototype.constructor = Game_TowerDefense;

Game_TowerDefense.prototype.initialize = function (towerData, mapId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = mapId;
  this._towerData = towerData;
  this._attackTime = 0;
  this._x = this._towerData._x;
  this._y = this._towerData._y;
  this._realX = this._towerData._x;
  this._realY = this._towerData._y;
  this._target = null;
  this._destroy = false;
  this._towerEffectedByAura = [];
  this.getTowerData().checkGetBuffs();
  if (this._towerData.isHaveAura()) {
    this.addAuraEffects();
  }
};

Game_TowerDefense.prototype.addAuraEffects = function () {
  let towers = $gameMap._events.filter(
    (event) =>
      event instanceof Game_TowerDefense &&
      event !== this &&
      PIXI.utils.isInRange(
        event._x,
        event._y,
        this._x,
        this._y,
        this._towerData.getRange()
      )
  );
  for (const tower of towers) {
    tower.getTowerData().setBuffs(this._towerData.getAuras());
    this.addTowerEffectedByAura(tower.getTowerData());
  }
};

Game_TowerDefense.prototype.addTowerEffectedByAura = function (tower) {
  this._towerEffectedByAura.push(tower);
};

Game_TowerDefense.prototype.getTowerData = function () {
  return this._towerData;
};

Game_TowerDefense.prototype.isStarting = function () {
  return false;
};

Game_TowerDefense.prototype.isTriggerIn = function () {
  return false;
};

Game_TowerDefense.prototype.refresh = function () {
  return false;
};

Game_TowerDefense.prototype.update = function () {
  this._attackTime--;
  if (
    !this._target &&
    $gameMap.ufcEnemies().length > 0 &&
    this._towerData.getBaseAttack > 0
  ) {
    // Search target
    for (const enemy of $gameMap.ufcEnemies()) {
      if (
        PIXI.utils.isInRange(
          enemy._x,
          enemy._y,
          this._x,
          this._y,
          this._towerData.getRange()
        ) &&
        !enemy.isDestroyed() &&
        enemy.isSameType(this._towerData._attackType)
      ) {
        this._target = enemy;
        break;
      }
    }
  } else if (this._target) {
    if (
      !PIXI.utils.isInRange(
        this._target.x,
        this._target.y,
        this._x,
        this._y,
        this._towerData.getRange()
      ) ||
      this._target.isDestroyed()
    ) {
      // clear target
      this._target = null;
    } else {
      // shoot projectile
      if (this._attackTime <= 0) {
        this._attackTime = this._towerData.getAttackSpeed();
        this.attack(this._target);
      }
    }
  }
};

Game_TowerDefense.prototype.attack = function (enemy) {
  let projectileId = $gameMap.ufcProjectiles();
  // Update bullet
  $gameMap.ufcAddProjectile(
    new Game_ufcProjectile(
      this._x,
      this._y,
      enemy,
      this._towerData.getBulletData(),
      projectileId
    )
  );
};

Game_TowerDefense.prototype.destroy = function () {
  AudioManager.playSe({
    name: "Door2",
    volume: 25,
    pitch: 100,
    pan: 0,
  });
  $gameMap.ufcDestroyTower(this);

  for (let tower of this._towerEffectedByAura) {
    tower.resetBuffs();
    tower.checkGetBuffs();
  }
  this._towerEffectedByAura = [];
  this._destroy = true;
};

Game_TowerDefense.prototype.isDestroyed = function () {
  return this._destroy;
};

Game_TowerDefense.prototype.actionTower = function () {
  $gameMessage.setWindowTower(true);
  TowerDefenseManager.actionTower(this._towerData, () => {
    this.destroy(); // Callback for move and upgrade
  });
  return;
};

function Game_ufcProjectile() {
  this.initialize(...arguments);
}

Game_ufcProjectile.prototype = Object.create(Game_Character.prototype);
Game_ufcProjectile.prototype.constructor = Game_ufcProjectile;

Game_ufcProjectile.prototype.initialize = function (
  spawnLocationX,
  spawnLocationY,
  target,
  bulletData
) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._target = target;
  this._x = spawnLocationX;
  this._y = spawnLocationY;
  this.damage = bulletData.damage;
  this.speed = bulletData.speed;
  this.animationId = bulletData.animationId;
  this.characterName = bulletData.characterName;
  this.characterIndex = bulletData.characterIndex;
  this.characterIndexY = bulletData.characterIndexY;
  this.canvasX = this.screenX(this._x);
  this.canvasY = this.screenY(this._y);
  this.vX = 0;
  this.vY = 0;
  this._destroy = false;
  this.rotation = 180;
  this._distCollide = 38;
  this.setDirection(2);
};

Game_ufcProjectile.prototype.screenX = function (x = this._x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Game_ufcProjectile.prototype.screenY = function (y = this._y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Game_ufcProjectile.prototype.update = function () {
  Game_Character.prototype.update.call(this);
  let targetY = this.screenY(this._target._realY);
  let targetX = this.screenX(this._target._realX);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  this.rotation = Math.atan2(targetY - this.canvasY, targetX - this.canvasX);
  this.vX += Math.cos(this.rotation) * (this.speed / 60);
  this.vY += Math.sin(this.rotation) * (this.speed / 60);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  if (
    PIXI.utils.dist(this.canvasX, this.canvasY, targetX, targetY) <=
      this._distCollide ||
    this._target.isDestroyed()
  ) {
    this.destroy();
  }
};

Game_ufcProjectile.prototype.destroy = function () {
  TowerDefenseManager.requestAnimation([this._target], this.animationId);
  $gameMap.ufcDestroyProjectile(this);
  this._target.attacked(this.damage);
  this._destroy = true;
};

Game_ufcProjectile.prototype.isMoving = function () {
  return true;
};

const Sprite_ufcGrid = function () {
  this.initialize(...arguments);
};

Sprite_ufcGrid.prototype = Object.create(Sprite.prototype);
Sprite_ufcGrid.prototype.constructor = Sprite_ufcGrid;

Sprite_ufcGrid.prototype.initialize = function (data) {
  Sprite.prototype.initialize.call(this, data._bitmap);
  this._data = data;
  this.opacity = UFC.UFCTD.TOWERSETTINGS.gridColorOpacity;
  this.z = 20;
  this._data._event.on("showGrid", this.setVisible, this);
  this.setVisible(false);
};

Sprite_ufcGrid.prototype.setVisible = function (visible) {
  this.visible = visible;
};

Sprite_ufcGrid.prototype.update = function () {
  Sprite.prototype.update.call(this);

  this.x = this.screenX(-0.5);
  this.y = this.screenY(-0.5);

  this._data.updateEvents();
};

Sprite_ufcGrid.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Sprite_ufcGrid.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Sprite_ufcGrid.prototype.destroy = function (options) {
  this._data._event.removeListener("showGrid", this.setVisible, this);
  Sprite.prototype.destroy.call(this, options);
};

const Sprite_ufcProjectile = function () {
  this.initialize(...arguments);
};

Sprite_ufcProjectile.prototype = Object.create(Sprite.prototype);
Sprite_ufcProjectile.prototype.constructor = Sprite_ufcProjectile;

Sprite_ufcProjectile.prototype.initialize = function (projectileData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(projectileData);
};

Sprite_ufcProjectile.prototype.initMembers = function (projectileData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._projectileData = projectileData;
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this.setCharacterBitmap();
};

Sprite_ufcProjectile.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcProjectile.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcProjectile.prototype.checkCharacter = function (character) {
  return character == this._projectileData;
};

Sprite_ufcProjectile.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  this.updatePosition();

  if (this._projectileData.isDestroyed() || !this._projectileData) {
    this.destroy();
  }
};

Sprite_ufcProjectile.prototype.setCharacterBitmap = function () {
  if (this._projectileData.characterName == "?") {
    this.bitmap = ImageManager.loadCharacter("");
  } else {
    this.bitmap = ImageManager.loadCharacter(
      this._projectileData.characterName
    );
  }
  this.updateCharacterFrame();
};

Sprite_ufcProjectile.prototype.updatePosition = function () {
  this.x = this._projectileData.canvasX;
  this.y = this._projectileData.canvasY;
  this.rotation = this._projectileData.rotation + PIXI.DEG_TO_RAD * -90;
};

Sprite_ufcProjectile.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcProjectile.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcProjectile.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcProjectile.prototype.characterBlockX = function () {
  const index = this._projectileData.characterIndex;
  return (index % 4) * 3;
};

Sprite_ufcProjectile.prototype.characterBlockY = function () {
  return this._projectileData.characterIndexY;
};

Sprite_ufcProjectile.prototype.characterPatternX = function () {
  return this._projectileData.pattern();
};

Sprite_ufcProjectile.prototype.characterPatternY = function () {
  return (this._projectileData.direction() - 2) / 2;
};

Sprite_ufcProjectile.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

const Sprite_ufcTDEnemy = function () {
  this.initialize(...arguments);
};

Sprite_ufcTDEnemy.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemy.prototype.constructor = Sprite_ufcTDEnemy;

Sprite_ufcTDEnemy.prototype.initialize = function (enemyData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(enemyData);
};

Sprite_ufcTDEnemy.prototype.initMembers = function (enemyData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._enemy = enemyData;
  this._enemyData = this._enemy.getEnemyData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._destroy = false;
  this.scale.x = this._enemyData.scale;
  this.scale.y = this._enemyData.scale;
  this._enemy._event.on("addEffect", this.addEffect, this);
  this._enemy._event.on("removeEffect", this.removeEffect, this);
  this.setCharacterBitmap();
};

Sprite_ufcTDEnemy.prototype.destroy = function () {
  this._enemy._event.removeListener("addEffect", this.addEffect, this);
  this._enemy._event.removeListener("removeEffect", this.removeEffect, this);
  Sprite.prototype.destroy.call(this);
};

Sprite_ufcTDEnemy.prototype.addEffect = function (effect) {
  let _effect = 0;
  switch (effect) {
    case TowerDefenseManager.EFFECTS.COLD:
      _effect = 10;
      break;
    case TowerDefenseManager.EFFECTS.POISON:
      _effect = 1;
      break;
    case TowerDefenseManager.EFFECTS.STUN:
      _effect = 5;
      break;
    case TowerDefenseManager.EFFECTS.RAGE:
      _effect = 4;
      break;
  }
  this.addChild(new Sprite_ufcTDEnemyEffect(effect, _effect, 0, 25));
};

Sprite_ufcTDEnemy.prototype.removeEffect = function (effect) {
  for (const child of this.children) {
    if (child._name == effect) {
      child.destroy();
      break;
    }
  }
};

Sprite_ufcTDEnemy.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDEnemy.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDEnemy.prototype.checkCharacter = function (character) {
  return character == this._enemy;
};

Sprite_ufcTDEnemy.prototype.update = function () {
  if (this._destroy) {
    // Waiting for animation to get destroyed check towerdefense Spriteset_Map.prototype.removeAnimation
    return;
  }
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  this.updatePosition();
  if (this._enemy.isDestroyed()) {
    this.hide();
  }

  if (!this._enemy.isAnimationPlaying() && this._enemy.isDestroyed()) {
    this.destroyEnemy();
  }
};

Sprite_ufcTDEnemy.prototype.destroyEnemy = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this._destroy = true;
  // since use request animation, this sprite can't be destroyed immediately
  // so try delete it from targes animation first
  SceneManager.getSpriteSetMap().removeTargetFromAnimation(this);

  this.destroy();
};

Sprite_ufcTDEnemy.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._enemyData.characterName);
  this._isBigCharacter = false;
  this.updateCharacterFrame();
};

Sprite_ufcTDEnemy.prototype.updatePosition = function () {
  this.x = this._enemy.screenX();
  this.y = this._enemy.screenY();
  this.z = this._enemy.screenZ();
};

Sprite_ufcTDEnemy.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDEnemy.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDEnemy.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDEnemy.prototype.characterPatternX = function () {
  return this._enemy.pattern();
};

Sprite_ufcTDEnemy.prototype.characterPatternY = function () {
  return (this._enemy.direction() - 2) / 2;
};

Sprite_ufcTDEnemy.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

function Sprite_ufcTDEnemyEffect() {
  this.initialize(...arguments);
}

Sprite_ufcTDEnemyEffect.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemyEffect.prototype.constructor = Sprite_ufcTDEnemyEffect;

Sprite_ufcTDEnemyEffect.prototype.initialize = function (
  name,
  stateIndex,
  x,
  y
) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(name, stateIndex, x, y);
  this.loadBitmap();
};

Sprite_ufcTDEnemyEffect.prototype.initMembers = function (
  name,
  stateIndex,
  x = 0,
  y = 0
) {
  this._name = name;
  this._overlayIndex = stateIndex;
  this._animationCount = 0;
  this._pattern = 0;
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this.x = x;
  this.y = y;
};

Sprite_ufcTDEnemyEffect.prototype.loadBitmap = function () {
  this.bitmap = ImageManager.loadSystem("States");
  this.setFrame(0, 0, 0, 0);
};

Sprite_ufcTDEnemyEffect.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this._animationCount++;
  if (this._animationCount >= this.animationWait()) {
    this.updatePattern();
    this.updateFrame();
    this._animationCount = 0;
  }
};

Sprite_ufcTDEnemyEffect.prototype.animationWait = function () {
  return 8;
};

Sprite_ufcTDEnemyEffect.prototype.updatePattern = function () {
  this._pattern++;
  this._pattern %= 8;
};

Sprite_ufcTDEnemyEffect.prototype.updateFrame = function () {
  if (this._overlayIndex > 0) {
    const w = 96;
    const h = 96;
    const sx = this._pattern * w;
    const sy = (this._overlayIndex - 1) * h;
    this.setFrame(sx, sy, w, h);
  } else {
    this.setFrame(0, 0, 0, 0);
  }
};

const Sprite_ufcTDTower = function () {
  this.initialize(...arguments);
};

Sprite_ufcTDTower.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDTower.prototype.constructor = Sprite_ufcTDTower;

Sprite_ufcTDTower.prototype.initialize = function (ufcTD) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(ufcTD);
};

Sprite_ufcTDTower.prototype.initMembers = function (ufcTD) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._tower = ufcTD;
  this._towerData = ufcTD.getTowerData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._range = this._tower.getTowerData().getRange();
  this.resetRangeGraphics();
  this.setCharacterBitmap();
  if (this._towerData._placeMode) this.setSelectPosition();

  this._towerData._event.on(
    "setRangeVisibility",
    this.setRangeVisibility,
    this
  );
};

Sprite_ufcTDTower.prototype.resetRangeGraphics = function () {
  let _rangeGraphics = new PIXI.Graphics();
  let _realRange = this._range * 2 + 1;
  if (this._towerData.isHaveAura())
    _rangeGraphics.beginFill(
      UFC.UFCTD.TOWERSETTINGS.auraRangeColor,
      UFC.UFCTD.TOWERSETTINGS.auraRangeOpacity
    );
  else
    _rangeGraphics.beginFill(
      UFC.UFCTD.TOWERSETTINGS.attackRangeColor,
      UFC.UFCTD.TOWERSETTINGS.attackRangeOpacity
    );
  // _rangeGraphics.drawRect(
  //   0,
  //   0,
  //   _realRange * $gameMap.tileWidth(),
  //   _realRange * $gameMap.tileHeight()
  // );
  // _rangeGraphics.endFill();

  let lineSize = 6;
  for (let x = 0; x < _realRange; x++) {
    for (let y = 0; y < _realRange; y++) {
      _rangeGraphics.drawRect(
        this.posX(x) + lineSize / 2,
        this.posY(y) + lineSize / 2,
        $gameMap.tileWidth() - lineSize,
        $gameMap.tileHeight() - lineSize
      );
    }
  }
  _rangeGraphics.endFill();

  let rangeSprite = Graphics.app.renderer.generateTexture(_rangeGraphics);
  if (!this._rangeGraphics) {
    this._rangeGraphics = new PIXI.Sprite(rangeSprite);
    this._rangeGraphics.anchor.x = 0.5;
    this._rangeGraphics.anchor.y = 0.5;
    this._rangeGraphics.x = 0;
    this._rangeGraphics.y = -$gameMap.tileHeight() / 2;
    this.addChild(this._rangeGraphics);
  } else {
    this._rangeGraphics.texture = rangeSprite;
  }
  _rangeGraphics.destroy();
  this._rangeGraphics.visible = false;
};

Sprite_ufcTDTower.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDTower.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDTower.prototype.checkCharacter = function (character) {
  return character == this._tower;
};

Sprite_ufcTDTower.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  if (this._towerData._placeMode) return;
  this.updatePosition();
  if (this._tower.isDestroyed()) this.destroySprite();
};

Sprite_ufcTDTower.prototype.destroySprite = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this.destroy();
};

Sprite_ufcTDTower.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._towerData._character);
  this._isBigCharacter = ImageManager.isBigCharacter(
    this._towerData._character
  );
  this.updateCharacterFrame();
};

Sprite_ufcTDTower.prototype.updatePosition = function () {
  this.x = this._tower.screenX();
  this.y = this._tower.screenY();
  this.z = this._tower.screenZ();
};

Sprite_ufcTDTower.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + 1) * pw;
  const sy = (this.characterBlockY() + 0) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDTower.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDTower.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDTower.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDTower.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDTower.prototype.setRangeVisibility = function (visible) {
  let _range = this._tower.getTowerData().getRange();
  if (visible && this._range != _range) {
    this._range = _range;
    this.resetRangeGraphics();
  }
  this._rangeGraphics.visible = visible;
};

Sprite_ufcTDTower.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

Sprite_ufcTDTower.prototype.posX = function (x) {
  return x * $gameMap.tileWidth();
};

Sprite_ufcTDTower.prototype.posY = function (y) {
  return y * $gameMap.tileHeight();
};

Sprite_ufcTDTower.prototype.destroy = function (options) {
  this._towerData._event.removeListener(
    "setRangeVisibility",
    this.setRangeVisibility,
    this
  );
  Sprite.prototype.destroy.call(this, options);
};

PIXI.utils.dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

PIXI.utils.randomArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// x1 y1 is the object that want to be compared with x2 y2 + range
PIXI.utils.isInRange = function (x1, y1, x2, y2, range) {
  return (
    x1 <= x2 + range && x1 >= x2 - range && y1 <= y2 + range && y1 >= y2 - range
  );
};

PIXI.utils.lerp = function (v0, v1, t) {
  return (1 - t) * v0 + t * v1;
};

SceneManager.getScene = function () {
  return this._scene;
};

SceneManager.getSpriteSetMap = function () {
  return this.getScene()._spriteset;
};

UFC.UFCTD.ALIAS._Datamanager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
  UFC.UFCTD.ALIAS._Datamanager_createGameObjects.call(this);
  TowerDefenseManager.initialize();
};

// Add Status Tower For shop -----------------------------------------
UFC.UFCTD.ALIAS._Window_ShopStatus_refresh =
  Window_ShopStatus.prototype.refresh;
Window_ShopStatus.prototype.refresh = function () {
  UFC.UFCTD.ALIAS._Window_ShopStatus_refresh.call(this);

  if (this._item) {
    if (this.isTowerItem) {
      this.drawTowerInfo(0, 60, "center");
    }
  }
};

Window_ShopStatus.prototype.drawTowerInfo = function (x, y, align) {
  let towerData = this._item.ufcTower;
  let characterImage = ImageManager.loadCharacter(towerData.character);
  let characterIndex = towerData.characterindex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.5;
  if (align == "center") {
    x += this.width / 2;
    x -= (pw * scale) / 2;
    x -= this.itemPadding();
  }
  this.contents.blt(
    characterImage,
    sx,
    sy,
    pw,
    ph,
    x,
    y,
    pw * scale,
    ph * scale
  );

  let textY = y + 100;
  let textX = 10;
  let textHeight = 30;
  let textValueX = 180;
  let fontSize = 20;
  let status = ["Attack", "Range", "Attack Speed", "Bullet Speed"];
  let statusValue = [
    towerData.attack,
    towerData.range,
    towerData.attackspeed,
    towerData.bulletspeed,
  ];
  this.contents.fontSize = fontSize;
  for (let i = 0; i < status.length; i++) {
    this.resetTextColor();
    this.drawText(status[i], textX, textY + i * textHeight, 150);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(
      statusValue[i],
      textX + textValueX,
      textY + i * textHeight,
      150
    );
  }
  this.resetTextColor();
  this.drawText("Effect", textX, textY + status.length * textHeight, 150);

  let note = `\\FS[${fontSize - 3}]\n`;
  if (!towerData.note) note += "\\C[16]None";

  this.drawTextEx(
    note + towerData.note,
    textX,
    textY + status.length * textHeight - 5,
    200
  );
  this.resetFontSettings();
};

Window_ShopStatus.prototype.isTowerItem = function () {
  return !!this._item.ufcTower;
};

// ------------------------------------------------------------------

Game_Character.prototype.moveAwayFromHere = function () {
  const d = [4, 2, 6, 8];
  for (let i = 0; i < d.length; i++) {
    if (this.canPass(this.x, this.y, d[i])) {
      this.moveStraight(d[i]);
      return true;
    }
  }
  return false;
};

UFC.UFCTD.ALIAS._Game_Player_triggerButtonAction =
  Game_Player.prototype.triggerButtonAction;
Game_Player.prototype.triggerButtonAction = function () {
  if (
    Input.isTriggered("ok") &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    !this.getGuideAction().isBlocked()
  ) {
    // Doublecheck incase using mouse
    this.getGuideAction().updateBlocked(true);
    if (!this.getGuideAction().isBlocked()) TowerDefenseManager.placeTower();
    return true;
  }

  if (Input.isTriggered("ok") && this.checkEventTower()) {
    return true;
  }

  return UFC.UFCTD.ALIAS._Game_Player_triggerButtonAction.apply(
    this,
    arguments
  );
};

UFC.UFCTD.ALIAS._Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function () {
  if (
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    this.getInputDirection() > 0 &&
    this.getGuideAction().isMouseMode
  ) {
    this.getGuideAction().setMouseMode(false);
  }
  UFC.UFCTD.ALIAS._Game_Player_moveByInput.call(this);
};

UFC.UFCTD.ALIAS._Game_Player_executeMove = Game_Player.prototype.executeMove;
Game_Player.prototype.executeMove = function () {
  if (
    $gameTemp.isDestinationValid() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD
  ) {
    const destX = $gameTemp.destinationX();
    const destY = $gameTemp.destinationY();
    let dist = $gameMap.distance(this.x, this.y, destX, destY);
    if (dist <= 1) {
      this.turnTowardCharacter({ x: destX, y: destY });
      this.getGuideAction().updateBlocked();
      if (!this.getGuideAction().isBlocked()) {
        // Double check incase the map is scrolled
        this.getGuideAction().updateBlocked(true);
        if (!this.getGuideAction().isBlocked())
          TowerDefenseManager.placeTower();
        $gameTemp.clearDestination();
      }
      this.getGuideAction().clearTrigger();
      return;
    }
  }
  UFC.UFCTD.ALIAS._Game_Player_executeMove.call(this, ...arguments);
};

UFC.UFCTD.ALIAS._Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function () {
  UFC.UFCTD.ALIAS._Game_Player_update.call(this, ...arguments);

  if (
    TouchInput.isTriggered() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD
  ) {
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);
    if (this.pos(x, y)) {
      let t = this.moveAwayFromHere();
      if (t) $gameTemp.setDestination(x, y);
    }
  }
};

// Touch input, check event there (check function Game_Player.prototype.triggerTouchAction)
UFC.UFCTD.ALIAS._Game_Player_triggerTouchActionD2 =
  Game_Player.prototype.triggerTouchActionD2;
Game_Player.prototype.triggerTouchActionD2 = function (x2, y2) {
  if (this.checkEventTower(x2, y2)) return true;

  return UFC.UFCTD.ALIAS._Game_Player_triggerTouchActionD2.call(
    this,
    ...arguments
  );
};

Game_Player.prototype.checkEventTower = function (x, y) {
  if (TowerDefenseManager.getState != TowerDefenseManager.STATE.IDLE) return;
  let x2 = x;
  let y2 = y;
  if (!x2 || !y2) {
    if ($gameMap.isEventRunning()) return false;
    x2 = $gameMap.roundXWithDirection(this._x, this._direction);
    y2 = $gameMap.roundYWithDirection(this._y, this._direction);
  }
  const events = $gameMap.eventsXyNt(x2, y2);
  const tower = events.filter((event) => event instanceof Game_TowerDefense);
  if (tower.length <= 0) return false;
  else {
    tower[0].actionTower();
    return true;
  }
};

// still not sure if I should cache here instead using event
// const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
// Scene_Boot.prototype.loadSystemImages = function () {
//   _Scene_Boot_loadSystemImages.call(this);
//   ImageManager.loadSystem("TDSheets");
// };

UFC.UFCTD.ALIAS._Scene_Map_onMapTouch = Scene_Map.prototype.onMapTouch;
Scene_Map.prototype.onMapTouch = function () {
  if (UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem) return;
  return UFC.UFCTD.ALIAS._Scene_Map_onMapTouch.call(this);
};

UFC.UFCTD.ALIAS._Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function () {
  UFC.UFCTD.ALIAS._Scene_Map_updateCallMenu.call(this);
  if (
    !this.isMenuEnabled() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    this.isMenuCalled()
  ) {
    TowerDefenseManager.cancelSelect();
  }
};

UFC.UFCTD.ALIAS._Scene_Map_createAllWindows =
  Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  UFC.UFCTD.ALIAS._Scene_Map_createAllWindows.call(this);
  this.createHUDTD();
};

// ----------------------------------- HUD --------------------------------
Scene_Map.prototype.createHUDTD = function () {
  UFC.UFCTD.HUDGUI.ITEMSLOT = new Window_GUIItemSlot();
  this.addWindow(UFC.UFCTD.HUDGUI.ITEMSLOT);
  let action = {
    width: 300,
    height: 240,
  };
  UFC.UFCTD.HUDGUI.ITEMSLOT.visible = TowerDefenseManager.getGUIItemSlot;
  UFC.UFCTD.HUDGUI.TOWERACTION = new Window_TDAction(
    new Rectangle(
      360,
      Graphics.boxHeight - action.height,
      action.width,
      action.height
    )
  );
  this.addWindow(UFC.UFCTD.HUDGUI.TOWERACTION);

  UFC.UFCTD.HUDGUI.GOLDWINDOW = new Window_TDGold(
    new Rectangle(0, 0, 200, this.calcWindowHeight(1, true))
  );
  this.addWindow(UFC.UFCTD.HUDGUI.GOLDWINDOW);
  UFC.UFCTD.HUDGUI.GOLDWINDOW.visible = TowerDefenseManager.getHUDGold;

  let windowWidth = 200;
  UFC.UFCTD.HUDGUI.HEALTHWINDOW = new Window_TDHealth(
    new Rectangle(Graphics.boxWidth / 2 - windowWidth / 2, -10, windowWidth, 80)
  );
  this.addWindow(UFC.UFCTD.HUDGUI.HEALTHWINDOW);
  UFC.UFCTD.HUDGUI.HEALTHWINDOW.visible = TowerDefenseManager.getHUDHealth;
};

// ----------------------------------- End HUD -------------------------

// Change Gold
UFC.UFCTD.ALIAS._Game_Interpreter_command125 =
  Game_Interpreter.prototype.command125;
Game_Interpreter.prototype.command125 = function () {
  UFC.UFCTD.ALIAS._Game_Interpreter_command125.apply(this, arguments);
  TowerDefenseManager.updateHUDGold();
  return true;
};

// variable to make message busy
UFC.UFCTD.ALIAS._Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  UFC.UFCTD.ALIAS._Game_Message_clear.call(this);
  this._windowTowerActionShow = false;
};

UFC.UFCTD.ALIAS._Game_Message_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
  return (
    this._windowTowerActionShow ||
    UFC.UFCTD.ALIAS._Game_Message_isBusy.call(this)
  );
};

Game_Message.prototype.setWindowTower = function (showTower) {
  this._windowTowerActionShow = showTower;
};

UFC.UFCTD.ALIAS._Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function () {
  UFC.UFCTD.ALIAS._Game_Map_initialize.apply(this, arguments);
  this._towerDefenseList = [];
  this._towerDefenseWave = [];
  this._towerDefenseEnemy = [];
  this._towerDefenseProjectile = [];
  this._towerDefenseGrid = null;
};

UFC.UFCTD.ALIAS._Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
  UFC.UFCTD.ALIAS._Game_Map_setup.call(this, mapId);
  this._towerDefenseGrid = new Data_ufcGrid();
};

Game_Map.prototype.ufcGetGrid = function () {
  return this._towerDefenseGrid;
};

Game_Map.prototype.ufcCalcGrid = function () {
  this.ufcGetGrid().calcGrid();
};

Game_Map.prototype.ufcGetTowerDefenseList = function () {
  return this._towerDefenseList;
};

// _characterSprites is used by rpgmaker engine to play animation
// if sprite need animation they need to push it to _characterSprites array
Game_Map.prototype.ufcAddCharacterSprites = function (characterSprite) {
  const _spriteSet = SceneManager.getSpriteSetMap();
  let newSpritesetIndex = _spriteSet._characterSprites.push(characterSprite);
  _spriteSet._tilemap.addChild(
    _spriteSet._characterSprites[newSpritesetIndex - 1]
  );
};

Game_Map.prototype.getCharacterSprites = function () {
  return SceneManager.getSpriteSetMap()._characterSprites;
};

Game_Map.prototype.ufcAddProjectile = function (projectileData) {
  // since projectile dont need animation, don't include to _charactersprites
  const _spriteSet = SceneManager.getSpriteSetMap();
  let newTowerIndex = this._towerDefenseProjectile.push(projectileData);
  _spriteSet._tilemap.addChild(
    new Sprite_ufcProjectile(this._towerDefenseProjectile[newTowerIndex - 1])
  );
};

Game_Map.prototype.ufcAddTower = function (towerData) {
  let newTowerIndex = this._events.push(
    new Game_TowerDefense(towerData, this._mapId)
  );
  this.ufcAddCharacterSprites(
    new Sprite_ufcTDTower(this._events[newTowerIndex - 1])
  );
};

Game_Map.prototype.ufcSpawnEnemy = function (enemyName, spawnId) {
  let newEnemy = this._towerDefenseEnemy.push(
    new Game_TDEnemy(enemyName, spawnId)
  );
  this.ufcAddCharacterSprites(
    new Sprite_ufcTDEnemy(this._towerDefenseEnemy[newEnemy - 1])
  );
};

Game_Map.prototype.ufcDestroyCharacterSprite = function (character) {
  return this.getCharacterSprites().remove(character);
};

Game_Map.prototype.ufcDestroyProjectile = function (projectile) {
  return this._towerDefenseProjectile.remove(projectile);
};

Game_Map.prototype.ufcDestroyEnemy = function (enemy) {
  return this._towerDefenseEnemy.remove(enemy);
};

Game_Map.prototype.ufcDestroyTower = function (tower) {
  return this._events.remove(tower);
};

Game_Map.prototype.ufcEnemies = function () {
  return this._towerDefenseEnemy;
};

Game_Map.prototype.ufcProjectiles = function () {
  return this._towerDefenseProjectile;
};

Game_Map.prototype.isWaveEnd = function () {
  return this.ufcEnemies().length <= 0 && this._towerDefenseWave.length <= 0;
};

Game_Map.prototype.xToCanvas = function (x) {
  return this.adjustX(x) * this.tileWidth();
};

Game_Map.prototype.yToCanvas = function (y) {
  return this.adjustY(y) * this.tileWidth();
};

Game_Map.prototype.positionToCanvas = function (x, y) {
  return { x: this.xToCanvas(x), y: this.yToCanvas(y) };
};

UFC.UFCTD.ALIAS._Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function (sceneActive) {
  UFC.UFCTD.ALIAS._Game_Map_update.call(this, sceneActive);
  this.updateTowerDefenseWave();
  this.updateTowerDefenseEnemy();
  this.updateProjectile();
};

Game_Map.prototype.addTowerDefenseNewWave = function (wavedata) {
  this._towerDefenseWave.push(new ufcTowerWaveData(wavedata));
};

Game_Map.prototype.updateTowerDefenseWave = function () {
  if (this._towerDefenseWave.length > 0) {
    let td = this._towerDefenseWave;
    for (let i = 0; i < td.length; i++) {
      td[i].update();

      if (td[i].isSpawnEnemy()) {
        this.ufcSpawnEnemy(...td[i].getEnemy());
        if (td[i].isDone()) {
          td.splice(i, 1);
          i--;
        }
      }
    }
  }
};

Game_Map.prototype.updateTowerDefenseEnemy = function () {
  for (const enemy of this.ufcEnemies()) {
    enemy.update();
  }
};

Game_Map.prototype.updateProjectile = function () {
  for (const projectile of this.ufcProjectiles()) {
    if (!projectile.isDestroyed()) projectile.update();
  }
};

UFC.UFCTD.ALIAS._Game_Map_refresh = Game_Map.prototype.refresh;
Game_Map.prototype.refresh = function () {
  if (UFC.UFCTD.HUDGUI.ITEMSLOT) UFC.UFCTD.HUDGUI.ITEMSLOT.refresh();
  UFC.UFCTD.ALIAS._Game_Map_refresh.call(this);
};

Spriteset_Map.prototype.checkLimitAnimation = function () {
  return (
    this._animationSprites.length > TowerDefenseManager.getLimitAnimation &&
    TowerDefenseManager.getLimitAnimation != 0
  );
};

Spriteset_Map.prototype.removeTargetFromAnimation = function (target) {
  for (const anim of this._animationSprites) {
    for (let i = 0; i < anim._targets.length; i++) {
      if (anim._targets[i] == target) {
        anim._targets.splice(i, 1);
        i--;
      }
    }
  }
};

UFC.UFCTD.ALIAS._Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function () {
  UFC.UFCTD.ALIAS._Spriteset_Map_createCharacters.call(this);

  // Create Tower
  let towers = $gameMap._events.filter(
    (event) => event instanceof Game_TowerDefense
  );
  for (const tower of towers) {
    this._tilemap.addChild(new Sprite_ufcTDTower(tower));
  }

  // Create enemy
  for (const enemy of $gameMap.ufcEnemies()) {
    let newSpritesetIndex = this._characterSprites.push(
      new Sprite_ufcTDEnemy(enemy)
    );
    this._tilemap.addChild(this._characterSprites[newSpritesetIndex - 1]);
  }

  for (const projectile of $gameMap.ufcProjectiles()) {
    this._tilemap.addChild(new Sprite_ufcProjectile(projectile));
  }

  this._tilemap.addChild(new Sprite_ufcGrid($gameMap.ufcGetGrid()));
  if (TowerDefenseManager.getState != TowerDefenseManager.STATE.IDLE) {
    TowerDefenseManager.selectTowerMode();
  }
};

UFC.UFCTD.ALIAS._Game_Party_initAllItems = Game_Party.prototype.initAllItems;
Game_Party.prototype.initAllItems = function () {
  UFC.UFCTD.ALIAS._Game_Party_initAllItems.call(this);
  this._towers = {};
};

UFC.UFCTD.ALIAS._Game_Party_itemContainer = Game_Party.prototype.itemContainer;
Game_Party.prototype.itemContainer = function (item) {
  if (item && (item.ufcTower || item.istowerdata)) {
    return this._towers;
  }
  return UFC.UFCTD.ALIAS._Game_Party_itemContainer.call(this, item);
};

Game_Party.prototype.towers = function () {
  return Object.keys(this._towers).map((id) => $dataItems[id].ufcTower);
};

function TowerDefenseManager() {
  throw new Error("This is a static class");
}

TowerDefenseManager.initialize = function () {
  this._active = false;
  this._HUDGold = false;
  this._HUDHealth = false;
  this._GUIItemSlot = false;
  this._state = TowerDefenseManager.STATE.IDLE;
  this._selectedUFCTD = null;
  this._limitAnimation = 0;
  this._controlBuildingMouse = false;
  this._cacheSprite = [];
  this.addTowerList();
  if (UFC.UFCTD.DEBUGMODE.enable) this.debugMode();
};

TowerDefenseManager.debugMode = function () {
  if (UFC.UFCTD.DEBUGMODE.CONFIG) return;
  UFC.UFCTD.DEBUGMODE.CONFIG = {
    showRange: false,
  };
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key == 1) {
        Graphics.app.ticker.speed = UFC.UFCTD.DEBUGMODE.tickerSpeed;
      }
    },
    false
  );
  window.addEventListener(
    "keyup",
    (e) => {
      if (e.key == 1) {
        Graphics.app.ticker.speed = 1;
      }
      if (e.key == 2) {
        UFC.UFCTD.DEBUGMODE.CONFIG.showRange = !UFC.UFCTD.DEBUGMODE.CONFIG
          .showRange;
        $gameMap._events
          .filter((event) => event instanceof Game_TowerDefense)
          .forEach((event) =>
            event
              .getTowerData()
              .setRangeVisibility(UFC.UFCTD.DEBUGMODE.CONFIG.showRange)
          );
      }
      if (e.key == 3) {
        $gameVariables.setValue(UFC.UFCTD.CONFIG.healthVarId, 99999);
        TowerDefenseManager.updateHUDHealth();
        $gameParty.gainGold(99999999);
        TowerDefenseManager.updateHUDGold();
      }
      if (e.key == 4) {
        this.setLimitAnimation(UFC.UFCTD.DEBUGMODE.limitAnimation);
      }
    },
    false
  );
};

TowerDefenseManager.AURATYPEMODE = {
  FIXED: "fixed",
  PERCENTAGE: "percentage",
};

TowerDefenseManager.AURATYPE = {
  ATTACK: "attack",
  ATTACKSPEED: "attackspeed",
  RANGE: "range",
};

TowerDefenseManager.ENEMYTYPE = {
  AIR: "air",
  GROUND: "ground",
  ALL: "all",
};

TowerDefenseManager.TRIGGERTYPE = {
  DESTROY: "destroy",
  DIRECTION: "direction",
  CONFIG: "config",
};

TowerDefenseManager.STATE = {
  IDLE: "idle",
  BUILD: "build",
};

TowerDefenseManager.EFFECTS = {
  COLD: "cold",
  POISON: "poison",
  STUN: "stun",
  RAGE: "rage",
};

TowerDefenseManager.setLimitAnimation = function (limit) {
  this._limitAnimation = limit;
};

TowerDefenseManager.attackTower = function (damage) {
  let _curHealth = this.getHUDHealthValue;
  $gameVariables.setValue(UFC.UFCTD.CONFIG.healthVarId, _curHealth - damage);

  if (_curHealth - damage <= 0) {
    $gameSwitches.setValue(UFC.UFCTD.CONFIG.gameOverSwitchId, true);
  }

  TowerDefenseManager.updateHUDHealth();
};

TowerDefenseManager.requestAnimation = function (targets, animation) {
  if (!SceneManager.getSpriteSetMap().checkLimitAnimation())
    $gameTemp.requestAnimation(targets, animation);
};

TowerDefenseManager.showGUIItemSlot = function (args) {
  this._GUIItemSlot = args["show"] == "true";
  UFC.UFCTD.HUDGUI.ITEMSLOT.visible = this._GUIItemSlot;
  if (this._GUIItemSlot) UFC.UFCTD.HUDGUI.ITEMSLOT.open();
  else UFC.UFCTD.HUDGUI.ITEMSLOT.close();
};

TowerDefenseManager.showHUDTDGold = function (args) {
  this._HUDGold = args["show"] == "true";
  UFC.UFCTD.HUDGUI.GOLDWINDOW.visible = this._HUDGold;
};

TowerDefenseManager.showHUDTDHealth = function (args) {
  this._HUDHealth = args["show"] == "true";
  UFC.UFCTD.HUDGUI.HEALTHWINDOW.visible = this._HUDHealth;
};

TowerDefenseManager.updateHUDGold = function () {
  if (
    !this._active ||
    !UFC.UFCTD.HUDGUI.GOLDWINDOW ||
    UFC.UFCTD.HUDGUI.GOLDWINDOW._destroyed
  )
    return;
  UFC.UFCTD.HUDGUI.GOLDWINDOW.refresh();
};

TowerDefenseManager.updateHUDHealth = function () {
  if (
    !this._active ||
    !UFC.UFCTD.HUDGUI.HEALTHWINDOW ||
    UFC.UFCTD.HUDGUI.HEALTHWINDOW._destroyed
  )
    return;
  UFC.UFCTD.HUDGUI.HEALTHWINDOW.refresh();
};

TowerDefenseManager.updateHUD = function () {
  this.updateHUDGold();
  this.updateHUDHealth();
};

TowerDefenseManager.config = function (args) {
  let ot = JSON.parse(args["onlyTerrain"]);
  if (ot && ot.length > 0) {
    ot = ot.map(Number);
    $gamePlayer.getGuideAction().setOnlyTerrain(ot);
  }

  let et = JSON.parse(args["exceptTerrain"]);
  if (et && et.length > 0) {
    et = et.map(Number);
    $gamePlayer.getGuideAction().setExceptTerrain(et);
  }

  if (args["limitAnimation"] != "0") {
    this.setLimitAnimation(+args["limitAnimation"]);
  }

  TowerDefenseManager.setActive(true);
  TowerDefenseManager.updateHUDHealth();
  $gameMap.ufcCalcGrid();

  // Disable Open Menu
  // $gameSystem.disableMenu();

  this.cacheImage();
};

// Cache image that being used in tower data, bullets & character
TowerDefenseManager.cacheImage = function () {
  ImageManager.loadSystem("TDSet");
  for (let image of this._cacheSprite) {
    ImageManager.loadCharacter(image);
  }
};

TowerDefenseManager.setActive = function (active) {
  this._active = active;
};

TowerDefenseManager.actionTower = function (towerData, callback) {
  UFC.UFCTD.HUDGUI.TOWERACTION.setTower(towerData, callback);
};

TowerDefenseManager.selectTower = function (towerData) {
  this._state = TowerDefenseManager.STATE.BUILD;
  this._selectedUFCTD = new ufcTowerData(towerData);
  this._selectedUFCTD.setPlaceMode(true);
};

TowerDefenseManager.cancelSelect = function (sfx = true) {
  $gameParty.gainItem($dataItems[this._selectedUFCTD._id], 1);
  // SFX
  if (sfx)
    AudioManager.playSe({
      name: "Cancel1",
      volume: 100,
      pitch: 100,
      pan: 0,
    });
  this.clearSelect();
  UFC.UFCTD.HUDGUI.ITEMSLOT.open();
};

TowerDefenseManager.clearSelect = function () {
  this._state = TowerDefenseManager.STATE.IDLE;
  this._selectedUFCTD = null;
  $gamePlayer.getGuideAction().setActive(false);
  if ($gamePlayer.getGuideActionGraphics().children.length > 0)
    $gamePlayer.getGuideActionGraphics().removeChildAt(0);
  $gameMap.ufcGetGrid().setVisible(false);
};

TowerDefenseManager.selectTowerMode = function () {
  const selectedTower = new Sprite_ufcTDTower(
    new Game_TowerDefense(this.getSelectedTowerData(), $gameMap._mapId)
  );
  selectedTower.setRangeVisibility(true);
  $gamePlayer.getGuideAction().setActive(true);

  $gamePlayer.getGuideActionGraphics().addChild(selectedTower);
  $gameMap.ufcGetGrid().setVisible(true);
  UFC.UFCTD.HUDGUI.ITEMSLOT.close();
};

TowerDefenseManager.getSelectedTowerData = function () {
  return this._selectedUFCTD;
};

TowerDefenseManager.addDBEnemy = function (enemyData) {
  if (!$dataTDEnemy[enemyData.id]) {
    $dataTDEnemy[enemyData.id] = {};
  } else {
    // console.warn("Duplicate ID for " + enemyData.id);
    return;
  }

  for (let data in enemyData) {
    $dataTDEnemy[enemyData.id][data] = enemyData[data];
  }
};

TowerDefenseManager.addDBTrigger = function (
  mapId,
  eventId,
  triggerType,
  triggerValue
) {
  if (!$dataTDTrigger[mapId]) {
    $dataTDTrigger[mapId] = [];
  }
  let evnt = $gameMap._events[eventId];
  if (!$dataTDTrigger[mapId][evnt._x]) {
    $dataTDTrigger[mapId][evnt._x] = [];
  }
  if (!$dataTDTrigger[mapId][evnt._x][evnt._y]) {
    $dataTDTrigger[mapId][evnt._x][evnt._y] = {};
  }

  $dataTDTrigger[mapId][evnt._x][evnt._y][triggerType] = triggerValue;
};

TowerDefenseManager.getTrigger = function (mapid, x, y) {
  if (
    $dataTDTrigger[mapid] &&
    $dataTDTrigger[mapid][x] &&
    $dataTDTrigger[mapid][x][y]
  ) {
    return $dataTDTrigger[mapid][x][y];
  }
  return false;
};

TowerDefenseManager.placeTower = function () {
  let _gPosition = $gamePlayer.getGuideAction().getPosition();
  this._selectedUFCTD._x = _gPosition.x;
  this._selectedUFCTD._y = _gPosition.y;
  this._selectedUFCTD.setPlaceMode(false);
  $gameMap.ufcAddTower(this._selectedUFCTD);
  this._selectedUFCTD.setRangeVisibility(false);

  UFC.UFCTD.HUDGUI.ITEMSLOT.open();

  this.clearSelect();

  // SFX
  AudioManager.playSe({
    name: "Equip1",
    volume: 100,
    pitch: 100,
    pan: 0,
  });
};

Object.defineProperty(TowerDefenseManager, "getState", {
  get: function () {
    return this._state;
  },
});

Object.defineProperty(TowerDefenseManager, "getLimitAnimation", {
  get: function () {
    return this._limitAnimation;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDGold", {
  get: function () {
    return this._HUDGold;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealth", {
  get: function () {
    return this._HUDHealth;
  },
});

Object.defineProperty(TowerDefenseManager, "getGUIItemSlot", {
  get: function () {
    return this._GUIItemSlot;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealthValue", {
  get: function () {
    return $gameVariables.value(UFC.UFCTD.CONFIG.healthVarId);
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealthMaxValue", {
  get: function () {
    return $gameVariables.value(UFC.UFCTD.CONFIG.healthMaxVarId);
  },
});

TowerDefenseManager.addTowerList = function () {
  for (let i = 0; i < $dataItems.length; i++) {
    if ($dataItems[i] && $dataItems[i].note) this.addTower(i, $dataItems[i]);
  }
};

TowerDefenseManager.addTower = function (itemid, item) {
  const lines = item.note.split(/[\r\n]+/);
  let tdMode = false;
  let noteMode = false;
  let note = "";
  let data = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/<ufcTD>/)) {
      tdMode = true;
      data = {};
    }

    if (lines[i].match(/<\/ufcTD>/)) {
      break;
    }

    if (tdMode) {
      if (lines[i].match(/<note>/)) {
        noteMode = true;
        continue;
      }

      if (lines[i].match(/<\/note>/)) {
        noteMode = false;
        continue;
      }

      if (noteMode) {
        note += lines[i] + "\n";
        continue;
      }

      let dataNote = /<(\w*)(:?)([^>]*)>/g.exec(lines[i]);
      if (dataNote) data[dataNote[1]] = dataNote[3];
    }
  }
  if (data) {
    data.istowerdata = true;
    data.id = itemid;
    data.name = item.name;
    data.iconindex = item.iconIndex;
    data.bulletanimationid = item.animationId;
    data.note = note;
    item.ufcTower = data;
    if (
      this._cacheSprite.indexOf(item.ufcTower.character) === -1 &&
      item.ufcTower.character
    ) {
      this._cacheSprite.push(item.ufcTower.character);
    }

    if (
      this._cacheSprite.indexOf(item.ufcTower.bulletspritename) === -1 &&
      item.ufcTower.bulletspritename != "?"
    ) {
      this._cacheSprite.push(item.ufcTower.bulletspritename);
    }
  }
};

TowerDefenseManager.convertDirection = function (direction) {
  let dir = 2;
  let _isMultipleDirection = direction.split("/");
  if (_isMultipleDirection.length > 1) {
    direction = PIXI.utils.randomArray(_isMultipleDirection);
  }
  switch (direction) {
    case "Left":
      dir = 4;
      break;
    case "Right":
      dir = 6;
      break;
    case "Down":
      dir = 2;
      break;
    case "Up":
      dir = 8;
      break;
    case "Random":
      dir = PIXI.utils.randomArray([4, 6, 2, 8]);
      break;
  }

  return dir;
};

const ufcTowerData = function () {
  this.initialize(...arguments);
};

ufcTowerData.prototype.initialize = function (data) {
  this._id = data["id"];
  this._name = data["name"];
  this._attack = +data["attack"];
  this._range = +data["range"];
  this._character = data["character"];
  this._characterIndex = data["characterindex"];
  this._attackSpeed = +data["attackspeed"];
  this._bulletSpeed = data["bulletspeed"];
  this._bulletAnimationId = data["bulletanimationid"];
  this._bulletCharacterName = data["bulletspritename"];
  this._bulletCharacterIndex = data["bulletspriteindex"];
  this._bulletCharacterIndexY = data["bulletspriteindexy"];
  this._upgrade = [];
  let listUpgrade = Object.keys(data).filter(
    (item) => item.slice(0, 7) == "upgrade"
  );
  if (listUpgrade.length > 0) {
    listUpgrade.forEach((item) => {
      let _data = data[item].split("|");
      let _price = 0;
      if (_data.length == 1) {
        _price = $dataItems[_data[0]].price;
      } else {
        _price = +_data[1];
      }

      this._upgrade.push({
        id: +_data[0],
        price: _price,
      });
    });
  }

  if (data["sellprice"]) {
    this._sellPrice = $dataItems[this._id].price / 2;
  } else {
    this._sellPrice = data["sellprice"];
  }
  this._effects = [];
  if (data["effects"]) {
    let effects = data["effects"].split(",");
    for (const effect of effects) {
      let _effect = effect.split("|");
      this._effects.push({
        name: _effect[0],
        effect: +_effect[1],
        duration: +_effect[2],
        chance: +_effect[3] || 100,
      });
    }
  }
  this._auras = [];
  if (data["auras"]) {
    let auras = data["auras"].split(",");
    for (const aura of auras) {
      let _aura = aura.split("|");
      this._auras.push({
        name: _aura[0],
        effect: +_aura[1],
        type: _aura[2] || "fixed",
      });
    }
  }
  this._attackType = data["attacktype"] || TowerDefenseManager.ENEMYTYPE.ALL;
  this._note = data["note"];
  this._buffs = {};
  this.resetBuffs();
  this._x = 0;
  this._y = 0;
  this._event = new PIXI.utils.EventEmitter();
  this._placeMode = false;
};

ufcTowerData.prototype.setRangeVisibility = function (visible) {
  this._event.emit("setRangeVisibility", visible);
};

ufcTowerData.prototype.getBulletData = function () {
  return {
    damage: {
      damage: this.getAttack(),
      effects: this._effects,
    },
    speed: +this._bulletSpeed,
    animationId: this._bulletAnimationId,
    characterName: this._bulletCharacterName,
    characterIndex: +this._bulletCharacterIndex,
    characterIndexY: +this._bulletCharacterIndexY,
  };
};

ufcTowerData.prototype.getBuffs = function (buff) {
  if (!buff) return this._buffs;

  return this._buffs[buff];
};

ufcTowerData.prototype.getBaseValWithAuraType = function (type) {
  switch (type) {
    case TowerDefenseManager.AURATYPE.ATTACK:
      return this.getBaseAttack;
    case TowerDefenseManager.AURATYPE.RANGE:
      return this.getBaseRange;
    case TowerDefenseManager.AURATYPE.ATTACKSPEED:
      return this.getBaseAttackSpeed;
  }
  return false;
};

ufcTowerData.prototype.resetBuffs = function () {
  for (const aura in TowerDefenseManager.AURATYPE) {
    this._buffs[TowerDefenseManager.AURATYPE[aura]] = 0;
  }
};

ufcTowerData.prototype.getAttack = function () {
  return Math.max(
    0,
    this.getBaseAttack + this._buffs[TowerDefenseManager.AURATYPE.ATTACK]
  );
};

ufcTowerData.prototype.getRange = function () {
  return Math.max(
    0,
    this.getBaseRange + this._buffs[TowerDefenseManager.AURATYPE.RANGE]
  );
};

ufcTowerData.prototype.getAttackSpeed = function () {
  return (
    this.getBaseAttackSpeed +
    this._buffs[TowerDefenseManager.AURATYPE.ATTACKSPEED] * -1
  );
};

ufcTowerData.prototype.setBuffs = function (buffs) {
  for (const buff of buffs) {
    let be = buff.effect;
    if (buff.type === TowerDefenseManager.AURATYPEMODE.PERCENTAGE) {
      be = Math.floor(this.getBaseValWithAuraType(buff.name) * (be / 100));
    }

    if (this._buffs[buff.name] === 0) {
      this._buffs[buff.name] = be;
    } else {
      if (buff.name === TowerDefenseManager.AURATYPE.ATTACKSPEED) {
        this._buffs[buff.name] = Math.min(be, this._buffs[buff.name]);
      } else {
        this._buffs[buff.name] = Math.max(be, this._buffs[buff.name]);
      }
    }
  }
};

ufcTowerData.prototype.setPlaceMode = function (mode) {
  this._placeMode = mode;
};

ufcTowerData.prototype.getAuras = function () {
  return this._auras;
};

ufcTowerData.prototype.isHaveAura = function () {
  return this._auras.length > 0;
};

ufcTowerData.prototype.isHaveUpgrade = function () {
  return this._upgrade.length > 0;
};

ufcTowerData.prototype.checkGetBuffs = function () {
  let towers = $gameMap._events.filter(
    (event) =>
      event instanceof Game_TowerDefense &&
      event.getTowerData() !== this &&
      event.getTowerData().isHaveAura() &&
      PIXI.utils.isInRange(
        this._x,
        this._y,
        event._x,
        event._y,
        event.getTowerData().getRange()
      )
  );
  for (const tower of towers) {
    this.setBuffs(tower.getTowerData().getAuras());
    tower.addTowerEffectedByAura(this);
  }
};

Object.defineProperty(ufcTowerData.prototype, "getBaseAttack", {
  get: function () {
    return this._attack;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getBaseRange", {
  get: function () {
    return this._range;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getBaseAttackSpeed", {
  get: function () {
    return this._attackSpeed;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getPlaceMode", {
  get: function () {
    return this._placeMode;
  },
});

const ufcTowerEffects = function () {
  this.initialize(...arguments);
};

ufcTowerEffects.prototype.initialize = function (data) {
  this._name = data.name;
  this._effect = data.effect;
  this._duration = data.duration;
  this._chance = data.chance;
  this._curTime = this._duration;
  this._isDone = false;
  this._effectPerSecond = false;
  this._epsTimeDefault = 60;
  this._epsTime = this._epsTimeDefault;
  this._epsCallback = null;
  switch (this._name) {
    case TowerDefenseManager.EFFECTS.POISON:
      this._effectPerSecond = true;
      break;
  }
};

ufcTowerEffects.prototype.setEPSCallback = function (callback) {
  this._epsCallback = callback;
};
ufcTowerEffects.prototype.epsCallback = function () {
  if (this._epsCallback) {
    this._epsCallback();
  }
};

ufcTowerEffects.prototype.getEffect = function () {
  return this._effect;
};

ufcTowerEffects.prototype.getChanceEffect = function () {
  let chance = Math.randomInt(100);
  return this._chance < 100 ? this._chance > chance : true;
};

ufcTowerEffects.prototype.isDone = function () {
  return this._isDone;
};

ufcTowerEffects.prototype.update = function () {
  if (this._effectPerSecond) {
    this._epsTime--;
    if (this._epsTime <= 0) {
      this._epsTime = this._epsTimeDefault;
      this.epsCallback();
    }
  }

  this._curTime--;
  if (this._curTime <= 0) this._isDone = true;
};

ufcTowerEffects.prototype.reset = function () {
  this._curTime = this._duration;
  this._isDone = false;
};

const ufcTowerSpawnData = function () {
  this.initialize(...arguments);
};

ufcTowerSpawnData.prototype.initialize = function (data) {
  this._x = data._x;
  this._y = data._y;
  this._direction = data["direction"];
};

const ufcTowerWaveData = function () {
  this.initialize(...arguments);
};

ufcTowerWaveData.prototype.initialize = function (data) {
  this._spawnLocationId = data["spawnLocationId"];
  this._enemy = data["enemy"];
  this._numberSpawn = +data["numberSpawn"];
  this._delayPerSpawn = +data["delayPerSpawn"];
  this._delay = +data["delay"];
  this._start = false;
  this._startSE = data["startSE"];
  this._startSEVolume = +data["startSEVolume"];
  this._timeSpawn = 0;
  this._spawnEnemy = false;
};

ufcTowerWaveData.prototype.getEnemy = function () {
  return [this._enemy, this._spawnLocationId];
};

ufcTowerWaveData.prototype.update = function () {
  if (this._delay > 0) {
    this._delay--;
    return;
  }

  if (!this._start) {
    this._start = true;
    if (this._startSE) {
      AudioManager.playSe({
        name: this._startSE,
        volume: this._startSEVolume,
        pitch: 100,
        pan: 0,
      });
    }
  }

  this._timeSpawn--;
  if (this._timeSpawn <= 0) {
    this.spawnEnemy();
  }
};

ufcTowerWaveData.prototype.spawnEnemy = function () {
  this._spawnEnemy = true;
  this._timeSpawn = this._delayPerSpawn;
  this._numberSpawn--;
};

ufcTowerWaveData.prototype.isSpawnEnemy = function () {
  if (this._spawnEnemy) {
    this._spawnEnemy = false;
    return true;
  }
  return false;
};

ufcTowerWaveData.prototype.isDone = function () {
  return this._numberSpawn <= 0;
};

function Window_BaseExtend() {
  this.initialize(...arguments);
}

Window_BaseExtend.prototype = Object.create(Window_Base.prototype);
Window_BaseExtend.prototype.constructor = Window_BaseExtend;

Window_BaseExtend.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._lineHeight = Window_Base.prototype.lineHeight();
  this._defaultLineHeight = this._lineHeight;
};

Window_BaseExtend.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_BaseExtend.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_BaseExtend.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

Window_BaseExtend.prototype.drawTextEx = function (text, x, y, width, align) {
  if (align == "center") {
    let textWidth = this.textSizeEx(text).width;
    x += this.itemWidth() / 2;
    x -= textWidth / 2;
    x -= this.itemPadding() * 2;
  }
  this.resetFontSettings();
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);
  return textState.outputWidth;
};

Window_BaseExtend.prototype.clear = function () {
  this.contents.clear();
  this.contentsBack.clear();
};

const Window_GUIItemSlot = function () {
  this.initialize(...arguments);
};

Window_GUIItemSlot.prototype = Object.create(Window_Command.prototype);
Window_GUIItemSlot.prototype.constructor = Window_GUIItemSlot;

Window_GUIItemSlot.prototype.initialize = function () {
  let width =
    UFC.UFCTD.HUDGUI.SETTINGS.itemSize * this.maxCols() +
    $gameSystem.windowPadding() * 2;
  let rect = new Rectangle(
    Graphics.boxWidth / 2 - width / 2,
    Graphics.boxHeight,
    width,
    this.itemHeight() + $gameSystem.windowPadding() * 2
  );
  rect.y -= rect.height;
  Window_Command.prototype.initialize.call(this, rect);
  this._selectKeyboard = false;
  this._towers = [];

  this.setBackgroundType(UFC.UFCTD.HUDGUI.SETTINGS.itemWindowType);

  this.refresh();
};

Window_GUIItemSlot.prototype.callOkHandler = function () {
  this.activate();
  let tower = this._towers[this.index()];
  if (!tower || ($gameMessage.isBusy() && !this._selectKeyboard)) return;
  $gamePlayer.getGuideAction().resetParent();
  $gameParty.gainItem($dataItems[tower.id], -1);
  TowerDefenseManager.clearSelect();
  TowerDefenseManager.selectTower(tower);
  TowerDefenseManager.selectTowerMode();
  this._selectKeyboard = false;
  $gameMessage.setWindowTower(false);
};

Window_GUIItemSlot.prototype.activeKeyboard = function () {
  $gameMessage.setWindowTower(true);
  this._selectKeyboard = true;
  this.activate();
  this.select(0);
};

Window_GUIItemSlot.prototype.deactiveKeyboard = function () {
  this._selectKeyboard = false;
  $gameMessage.setWindowTower(false);
  this.select(-1);
  this.deactivate();
};

Window_GUIItemSlot.prototype.processCursorMove = function () {
  if (this.isCancelTriggered() && this._selectKeyboard) {
    this.deactiveKeyboard();
    return;
  }

  if (
    this.isCancelTriggered() &&
    !this._selectKeyboard &&
    TowerDefenseManager.getState != TowerDefenseManager.STATE.BUILD
  ) {
    this.activeKeyboard();
  }

  if (!this._selectKeyboard) return;
  Window_Command.prototype.processCursorMove.call(this);
};

Window_GUIItemSlot.prototype.drawAllItems = function () {
  const topIndex = this.topIndex();
  for (let i = 0; i < this.maxVisibleItems(); i++) {
    const index = topIndex + i;
    if (index < this.maxItems()) {
      this.drawItemBackground(index);
      this.drawItem(index);
    }
  }
};

Window_GUIItemSlot.prototype.drawItemBackground = function (index) {
  const rect = this.itemRect(index);
  this.drawBackgroundRect(rect);
  if (this.commandName(index)) {
    let scale = 0.8;
    let size = rect.width * scale;
    this.drawIcon(
      this.commandIconIndex(index),
      rect.x + (rect.width - size) / 2,
      rect.y + (rect.width - size) / 2,
      size,
      size
    );
  }
};

Window_GUIItemSlot.prototype.drawItem = function (index) {
  const itemRect = this.itemRect(index);
  const rect = this.itemLineRect(index);
  const align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.contents.fontSize = 12;
  this.drawText(
    this.commandName(index),
    rect.x,
    itemRect.height - 28,
    rect.width,
    align
  );
  const numItem = this.commandNumItem(index);
  if (numItem > 1) {
    let numSizeRect = new Rectangle(
      itemRect.x,
      itemRect.y,
      UFC.UFCTD.HUDGUI.SETTINGS.itemNumSize,
      UFC.UFCTD.HUDGUI.SETTINGS.itemNumSize
    );
    numSizeRect.x += itemRect.width - numSizeRect.width;
    this.drawNumItem(numSizeRect, numItem);
  }
};

Window_GUIItemSlot.prototype.drawIcon = function (
  iconIndex,
  x,
  y,
  width,
  height
) {
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;
  this.contentsBack.blt(bitmap, sx, sy, pw, ph, x, y, width, height);
};

Window_GUIItemSlot.prototype.drawNumItem = function (rect, numItem) {
  const c1 = "rgba(0, 0, 0, .6)";
  const x = rect.x;
  const y = rect.y;
  const w = rect.width;
  const h = rect.height;
  this.contentsBack.fillRect(x, y, w, h, c1);
  this.contentsBack.strokeRect(x, y, w, h, c1);
  this.contentsBack.fontSize = Math.floor(w * 0.9);
  this.contentsBack.drawText(
    numItem,
    x,
    y,
    rect.width,
    rect.height + this.rowSpacing() / 2,
    "center"
  );
  this.resetFontSettings();
};

Window_GUIItemSlot.prototype.maxCols = function () {
  return UFC.UFCTD.HUDGUI.SETTINGS.itemCol;
};

Window_Command.prototype.commandNumItem = function (index) {
  return this._list[index].numItem;
};

Window_Command.prototype.commandIconIndex = function (index) {
  return this._list[index].iconIndex;
};

Window_GUIItemSlot.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (this.isTouchedInsideFrame()) {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = true;
    this.activate();
  } else {
    if (this._selectKeyboard) return;
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = false;
    this.select(-1);
    this.deactivate();
  }
};

Window_GUIItemSlot.prototype.onTouchSelect = function (trigger) {
  this._doubleTouch = false;
  if (this.isCursorMovable()) {
    const lastIndex = this.index();
    const hitIndex = this.hitIndex();
    if (hitIndex >= 0) {
      if (hitIndex === this.index()) {
        this._doubleTouch = true;
      }
      this.select(hitIndex);
    }
    if (this.index() !== lastIndex) {
      this.playCursorSound();
    }
  }
};

Window_GUIItemSlot.prototype.isTouchInWindow = function () {
  const touchPos = new Point(TouchInput.x, TouchInput.y);
  const localPos = this.worldTransform.applyInverse(touchPos);
  if (this.innerRect.contains(localPos.x, localPos.y)) {
  }
};

Window_GUIItemSlot.prototype.addCommand = function (
  name,
  iconIndex,
  numItem = 1,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    iconIndex: iconIndex,
    callback: callback,
    numItem: numItem,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_GUIItemSlot.prototype.itemHeight = function () {
  return UFC.UFCTD.HUDGUI.SETTINGS.itemSize;
};

Window_GUIItemSlot.prototype.itemWidth = function () {
  return UFC.UFCTD.HUDGUI.SETTINGS.itemSize;
};

Window_GUIItemSlot.prototype.update = function () {
  Window_Command.prototype.update.call(this);
  if (TowerDefenseManager.getGUIItemSlot && !this._selectKeyboard) {
    if ($gameMessage.isBusy() && this.visible) {
      this.close();
      this.visible = false;
    } else if (!$gameMessage.isBusy() && !this.visible) {
      this.open();
      this.visible = true;
    }
  }
};

Window_GUIItemSlot.prototype.refresh = function () {
  Window_Command.prototype.refresh.call(this);
  this.clearCommandList();
  this.select(-1);
  this.makeCommandTowers();
  this.drawAllItems();
};

Window_GUIItemSlot.prototype.makeCommandTowers = function () {
  this._towers = $gameParty.towers();
  let length =
    this._towers.length < this.maxCols() ? this.maxCols() : this._towers.length;
  for (let i = 0; i < length; i++) {
    if (this._towers[i]) {
      this.addCommand(
        this._towers[i].name,
        this._towers[i].iconindex,
        $gameParty.numItems(this._towers[i]),
        true
      );
    } else {
      this.addCommand("", 0, 0, true);
    }
  }
};

function Window_TDAction() {
  this.initialize(...arguments);
}

Window_TDAction.prototype = Object.create(Window_Command.prototype);
Window_TDAction.prototype.constructor = Window_TDAction;

Window_TDAction.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
  this._lineHeight = Window_Command.prototype.lineHeight();
  this._defaultLineHeight = this._lineHeight;
  this._towerData = null;
  this._towerDataDestroyCallback = null;
  this._selected = false;
  this.setBackgroundType(0);

  // this.setHandler("ok", this.onOk.bind(this));
  this.setHandler("cancel", this.onCancel.bind(this));

  let statusWidth = this.x;
  let statusHeight = 240;
  this.status = new Window_TDStatus(
    new Rectangle(
      -statusWidth,
      this.height - statusHeight,
      statusWidth,
      statusHeight
    )
  );
  this.addChild(this.status);

  let upgradeWidth = 250;
  let upgradeHeight = this.height;
  this.upgradeWindow = new Window_TDActionUpgrade(
    new Rectangle(
      this.width,
      this.height - upgradeHeight,
      upgradeWidth,
      upgradeHeight
    )
  );
  this.addChild(this.upgradeWindow);

  this.upgradeWindow.on("upgradeTower", this.upgradeTower, this);
  this.upgradeWindow.on("selectUpgradeWindow", this.selectUpgradeWindow, this);

  this.hide();
  this.close();
};

Window_TDAction.prototype.colSpacing = function () {
  return this.rowSpacing();
};

Window_TDAction.prototype.maxCols = function () {
  return 2;
};

Window_TDAction.prototype.itemHeight = function () {
  let item = 3;
  return this.height / item - (item - 1) * this.rowSpacing();
};

Window_TDAction.prototype.selectUpgradeWindow = function (isSelect) {
  if (isSelect) this.deactivate();
  else this.activate();
  this.select(1);
};

Window_TDAction.prototype.upgradeTower = function (upgradeIndex) {
  AudioManager.playSe({
    name: "Coin",
    volume: 80,
    pitch: 100,
    pan: 0,
  });
  $gameParty.gainGold(-+this._towerData._upgrade[upgradeIndex].price);
  TowerDefenseManager.updateHUDGold();
  // Upgrade
  $gamePlayer.getGuideAction().resetParent();
  TowerDefenseManager.selectTower(
    $dataItems[this._towerData._upgrade[upgradeIndex].id].ufcTower
  );
  TowerDefenseManager.selectTowerMode();
  TowerDefenseManager.placeTower();
  this._towerDataDestroyCallback();
  this.close();
};

Window_TDAction.prototype.callOkHandler = function () {
  switch (this.index()) {
    // Move
    case 0:
      $gamePlayer.getGuideAction().resetParent();
      TowerDefenseManager.selectTower($dataItems[this._towerData._id].ufcTower);
      TowerDefenseManager.selectTowerMode();
      this._towerDataDestroyCallback();
      break;
    // Upgrade
    case 1:
      if (this._towerData.isHaveUpgrade()) {
        this._selected = true;
        this.upgradeWindow._selected = true;
        this.upgradeWindow.activate();
        this.upgradeWindow.refreshStatus(0);
        this.upgradeWindow.select(0);

        this.deactivate();
        return;
      }
      break;
    // Pickup
    case 2:
      TowerDefenseManager.selectTower($dataItems[this._towerData._id].ufcTower);
      TowerDefenseManager.cancelSelect(false);
      this._towerDataDestroyCallback();
      break;
    // Sell
    case 3:
      AudioManager.playSe({
        name: "Coin",
        volume: 80,
        pitch: 100,
        pan: 0,
      });
      $gameParty.gainGold(+this._towerData._sellPrice);
      TowerDefenseManager.updateHUDGold();
      this._towerDataDestroyCallback();
      UFC.UFCTD.HUDGUI.ITEMSLOT.open();
      break;
    // Cancel
    case 4:
      UFC.UFCTD.HUDGUI.ITEMSLOT.open();
      break;
  }
  this.close();
};

Window_TDAction.prototype.close = function () {
  if (this._towerData) this._towerData.setRangeVisibility(false);

  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }
  Window_Command.prototype.close.call(this);
  $gameMessage.setWindowTower(false);
  this.deactivate();
};

Window_TDAction.prototype.setTower = function (ufcTowerData, callback) {
  this._towerData = ufcTowerData;
  this._towerDataDestroyCallback = callback;
  this.refresh();
  this.addCommand("\\FS[20]Move", 0, true);

  let isThereAnUpgrade = false;
  let upgradeText = "\\FS[20]\\C[7]Upgrade";
  if (this._towerData.isHaveUpgrade()) {
    isThereAnUpgrade = true;
    upgradeText = "\\FS[20]Upgrade";
  }
  this.addCommand(upgradeText, 2, isThereAnUpgrade);
  this.addCommand("\\FS[20]Pickup", 4, true);
  this.addCommand(
    "\\FS[16]Sell\\FS\n\\FS[20]" +
      "\\C[14]" +
      this._towerData._sellPrice +
      "\\C " +
      TextManager.currencyUnit,
    1
  );
  this.addCommand("Cancel", 3, true);
  this.drawAllItems();
  this.open();
  this.show();
  this.activate();
  this.select(0);
  this.status.drawDefaultStatus(this._towerData);
  this.status.open();
  if (isThereAnUpgrade) {
    this.upgradeWindow.setUpgrade(this._towerData._upgrade);
  }
  this._towerData.setRangeVisibility(true);
  UFC.UFCTD.HUDGUI.ITEMSLOT.close();
};

Window_TDAction.prototype.cursorDown = function (wrap) {
  if (this.index() === this.maxItems() - this.maxCols() && wrap) {
    this.smoothSelect(this.maxItems() - 1);
  } else {
    Window_Command.prototype.cursorDown.call(this, wrap);
  }
};

Window_TDAction.prototype.itemRect = function (index) {
  let rect = Window_Command.prototype.itemRect.call(this, index);
  if (index === this.maxItems() - 1) {
    rect.width *= 2;
    rect.width += this.colSpacing();
  }
  return rect;
};

Window_TDAction.prototype.open = function () {
  SoundManager.playOk();
  Window_Command.prototype.open.call(this);
};

Window_TDAction.prototype.onCancel = function () {
  UFC.UFCTD.HUDGUI.ITEMSLOT.open();
  this.close();
};

Window_TDAction.prototype.addCommand = function (
  name,
  icon,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    icon: icon,
    callback: callback,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_TDAction.prototype.drawIconTD = function (index, x, y, align) {
  const bitmap = ImageManager.loadSystem("TDSet");
  const pw = 48;
  const ph = 48;
  if (align == "center") {
    x += this.itemWidth() / 2;
    x -= pw / 2;
  } else if (align == "right") {
    let _x = x;
    x = this.itemWidth();
    x -= pw;
    x -= _x;
  }
  const sx = (index % pw) * pw;
  const sy = Math.floor(index / ph) * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y, pw * 0.8, ph * 0.8);
};

Window_TDAction.prototype.drawTextEx = function (text, x, y, width, align) {
  if (align == "center") {
    let textWidth = this.textSizeEx(text).width;
    x += this.itemWidth() / 2;
    x -= textWidth / 2;
    x -= this.itemPadding() * 2;
  }
  this.resetFontSettings();
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);

  return textState.outputWidth;
};

Window_TDAction.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  // this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawIconTD(this._list[index].icon, rect.x, rect.y);
  let textY = rect.y;
  if (index == 3) {
    this.setLineHeight(24);
    textY -= 5;
  }
  this.drawTextEx(this.commandName(index), rect.x + 48, textY, 200);
  if (index == 3) {
    this.resetLineHeight();
  }
};

// Enable sound when cursor hover the button
Window_TDAction.prototype.onTouchSelect = function (trigger) {
  this._doubleTouch = false;
  if (this.isCursorMovable()) {
    const lastIndex = this.index();
    const hitIndex = this.hitIndex();
    if (hitIndex >= 0) {
      if (hitIndex === this.index()) {
        this._doubleTouch = true;
      }
      this.select(hitIndex);
    }
    if (this.index() !== lastIndex) {
      this.playCursorSound();
    }
  }
};

Window_TDAction.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (this.isTouchedInsideFrame() && !this.active && !this._selected) {
    this.activate();
  }
};

Window_TDAction.prototype.update = function () {
  Window_Command.prototype.update.call(this);
  // this.updateChildren();
};

Window_TDAction.prototype.updateChildren = function () {
  for (const child of this.children) {
    if (child.update) {
      child.update();
    }
  }
};

Window_TDAction.prototype.refresh = function () {
  for (const child of this.children) {
    if (child.contents) {
      child.contents.clear();
    }
  }
  Window_Command.prototype.refresh.call(this);
};

Window_TDAction.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_TDAction.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_TDAction.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

Window_TDAction.prototype.destroy = function () {
  this.upgradeWindow.removeListener("upgradeTower", this.upgradeTower);
  this.upgradeWindow.removeListener(
    "selectUpgradeWindow",
    this.selectUpgradeWindow
  );
  Window_Command.prototype.destroy.call(this);
};

function Window_TDActionUpgrade() {
  this.initialize(...arguments);
}

Window_TDActionUpgrade.prototype = Object.create(Window_Command.prototype);
Window_TDActionUpgrade.prototype.constructor = Window_TDActionUpgrade;

Window_TDActionUpgrade.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
  this._tmpIndex = 0;
  this._lineHeight = Window_Command.prototype.lineHeight();
  this._selected = false;
  this._defaultLineHeight = this._lineHeight;
  this._upgradeData = [];
  let titleHeight = 60;
  this._title = new Window_BaseExtend(
    new Rectangle(0, -titleHeight, this.width, titleHeight)
  );
  this._title.setBackgroundType(2);
  this.addChild(this._title);

  let statusWidth = 360;
  let statusHeight = 240;
  this.status = new Window_TDStatus(
    new Rectangle(this.width, 0, statusWidth, statusHeight)
  );
  this.addChild(this.status);

  this.setHandler("cancel", this.onCancel.bind(this));

  this.setBackgroundType(0);
};

Window_TDActionUpgrade.prototype.onCancel = function () {
  this._selected = false;
  this.windowHovered(false, true);
};

Window_TDActionUpgrade.prototype.maxCols = function () {
  return 1;
};

Window_TDActionUpgrade.prototype.itemHeight = function () {
  let item = 3;
  return this.height / item - (item - 1) * this.rowSpacing();
};

Window_TDActionUpgrade.prototype.close = function () {
  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }
  Window_Command.prototype.close.call(this);
};

Window_TDActionUpgrade.prototype.callOkHandler = function () {
  let upgradeData = this._upgradeData[this.index()];
  if ($gameParty.gold() >= upgradeData.price) {
    this.emit("upgradeTower", this.index());
    this._selected = false;
    this.deactivate();
  } else {
    SoundManager.playBuzzer();
  }
};

Window_TDActionUpgrade.prototype.setUpgrade = function (upgradeData) {
  this.refresh();
  this._title.clear();
  this._upgradeData = [];
  this.setLineHeight(28);
  upgradeData.forEach((item) => {
    let upgradeData = {
      data: $dataItems[item.id].ufcTower,
      price: item.price,
    };
    this.addCommand(
      "\\FS[20]" +
        upgradeData.data.name +
        "\n\\C[14]" +
        upgradeData.price +
        "\\C " +
        TextManager.currencyUnit,
      upgradeData.data.character,
      upgradeData.data.characterindex,
      true
    );
    this._upgradeData.push(upgradeData);
  });
  this.drawTitle();
  this.drawAllItems();
  this.open();
  this.status.open();
  this.deactivate();
  this.select(-1);
};

Window_TDActionUpgrade.prototype.drawTitle = function () {
  const c1 = ColorManager.itemBackColor1();
  const c2 = ColorManager.itemBackColor2();
  let pad = 2;
  let w = this.contentsWidth() - pad;
  let h = this._title.contents.fontSize + 10;
  this._title.contentsBack.gradientFillRect(0, 0, w, h, c1, c2, true);
  this._title.drawText("UPGRADE", 0, 0, w, "center");
  this._title.open();
  this._title.show();
};

Window_TDActionUpgrade.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (this.isClosed()) return;
  if ((this.isTouchedInsideFrame() || this._selected) && !this.active) {
    this.windowHovered(true);
  } else if (!this.isTouchedInsideFrame() && !this._selected && this.active) {
    this.windowHovered(false);
  }
};

Window_TDActionUpgrade.prototype.windowHovered = function (
  isHovered,
  emit = true
) {
  if (isHovered) {
    this.activate();
    this.refreshStatus(0);
    this._selected = false;
  } else {
    this.deactivate();
    this.select(-1);
  }
  if (emit) this.emit("selectUpgradeWindow", isHovered);
};

Window_TDActionUpgrade.prototype.open = function () {
  SoundManager.playOk();
  Window_Command.prototype.open.call(this);
};

Window_TDActionUpgrade.prototype.addCommand = function (
  name,
  character,
  characterIndex,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    character: character,
    characterIndex: characterIndex,
    callback: callback,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_TDActionUpgrade.prototype.drawCharacter = function (
  character,
  characterIndex,
  x,
  y
) {
  let characterImage = ImageManager.loadCharacter(character);
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 0.8;

  this.contents.blt(
    characterImage,
    sx,
    sy,
    pw,
    ph,
    x,
    y,
    pw * scale,
    ph * scale
  );
};

Window_TDActionUpgrade.prototype.drawTextEx = function (
  text,
  x,
  y,
  width,
  align
) {
  if (align == "center") {
    let textWidth = this.textSizeEx(text).width;
    x += this.itemWidth() / 2;
    x -= textWidth / 2;
    x -= this.itemPadding() * 2;
  }
  this.resetFontSettings();
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);

  return textState.outputWidth;
};

Window_TDActionUpgrade.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.drawCharacter(
    this._list[index].character,
    this._list[index].characterIndex,
    rect.x,
    rect.y
  );
  let textY = rect.y - 10;
  this.drawTextEx(this.commandName(index), rect.x + 48, textY, 200);
};

// Enable sound when cursor hover the button
Window_TDActionUpgrade.prototype.onTouchSelect = function (trigger) {
  this._doubleTouch = false;
  if (this.isCursorMovable()) {
    const lastIndex = this.index();
    const hitIndex = this.hitIndex();
    if (hitIndex >= 0) {
      if (hitIndex === this.index()) {
        this._doubleTouch = true;
      }
      this.select(hitIndex);
    }
    if (this.index() !== lastIndex) {
      this.playCursorSound();
    }
  }
};

Window_TDActionUpgrade.prototype.refreshStatus = function (index) {
  this.status.drawDefaultStatus(
    new ufcTowerData(this._upgradeData[index].data)
  );
};

Window_TDActionUpgrade.prototype.select = function (index) {
  if (this._tmpIndex !== index && index !== -1 && this.status) {
    this._tmpIndex = index;
    this.refreshStatus(index);
  }
  Window_Command.prototype.select.call(this, index);
};

Window_TDActionUpgrade.prototype.update = function () {
  Window_Command.prototype.update.call(this);
  this.updateChildren();
};

Window_TDActionUpgrade.prototype.updateChildren = function () {
  for (const child of this.children) {
    if (child.update) {
      child.update();
    }
  }
};

Window_TDActionUpgrade.prototype.refresh = function () {
  for (const child of this.children) {
    if (child.contents) {
      child.contents.clear();
      child.contentsBack.clear();
    }
  }
  Window_Command.prototype.refresh.call(this);
};

Window_TDActionUpgrade.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_TDActionUpgrade.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_TDActionUpgrade.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

function Window_TDGold() {
  this.initialize(...arguments);
}

Window_TDGold.prototype = Object.create(Window_Selectable.prototype);
Window_TDGold.prototype.constructor = Window_TDGold;

Window_TDGold.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_TDGold.prototype.colSpacing = function () {
  return 0;
};

Window_TDGold.prototype.refresh = function () {
  const rect = this.itemLineRect(0);
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  this.contents.clear();
  this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
};

Window_TDGold.prototype.value = function () {
  return $gameParty.gold();
};

Window_TDGold.prototype.currencyUnit = function () {
  return TextManager.currencyUnit;
};

Window_TDGold.prototype.open = function () {
  this.refresh();
  Window_Selectable.prototype.open.call(this);
};

function Window_TDHealth() {
  this.initialize(...arguments);
}

Window_TDHealth.prototype = Object.create(Window_Selectable.prototype);
Window_TDHealth.prototype.constructor = Window_TDHealth;

Window_TDHealth.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.opacity = 0;
  this.refresh();
};

Window_TDHealth.prototype.colSpacing = function () {
  return 0;
};

Window_TDHealth.prototype.refresh = function () {
  const rect = this.itemLineRect(0);
  this.contents.clear();
  this.contents.fontSize = 22;
  this.drawBackground(-5, 3, 200, 30);
  this.drawText(UFC.UFCTD.CONFIG.crystalName, -10, 0, 200, "center");
  this.drawGaugeRect(0, rect.height, this.innerWidth, 20);
};

Window_TDHealth.prototype.drawBackground = function (x, y, width, height) {
  const color1 = ColorManager.dimColor1();
  const color2 = ColorManager.dimColor2();
  const half = width / 2;
  this.contents.gradientFillRect(x, y, half, height, color2, color1);
  this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
};

Window_TDHealth.prototype.drawGaugeRect = function (x, y, width, height) {
  const rate = this.gaugeRate(
    TowerDefenseManager.getHUDHealthValue,
    TowerDefenseManager.getHUDHealthMaxValue
  );
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  const color0 = ColorManager.gaugeBackColor();
  const color1 = ColorManager.hpGaugeColor1();
  const color2 = ColorManager.hpGaugeColor2();
  this.contents.fillRect(x, y, width, height, color0);
  this.contents.gradientFillRect(x, y, fillW, fillH, color1, color2);
};

Window_TDHealth.prototype.gaugeRate = function (val, max) {
  const value = val;
  const maxValue = max;
  return maxValue > 0 ? value / maxValue : 0;
};

Window_TDHealth.prototype.value = function () {
  return $gameParty.gold();
};

Window_TDHealth.prototype.open = function () {
  this.refresh();
  Window_Selectable.prototype.open.call(this);
};

function Window_TDStatus() {
  this.initialize(...arguments);
}

Window_TDStatus.prototype = Object.create(Window_BaseExtend.prototype);
Window_TDStatus.prototype.constructor = Window_TDStatus;

Window_TDStatus.prototype.initialize = function (rect) {
  Window_BaseExtend.prototype.initialize.call(this, rect);
};

Window_TDStatus.prototype.drawDefaultStatus = function (towerData) {
  this.contents.clear();
  this.contentsBack.clear();
  let x = 0;
  let y = 0;
  let characterImage = ImageManager.loadCharacter(towerData._character);
  let characterIndex = towerData._characterIndex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.6;

  this.contents.blt(
    characterImage,
    sx,
    sy,
    pw,
    ph,
    x,
    y,
    pw * scale,
    ph * scale
  );
  let xCharacter = pw * scale;
  this.contents.fontSize = 23;
  const c1 = ColorManager.itemBackColor1();
  const c2 = ColorManager.itemBackColor2();
  let pad = 2;
  let statusX = xCharacter + pad / 2;
  let w = this.contentsWidth() - xCharacter - pad;
  let h = this.contents.fontSize + 10;
  this.contentsBack.gradientFillRect(statusX, 0, w, h, c1, c2, true);
  this.drawText(towerData._name, statusX, 0, w, "center");

  // let textY = ph * scale + 30;
  let textY = h;
  let textX = statusX;
  let textX2 = 110;
  let textXValue = 20;
  let textHeight = 24;
  let status = ["Attack", "Range", "ASPD", "BSPD"];
  let statusValue = [
    towerData.getBaseAttack,
    towerData.getBaseRange,
    towerData.getBaseAttackSpeed,
    towerData._bulletSpeed,
  ];
  this.contents.fontSize = 14;

  for (let i = 0; i < status.length; i++) {
    this.drawText(
      status[i],
      textX + (i % 2) * (textXValue + textX2),
      textY + Math.floor(i / 2) * textHeight,
      100
    );
  }

  this.changeTextColor(ColorManager.systemColor());
  for (let i = 0; i < statusValue.length; i++) {
    this.drawText(
      statusValue[i],
      textX + (i % 2) * (textXValue + textX2),
      textY + Math.floor(i / 2) * textHeight,
      80,
      "right"
    );
  }
  this.resetTextColor();

  let statusBuff = [];
  let buffSymbol = "+";
  let buffColor = ColorManager.powerUpColor();
  let buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.ATTACK);
  if (towerData.getAttack() < towerData.getBaseAttack) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "";
  }
  statusBuff[0] = {
    value: buffSymbol + buffValue,
    color: buffColor,
  };

  buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.RANGE);
  if (towerData.getRange() < towerData.getBaseRange) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "";
  }
  statusBuff[1] = {
    value: buffSymbol + buffValue,
    color: buffColor,
  };

  buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.ATTACKSPEED);
  if (towerData.getAttackSpeed() > towerData.getBaseAttackSpeed) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "+";
  } else {
    buffSymbol = "-";
  }
  statusBuff[2] = {
    value: buffSymbol + Math.abs(buffValue),
    color: buffColor,
  };

  for (let i = 0; i < statusBuff.length; i++) {
    if (statusBuff[i].value != 0) {
      this.resetTextColor();
      this.changeTextColor(statusBuff[i].color);
      this.drawText(
        statusBuff[i].value,
        textX + 88 + (i % 2) * (textXValue + textX2),
        textY + Math.floor(i / 2) * textHeight,
        150
      );
    }
  }
  this.resetFontSettings();

  //Background Note
  let characterY = ph * scale;
  this.contents.fontSize = 18;
  this.drawText("Note", 0, characterY, 100);

  this.contentsBack.gradientFillRect(
    0,
    characterY + 30,
    this.contentsWidth(),
    this.contentsHeight() - characterY,
    c1,
    c2,
    true
  );

  this.setLineHeight(32);
  let note = `\\FS[${this.contents.fontSize - 3}]\n`;
  if (!towerData._note) note += "\\C[16]None";

  this.drawTextEx(
    note + towerData._note,
    5,
    characterY + 5,
    this.contentsWidth()
  );
  this.resetLineHeight();

  this.resetFontSettings();
};
