/*:
@target MZ

@plugindesc Add guide action
@author Unwanted Fried Chicken
@url https://unwantedfriedchicken.itch.io
@help
Author: UnwantedFriedChicken
Version: 1.1
Itch.io : https://unwantedfriedchicken.itch.io

Add guide action 

@param blockColor
@text Block Color
@type text
@desc Set the color of blocked action. Default = #e63946
@default #e63946

@param blockColorAlpha
@text Block Color Alpha
@type number
@decimals 1
@min 0
@max 1
@desc Alpha color of blocked action
@default 1.0

@param openColor
@text Open Color
@type text
@desc Set the color of opened action. Default = #5BFF54
@default #5BFF54

@param openColorAlpha
@text Open Color Alpha
@type number
@decimals 1
@min 0
@max 1
@desc Alpha color of opened action
@default 1.0

*/


var Imported = Imported || {};
Imported.UFCGuideAction = true;

var UFC = UFC || {};
UFC.UFCGA = UFC.UFCGA || {};
UFC.UFCGA.VERSION = 1.1;
UFC.UFCGA.ALIAS = UFC.UFCGA.ALIAS || {};

UFC.UFCGA.PARAMETERS = PluginManager.parameters("UFCGuideAction");

UFC.UFCGA.CONFIG = {
  blockColor: PIXI.utils.string2hex(UFC.UFCGA.PARAMETERS["blockColor"]),
  blockColorAlpha: +UFC.UFCGA.PARAMETERS["blockColorAlpha"],
  openColor: PIXI.utils.string2hex(UFC.UFCGA.PARAMETERS["openColor"]),
  openColorAlpha: +UFC.UFCGA.PARAMETERS["openColorAlpha"],
};

function GuideAction() {
  this.initialize(...arguments);
}

GuideAction.prototype.constructor = GuideAction;
GuideAction.prototype.initialize = function () {
  this._mouseMode = false;
  this._tmpMouseData = { x: TouchInput.x, y: TouchInput.y };
  this._mouseTrigger = {
    trigger: false,
    x: 0,
    y: 0,
  };
  this._mouseMoveThreshold = 10;
  this._show = true;
  this._graphics = null;
  this._tileWidth = $gameMap.tileWidth();
  this._tileHeight = $gameMap.tileHeight();
  this._active = false;
  this._perciseMode = true;
  this._blocked = false;
  this._color = {
    color: UFC.UFCGA.CONFIG.openColor,
    alpha: UFC.UFCGA.CONFIG.openColorAlpha,
  };
  this._x = 0;
  this._y = 0;
  this._d = 2;
  this._type = "default";
  this._onlyTerrain = {};
  this._exceptTerrain = {};
  this._onlyRegion = {};
  this._exceptRegion = {};
  this.createSharp();
  this.setVisible(false);
};

Object.defineProperty(GuideAction.prototype, "isMouseMode", {
  get: function () {
    return this._mouseMode;
  },
});

Object.defineProperty(GuideAction.prototype, "getOnlyTerrain", {
  get: function () {
    if (this._onlyTerrain[this._type] === undefined)
      this._onlyTerrain[this._type] = [];
    return this._onlyTerrain[this._type];
  },
});

Object.defineProperty(GuideAction.prototype, "getExceptTerrain", {
  get: function () {
    if (this._exceptTerrain[this._type] === undefined)
      this._exceptTerrain[this._type] = [];
    return this._exceptTerrain[this._type];
  },
});

Object.defineProperty(GuideAction.prototype, "getExceptRegion", {
  get: function () {
    if (this._exceptRegion[this._type] === undefined)
      this._exceptRegion[this._type] = [];
    return this._exceptRegion[this._type];
  },
});

Object.defineProperty(GuideAction.prototype, "getOnlyRegion", {
  get: function () {
    if (this._onlyRegion[this._type] === undefined)
      this._onlyRegion[this._type] = [];
    return this._onlyRegion[this._type];
  },
});

GuideAction.prototype.setType = function (value) {
  this._type = value;
  return this;
};

GuideAction.prototype.setMouseMode = function (mode) {
  this._mouseMode = mode;
};

