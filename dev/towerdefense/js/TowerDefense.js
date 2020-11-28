PluginManager.registerCommand("UFCTowerDefense", "setupEnemy", function (args) {
  args.characterName = $gameMap._events[this._eventId]._characterName;
  args.characterIndex = $gameMap._events[this._eventId]._characterIndex;
  TowerDefenseManager.addDBEnemy(args);
});

PluginManager.registerCommand("UFCTowerDefense", "setSpawn", function (args) {
  // console.log(JSON.stringify($gameMap._events[this._eventId]));
  if (!$dataTDSpawnLocation[this._mapId])
    $dataTDSpawnLocation[this._mapId] = {};

  args._x = $gameMap._events[this._eventId]._x;
  args._y = $gameMap._events[this._eventId]._y;
  $dataTDSpawnLocation[this._mapId][this._eventId] = new ufcTowerSpawnData(
    args
  );
});

PluginManager.registerCommand("UFCTowerDefense", "showGold", function (args) {
  TowerDefenseManager.showHUDTDGold(args);
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "updateHealthHud",
  function () {
    $gameMap.updateHealthHud();
  }
);

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
  TowerDefenseManager.startWave(args);
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "spawnProjectile",
  function (args) {
    TowerDefenseManager.startWave(args);
  }
);

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
    if (!$dataTDTrigger[this._mapId]) {
      $dataTDTrigger[this._mapId] = [];
    }
    let evnt = $gameMap._events[this._eventId];
    if (!$dataTDTrigger[this._mapId][evnt._x]) {
      $dataTDTrigger[this._mapId][evnt._x] = [];
    }
    if (!$dataTDTrigger[this._mapId][evnt._x][evnt._y]) {
      $dataTDTrigger[this._mapId][evnt._x][evnt._y] = {};
    }

    $dataTDTrigger[this._mapId][evnt._x][evnt._y].direction = args["direction"];
    // TowerDefenseManager.addDBMoveTrigger(args);
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerDestroy",
  function (args) {
    if (!$dataTDTrigger[this._mapId]) {
      $dataTDTrigger[this._mapId] = [];
    }
    let evnt = $gameMap._events[this._eventId];
    if (!$dataTDTrigger[this._mapId][evnt._x]) {
      $dataTDTrigger[this._mapId][evnt._x] = [];
    }
    if (!$dataTDTrigger[this._mapId][evnt._x][evnt._y]) {
      $dataTDTrigger[this._mapId][evnt._x][evnt._y] = {};
    }

    $dataTDTrigger[this._mapId][evnt._x][evnt._y].destroy = {
      attack: args["attack"] == "true" ? true : false,
      attackEventId: args["attackEventId"],
      animationId: args["animationId"],
    };
    // TowerDefenseManager.addDBMoveTrigger(args);
  }
);

PIXI.utils.dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

PIXI.utils.randomArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

SceneManager.getScene = function () {
  return this._scene;
};

SceneManager.getSpriteSetMap = function () {
  return this.getScene()._spriteset;
};

const _Datamanager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
  _Datamanager_createGameObjects.call(this);
  TowerDefenseManager.initialize();
};

