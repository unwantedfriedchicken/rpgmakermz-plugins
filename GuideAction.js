/*:
@target MZ

@plugindesc Add guide action
@author Unwanted Fried Chicken

*/
(() => {
  "use strict";
  function GuideAction() {
    this.initialize(...arguments);
  }

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
    this._color = "0x5BFF54";
    this._x = 0;
    this._y = 0;
    this._d = 2;
    this._onlyTerrain = [];
    this._exceptTerrain = [];
    this.createSharp();
    this.setDirection(2); // set direction default to down
    this.setVisible(false);
    this._event = new PIXI.utils.EventEmitter();
  };

  GuideAction.prototype.getMouseMode = function () {
    return this._mouseMode;
  };

  GuideAction.prototype.setMouseMode = function (mode) {
    this._mouseMode = mode;
    this.resetParent();
  };

  GuideAction.prototype.resetParent = function () {
    const _spritesetmap = SceneManager.getSpriteSetMap();
    if (this.getMouseMode()) {
      this._graphics.setParent(_spritesetmap._tilemap);
    } else {
      for (const character of _spritesetmap._characterSprites) {
        if (character._character == $gamePlayer) {
          this._graphics.setParent(character);
          break;
        }
      }
      this.clearMouseEvent();
    }
  };
  GuideAction.prototype.setOnlyTerrain = function (terrain) {
    this._onlyTerrain.push(...terrain);
  };

  GuideAction.prototype.setExceptTerrain = function (terrain) {
    this._exceptTerrain.push(...terrain);
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
    if (block) {
      this._color = "0xe63946";
    } else {
      this._color = "0x5BFF54";
    }
    this.createSharp();
    this._blocked = block;
  };

  GuideAction.prototype.createSharp = function (shape = "rectangle") {
    if (!this._graphics || this._graphics._destroyed) {
      this._graphics = new PIXI.Graphics();
    } else {
      this._graphics.clear();
      this._graphics.removeAllListeners();
    }
    switch (shape) {
      case "rectangle":
        this._graphics.beginFill(this._color);
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
    if (this._mouseMode) {
      return;
    }
    this._x = x;
    this._y = y;
    this._d = d;
    if (!this._perciseMode) {
      if (!this.canPass(x, y, d)) this.setVisible(false);
      else this.setVisible(true);
    }

    switch (d) {
      case 2:
        this.setPosition(-this._tileWidth / 2, 0);
        break;
      case 4:
        this.setPosition(
          -(this._tileWidth / 2) - this._tileWidth,
          -this._tileHeight
        );
        break;
      case 6:
        this.setPosition(this._tileWidth / 2, -this._tileHeight);
        break;
      case 8:
        this.setPosition(-(this._tileWidth / 2), -this._tileHeight * 2);
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
    if (this.isCollidedWithCharacters(x2, y2)) {
      return false;
    }
    if (this.checkTerrainTag(x2, y2)) {
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
    if (this.isCollidedWithCharacters(x, y)) {
      return false;
    }
    if (this.checkTerrainTag(x, y)) {
      return false;
    }
    return true;
  };

  GuideAction.prototype.checkTerrainTag = function (x, y) {
    if (this._onlyTerrain.length <= 0 && this._exceptTerrain.length <= 0)
      return false;

    let terrainTag = $gameMap.terrainTag(x, y);

    if (
      this._exceptTerrain.includes(terrainTag) &&
      this._exceptTerrain.length >= 0
    )
      return true;

    if (this._onlyTerrain.includes(terrainTag)) return false;

    return true;
  };

  GuideAction.prototype.update = function () {
    if (!this.isActive()) return;
    if (this._mouseMode) {
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
        if (
          this._mouseTrigger.x != this._x ||
          this._mouseTrigger.y != this._y
        ) {
          this._mouseTrigger.trigger = true;
          this._mouseTrigger.x = this._x;
          this._mouseTrigger.y = this._y;
        }
      }
    }
    if (this._perciseMode) {
      this.updateBlocked();
    }
    if (this.getGraphics().children.length > 0) {
      const GRAPHICSCHILD = this.getGraphics().children;
      for (let i = 0; i < GRAPHICSCHILD.length; i++) {
        GRAPHICSCHILD[i].update();
      }
    }
  };

  GuideAction.prototype.onPointerMove = function (e) {
    if (this._mouseMode) {
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

  GuideAction.prototype.updateBlocked = function () {
    if (this._mouseMode) {
      if (!this.canPassMouse(this._x, this._y)) {
        if (!this.isBlocked()) {
          this.setBlocked(true);
        }
      } else if (this.isBlocked()) {
        this.setBlocked(false);
      }
    } else {
      if (!this.canPass(this._x, this._y, this._d)) {
        if (!this.isBlocked()) {
          // this.setVisible(false);
          this.setBlocked(true);
        }
      } else if (this.isBlocked()) {
        // this.setVisible(true);
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

  GuideAction.prototype.getOnlyTerrain = function () {
    return this._onlyTerrain;
  };

  GuideAction.prototype.getExceptTerrain = function () {
    return this._exceptTerrain;
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
    // Update to current gameplayer incase the position not updated
    this._x = $gamePlayer._x;
    this._y = $gamePlayer._y;
    this._d = $gamePlayer._direction;
    return {
      x: $gameMap.roundXWithDirection(this._x, this._d),
      y: $gameMap.roundYWithDirection(this._y, this._d),
    };
  };

  const Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function () {
    Game_Player_update.apply(this, arguments);
    this._guideAction.update();
  };

  const Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function () {
    Game_Player_initMembers.apply(this, arguments);
    this._guideAction = new GuideAction();
  };

  const Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
  Game_Player.prototype.clearTransferInfo = function () {
    Game_Player_clearTransferInfo.apply(this, arguments);
    this.getGuideAction().setDirection(this._direction, this._x, this._y);

    // this._guideAction.setActive(false);
  };

  const Game_Player_setDirection = Game_Player.prototype.setDirection;
  Game_Player.prototype.setDirection = function (d) {
    Game_Player_setDirection.apply(this, arguments);
    // console.log($gameMap.isPassable(this._x, this._y, d));
    this._guideAction.setDirection(d, this._x, this._y);
  };

  const Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    Game_Player_moveStraight.apply(this, arguments);
    this._guideAction.setDirection(d, this._x, this._y);
  };

  Game_Player.prototype.getGuideActionGraphics = function () {
    return this._guideAction.getGraphics();
  };

  Game_Player.prototype.getGuideAction = function () {
    return this._guideAction;
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.apply(this, arguments);
  };

  const _Spriteset_Map_createCharacters =
    Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function () {
    _Spriteset_Map_createCharacters.apply(this, arguments);

    this._characterSprites.forEach((character) => {
      if (character._character == $gamePlayer) {
        character.addChild(character._character.getGuideActionGraphics());
      }
    });
  };
})();