GuideAction.prototype.setOnlyTerrain = function (terrain) {
  this.getOnlyTerrain.push(...terrain);
};

GuideAction.prototype.setExceptTerrain = function (terrain) {
  this.getExceptTerrain.push(...terrain);
};

GuideAction.prototype.setOnlyRegion = function (terrain) {
  this.getOnlyRegion.push(...terrain);
};

GuideAction.prototype.setExceptRegion = function (terrain) {
  this.getExceptRegion.push(...terrain);
};

GuideAction.prototype.setActive = function (active) {
  if (!active) {
    this.clearMouseEvent();
  }
  this._active = active;
  this.setVisible(active);
};

GuideAction.prototype.isTriggered = function () {
  return this._mouseTrigger.trigger;
};

GuideAction.prototype.clearTrigger = function () {
  this._mouseTrigger.trigger = false;
};

GuideAction.prototype.clearMouseEvent = function () {
  this._mouseMode = false;
  this._tmpMouseData = { x: TouchInput.x, y: TouchInput.y };
  this._graphics.interactive = true;
  this.clearTrigger();
};

GuideAction.prototype.isActive = function () {
  return this._active;
};

GuideAction.prototype.isBlocked = function () {
  return this._blocked;
};

GuideAction.prototype.setBlocked = function (block) {
  if (block === this._blocked) return;
  if (block) {
    this._color.color = UFC.UFCGA.CONFIG.blockColor;
    this._color.alpha = UFC.UFCGA.CONFIG.blockColorAlpha;
  } else {
    this._color.color = UFC.UFCGA.CONFIG.openColor;
    this._color.alpha = UFC.UFCGA.CONFIG.openColorAlpha;
  }
  this.createSharp();
  this._blocked = block;
};

GuideAction.prototype.createSharp = function (shape = "rectangle") {
  if (!this._graphics || this._graphics._destroyed) {
    this._graphics = new PIXI.Graphics();
    this._graphics.pivot.set(0.5);
  } else {
    this._graphics.clear();
    this._graphics.removeAllListeners();
  }
  switch (shape) {
    case "rectangle":
      this._graphics.beginFill(this._color.color, this._color.alpha);
      this._graphics.drawRect(0, 0, this._tileWidth, this._tileHeight);
      this._graphics.endFill();
      break;
  }
  this._graphics.interactive = true;
  this._graphics.on("pointermove", this.onPointerMove, this);
};

GuideAction.prototype.setDirection = function (
  d = this._d,
  x = this._x,
  y = this._y
) {
  if (this.isMouseMode) {
    return;
  }
  this._x = x;
  this._y = y;
  this._d = d;
  if (!this._perciseMode) {
    if (!this.canPass(x, y, d)) this.setVisible(false);
    else this.setVisible(true);
  }
  let offsetY = 6;
  switch (d) {
    case 2:
      this.setPosition(
        $gamePlayer.screenX() + -this._tileWidth / 2,
        $gamePlayer.screenY() + offsetY
      );
      break;
    case 4:
      this.setPosition(
        $gamePlayer.screenX() + -(this._tileWidth / 2) - this._tileWidth,
        $gamePlayer.screenY() + -this._tileHeight + offsetY
      );
      break;
    case 6:
      this.setPosition(
        $gamePlayer.screenX() + this._tileWidth / 2,
        $gamePlayer.screenY() + -this._tileHeight + offsetY
      );
      break;
    case 8:
      this.setPosition(
        $gamePlayer.screenX() + -(this._tileWidth / 2),
        $gamePlayer.screenY() + -this._tileHeight * 2 + offsetY
      );
      break;
  }
};

GuideAction.prototype.setVisible = function (visible) {
  this.getGraphics().visible = visible;
};

GuideAction.prototype.isVisible = function () {
  return this.getGraphics().visible;
};

GuideAction.prototype.setPosition = function (x, y) {
  this.getGraphics().x = x;
  this.getGraphics().y = y;
};

GuideAction.prototype.reset = function () {
  this.createSharp();
  this.setDirection();
  this.setActive(this.isActive());
};