// Add Status Tower For shop -----------------------------------------
const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
Window_ShopStatus.prototype.refresh = function () {
  _Window_ShopStatus_refresh.call(this);

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

  let effectNote = `\\FS[${fontSize - 3}]\n`;
  if (!towerData.effectsnote) effectNote += "\\C[16]None";

  this.drawTextEx(
    effectNote + towerData.effectsnote.replace(/\\n/g, "\n"),
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

// Add Ignore with name
// const _Window_Command_addCommand = Window_Command.prototype.addCommand;
// Window_Command.prototype.addCommand = function () {
//   _Window_Command_addCommand.call(this, ...arguments);
//   let _l = this._list[this._list.length - 1];
//   if (_l.name.slice(0, 3) == "/ds") {
//     _l.name = _l.name.slice(3);
//     _l.enabled = false;
//   }
// };

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

const _Game_Player_triggerButtonAction =
  Game_Player.prototype.triggerButtonAction;
Game_Player.prototype.triggerButtonAction = function () {
  if (
    Input.isTriggered("ok") &&
    TowerDefenseManager.getState == "build" &&
    !this.getGuideAction().isBlocked()
  ) {
    TowerDefenseManager.placeTower();
    return true;
  }

  if (Input.isTriggered("ok") && this.checkEventTower()) {
    return true;
  }

  return _Game_Player_triggerButtonAction.apply(this, arguments);
};

const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function () {
  if (
    TowerDefenseManager.getState == "build" &&
    this.getInputDirection() > 0 &&
    this.getGuideAction().getMouseMode()
  ) {
    this.getGuideAction().setMouseMode(false);
  }
  _Game_Player_moveByInput.call(this);
};

const _Game_Player_executeMove = Game_Player.prototype.executeMove;
Game_Player.prototype.executeMove = function () {
  if (
    $gameTemp.isDestinationValid() &&
    TowerDefenseManager.getState == "build"
  ) {
    const destX = $gameTemp.destinationX();
    const destY = $gameTemp.destinationY();
    let dist = $gameMap.distance(this.x, this.y, destX, destY);
    if (dist <= 1) {
      this.turnTowardCharacter({ x: destX, y: destY });
      this.getGuideAction().updateBlocked();
      if (!this.getGuideAction().isBlocked()) {
        TowerDefenseManager.placeTower();
        $gameTemp.clearDestination();
      } else {
        this.getGuideAction().clearTrigger();
      }
      return;
    }
  }
  _Game_Player_executeMove.call(this, ...arguments);
};

const _Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function () {
  _Game_Player_update.call(this, ...arguments);

  if (TouchInput.isTriggered() && TowerDefenseManager.getState == "build") {
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);
    if (this.pos(x, y)) {
      let t = this.moveAwayFromHere();
      if (t) $gameTemp.setDestination(x, y);
    }
  }
};

// Touch input, check event there (check function Game_Player.prototype.triggerTouchAction)
const _Game_Player_triggerTouchActionD2 =
  Game_Player.prototype.triggerTouchActionD2;
Game_Player.prototype.triggerTouchActionD2 = function (x2, y2) {
  if (this.checkEventTower(x2, y2)) return true;

  return _Game_Player_triggerTouchActionD2.call(this, ...arguments);
};

Game_Player.prototype.checkEventTower = function (x, y) {
  if (TowerDefenseManager.getState != "idle") return;
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
//   ImageManager.loadSystem("TDSet");
// };

const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function () {
  _Scene_Map_updateCallMenu.call(this);
  if (
    !this.isMenuEnabled() &&
    TowerDefenseManager.getState == "build" &&
    this.isMenuCalled()
  ) {
    TowerDefenseManager.cancelSelect();
  }
};

var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  _Scene_Map_createAllWindows.call(this);
  this.createGoldWindow();
  this.createTowerActionButtonWindow();
  this.createTDHealth();
};

// ----------------------------------- HUD --------------------------------
Scene_Map.prototype.createTDHealth = function () {
  let windowWidth = 200;
  this._TDHealthWindow = new Window_TDHealth(
    new Rectangle(Graphics.boxWidth / 2 - windowWidth / 2, -10, windowWidth, 80)
  );
  this.addWindow(this._TDHealthWindow);
  this._TDHealthWindow.visible = TowerDefenseManager.getHUDHealth;
};

Scene_Map.prototype.createGoldWindow = function () {
  this._goldWindow = new Window_Gold(
    new Rectangle(0, 0, 200, this.calcWindowHeight(1, true))
  );
  this.addWindow(this._goldWindow);
  this._goldWindow.visible = TowerDefenseManager.getHUDGold;
};

Scene_Map.prototype.createTowerActionButtonWindow = function () {
  this._towerActionButton = new Window_TowerActionButton(
    new Rectangle(100, Graphics.boxHeight - 200, Graphics.boxWidth - 200, 200)
  );
  this.addWindow(this._towerActionButton);
};

Scene_Map.prototype.getTowerAction = function () {
  return this._towerActionButton;
};
// ----------------------------------- End HUD -------------------------

const _Scene_ItemBase_applyItem = Scene_ItemBase.prototype.applyItem;
Scene_ItemBase.prototype.applyItem = function () {
  _Scene_ItemBase_applyItem.apply(this, arguments);
  if (this.item().ufcTower) {
    TowerDefenseManager.selectTower(this.item().ufcTower);
    SceneManager.goto(Scene_Map);
  }
};

// Change Gold
const _Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
Game_Interpreter.prototype.command125 = function () {
  _Game_Interpreter_command125.apply(this, arguments);
  $gameMap.updateGoldHud();
  return true;
};

// variable to make message busy
const _Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  _Game_Message_clear.call(this);
  this._windowTowerActionShow = false;
};