GuideAction.prototype.canPass = function (x, y, d) {
  const x2 = $gameMap.roundXWithDirection(x, d);
  const y2 = $gameMap.roundYWithDirection(y, d);
  if (!$gameMap.isValid(x2, y2)) {
    return false;
  }
  if (!this.isMapPassable(x, y, d)) {
    return false;
  }
  if (this.checkTDTower(x2, y2)) return false;
  if (this.isCollidedWithCharacters(x2, y2)) {
    return false;
  }
  if (this.checkGrid(x2, y2)) {
    return false;
  }

  return true;
};

GuideAction.prototype.canPassMouse = function (x, y) {
  if (!$gameMap.isValid(x, y)) {
    return false;
  }
  if (!$gameMap.checkPassage(x, y, 0x0f)) {
    return false;
  }
  if (this.checkTDTower(x, y)) return false;
  if (this.isCollidedWithCharacters(x, y)) {
    return false;
  }
  if (this.checkGrid(x, y)) {
    return false;
  }

  return true;
};

GuideAction.prototype.checkTDTower = function (x, y) {
  if (!Imported.UFCTowerDefense) return false;
  let towers = $gameMap.checkTDTower(x, y);
  return towers;
};

GuideAction.prototype.checkGrid = function (x, y) {
  if (
    this.getOnlyTerrain.length <= 0 &&
    this.getExceptTerrain.length <= 0 &&
    this.getOnlyRegion.length <= 0 &&
    this.getExceptRegion.length <= 0
  )
    return false;

  let terrainTag = $gameMap.terrainTag(x, y);
  let regionID = $gameMap.regionId(x, y);
  if (
    this.getOnlyTerrain.length <= 0 &&
    this.getOnlyRegion.length <= 0 &&
    (this.getExceptTerrain.length > 0 || this.getExceptRegion.length > 0)
  ) {
    if (
      this.getExceptTerrain.includes(terrainTag) &&
      this.getExceptTerrain.length >= 0
    ) {
      return true;
    }
    if (
      this.getExceptRegion.includes(regionID) &&
      this.getExceptRegion.length >= 0
    ) {
      return true;
    }
    return false;
  }

  if (
    this.getExceptTerrain.includes(terrainTag) &&
    this.getExceptTerrain.length >= 0
  )
    return true;

  if (
    this.getExceptRegion.includes(regionID) &&
    this.getExceptRegion.length >= 0
  )
    return true;

  if (this.getOnlyTerrain.includes(terrainTag)) return false;

  if (this.getOnlyRegion.includes(regionID)) return false;

  return true;
};

GuideAction.prototype.update = function () {
  if (!this.isActive()) return;
  if (this.isMouseMode) {
    if (!this._mouseTrigger.trigger) {
      this._x = $gameMap.canvasToMapX(TouchInput.x);
      this._y = $gameMap.canvasToMapY(TouchInput.y);
      this.setPosition(
        this.screenX(this._x - 0.5),
        this.screenY(this._y - 0.5)
      );
    } else {
      this.setPosition(
        this.screenX(this._mouseTrigger.x - 0.5),
        this.screenY(this._mouseTrigger.y - 0.5)
      );
    }
    if (TouchInput.isTriggered() || TouchInput.isLongPressed()) {
      this._x = $gameMap.canvasToMapX(TouchInput.x);
      this._y = $gameMap.canvasToMapY(TouchInput.y);
      if (this._mouseTrigger.x != this._x || this._mouseTrigger.y != this._y) {
        this._mouseTrigger.trigger = true;
        this._mouseTrigger.x = this._x;
        this._mouseTrigger.y = this._y;
      }
    }
  } else {
    this.setDirection();
  }
  if (this._perciseMode) {
    this.updateBlocked();
  }

  this.updateChild();
};

GuideAction.prototype.updateChild = function () {
  let children = this.getGraphics().children;
  if (children.length > 0) {
    for (const child of children) {
      if (child.update) {
        child.update();
      }
    }
  }
};

GuideAction.prototype.onPointerMove = function (e) {
  if (this.isMouseMode) {
    this._tmpMouseData.x = TouchInput.x;
    this._tmpMouseData.y = TouchInput.y;
    return;
  }
  const dx = Math.abs(TouchInput.x - this._tmpMouseData.x);
  const dy = Math.abs(TouchInput.y - this._tmpMouseData.y);
  if (dx > this._mouseMoveThreshold || dy > this._mouseMoveThreshold) {
    this.setMouseMode(true);
    this._graphics.interactive = false;
  }
};

GuideAction.prototype.updateBlocked = function (doubleCheck = false) {
  if (this.isMouseMode && !doubleCheck) {
    if (!this.canPassMouse(this._x, this._y)) {
      if (!this.isBlocked()) {
        this.setBlocked(true);
      }
    } else if (this.isBlocked()) {
      this.setBlocked(false);
    }
  } else {
    if (doubleCheck) this.getPosition();
    if (!this.canPass(this._x, this._y, this._d)) {
      if (!this.isBlocked()) {
        this.setBlocked(true);
      }
    } else if (this.isBlocked()) {
      this.setBlocked(false);
    }
  }
};

GuideAction.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

GuideAction.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

GuideAction.prototype.isMapPassable = function (x, y, d) {
  const x2 = $gameMap.roundXWithDirection(x, d);
  const y2 = $gameMap.roundYWithDirection(y, d);
  const d2 = this.reverseDir(d);
  return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};

GuideAction.prototype.reverseDir = function (d) {
  return 10 - d;
};

GuideAction.prototype.isDestroyed = function () {
  return this._graphics._destroyed;
};

GuideAction.prototype.getGraphics = function () {
  if (this.isDestroyed()) this.reset();
  return this._graphics;
};

GuideAction.prototype.isCollidedWithCharacters = function (x, y) {
  return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};

GuideAction.prototype.isCollidedWithEvents = function (x, y) {
  const events = $gameMap.eventsXyNt(x, y);
  return events.some((event) => event.isNormalPriority());
};

GuideAction.prototype.isCollidedWithVehicles = function (x, y) {
  return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};

GuideAction.prototype.getPosition = function () {
  this._x = $gamePlayer._x;
  this._y = $gamePlayer._y;
  this._d = $gamePlayer._direction;
  return {
    x: $gameMap.roundXWithDirection(this._x, this._d),
    y: $gameMap.roundYWithDirection(this._y, this._d),
  };
};

function GuideActionManager() {}

GuideActionManager.initialize = function () {
  this._guideAction = new GuideAction();
};

Object.defineProperty(GuideActionManager, "getGuideAction", {
  get: function () {
    return this._guideAction;
  },
});

Object.defineProperty(GuideActionManager, "getGuideActionGraphics", {
  get: function () {
    return this.getGuideAction.getGraphics();
  },
});

UFC.UFCGA.ALIAS._Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function () {
  UFC.UFCGA.ALIAS._Game_Player_update.call(this, ...arguments);
  GuideActionManager.getGuideAction.update();
};

UFC.UFCGA.ALIAS._Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function () {
  UFC.UFCGA.ALIAS._Game_Player_initMembers.call(this, ...arguments);
  GuideActionManager.initialize();
};

UFC.UFCGA.ALIAS._Game_Player_clearTransferInfo =
  Game_Player.prototype.clearTransferInfo;
Game_Player.prototype.clearTransferInfo = function () {
  UFC.UFCGA.ALIAS._Game_Player_clearTransferInfo.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(
    this._direction,
    this._x,
    this._y
  );
};

UFC.UFCGA.ALIAS._Game_Player_setDirection = Game_Player.prototype.setDirection;
Game_Player.prototype.setDirection = function (d) {
  UFC.UFCGA.ALIAS._Game_Player_setDirection.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(d, this._x, this._y);
};

UFC.UFCGA.ALIAS._Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function (d) {
  UFC.UFCGA.ALIAS._Game_Player_moveStraight.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(d, this._x, this._y);
};

UFC.UFCGA.ALIAS._Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function () {
  UFC.UFCGA.ALIAS._Spriteset_Map_createCharacters.call(this, ...arguments);
  this._tilemap.addChild(GuideActionManager.getGuideActionGraphics);
};