const _Game_Message_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
  return this._windowTowerActionShow || _Game_Message_isBusy.call(this);
};

Game_Message.prototype.setWindowTower = function (showTower) {
  this._windowTowerActionShow = showTower;
};

const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function () {
  _Game_Map_initialize.apply(this, arguments);
  this._towerDefenseList = [];
  this._towerDefenseWave = [];
  this._towerDefenseEnemy = [];
  this._towerDefenseProjectile = [];
  this._towerDefenseGrid = null;
};

const _Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
  _Game_Map_setup.call(this, mapId);
  this._towerDefenseGrid = new Data_ufcGrid();
};

Game_Map.prototype.ufcGetGrid = function () {
  return this._towerDefenseGrid;
};

Game_Map.prototype.ufcCalcGrid = function () {
  this.ufcGetGrid().calcGrid();
};

Game_Map.prototype.updateGoldHud = function () {
  SceneManager.getScene()._goldWindow.refresh();
};

Game_Map.prototype.updateHealthHud = function () {
  SceneManager.getScene()._TDHealthWindow.refresh();
};

Game_Map.prototype.ufcGetTowerDefenseList = function () {
  return this._towerDefenseList;
};

Game_Map.prototype.ufcTowerAction = function (towerData) {
  SceneManager.getScene().getTowerAction().setTower(towerData);
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
    new Game_TDEnemy(enemyName, spawnId, this.ufcEnemies().length)
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

const _Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function (sceneActive) {
  _Game_Map_update.call(this, sceneActive);
  this.updateTowerDefenseWave();
  this.updateTowerDefenseEnemy();
  this.updateProjectile();
};

Game_Map.prototype.updateTowerDefenseWave = function () {
  if (this._towerDefenseWave.length > 0) {
    let td = this._towerDefenseWave;
    for (let i = 0; i < td.length; i++) {
      if (td[i]._delay > 0) {
        td[i]._delay--;
        continue;
      }
      if (!td[i]._start) {
        td[i]._start = true;
        if (td[i]._startSE != "0") {
          AudioManager.playSe({
            name: td[i]._startSE,
            volume: td[i]._startSEVolume,
            pitch: 100,
            pan: 0,
          });
        }
      }
      // console.log("time:", td[i]._timeSpawn);
      td[i]._timeSpawn--;
      if (td[i]._timeSpawn <= 0) {
        this.ufcSpawnEnemy(td[i]._enemy, td[i]._spawnLocationId);
        console.log("spawn", $dataTDEnemy[td[i]._enemy].name);
        td[i]._timeSpawn = td[i]._delayPerSpawn;
        td[i]._numberSpawn--;
        if (td[i]._numberSpawn <= 0) {
          console.log("spawn complete");
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
    if (!projectile.destroy) projectile.update();
  }
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
      }
    }
  }
};

const _Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;

Spriteset_Map.prototype.createCharacters = function () {
  _Spriteset_Map_createCharacters.apply(this, arguments);

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

  // $gameMap._towerDefenseGrid.setParent(this._tilemap);
  this._tilemap.addChild(new Sprite_ufcGrid($gameMap.ufcGetGrid()));
  if (TowerDefenseManager.getState != "idle") {
    TowerDefenseManager.selectTowerMode();
  }
};
