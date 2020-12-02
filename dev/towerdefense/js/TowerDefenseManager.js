function TowerDefenseManager() {
  throw new Error("This is a static class");
}

TowerDefenseManager.initialize = function () {
  this._HUDGold = false;
  this._HUDHealth = false;
  this._towerHealthVarId = 0;
  this._towerHealthMaxVarId = 0;
  this._gameoverSwitchId = 0;
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
        $gameVariables.setValue(this._towerHealthVarId, 99999);
        $gameMap.updateHealthHud();
        $gameParty.gainGold(99999999);
        $gameMap.updateGoldHud();
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
  $gameVariables.setValue(this._towerHealthVarId, _curHealth - damage);

  if (_curHealth - damage <= 0) {
    $gameSwitches.setValue(this._gameoverSwitchId, true);
  }

  $gameMap.updateHealthHud();
};

TowerDefenseManager.requestAnimation = function (targets, animation) {
  if (!SceneManager.getSpriteSetMap().checkLimitAnimation())
    $gameTemp.requestAnimation(targets, animation);
};

TowerDefenseManager.showHUDTDGold = function (args) {
  this._HUDGold = args["show"] == "true";
  SceneManager.getScene()._goldWindow.visible = this._HUDGold;
};

TowerDefenseManager.showHUDTDHealth = function (args) {
  this._HUDHealth = args["show"] == "true";
  SceneManager.getScene()._TDHealthWindow.visible = this._HUDHealth;
};

TowerDefenseManager.config = function (args) {
  if (args["onlyTerrain"] != "0") {
    let ot = args["onlyTerrain"].split(",").map(Number);
    $gamePlayer.getGuideAction().setOnlyTerrain(ot);
  }

  if (args["exceptTerrain"] != "0") {
    let ot = args["exceptTerrain"].split(",").map(Number);
    $gamePlayer.getGuideAction().setExceptTerrain(ot);
  }

  if (args["limitAnimation"] != "0") {
    this.setLimitAnimation(+args["limitAnimation"]);
  }

  this._towerHealthVarId = +args["towerHealthVarId"];
  this._towerHealthMaxVarId = +args["towerMaxHealthVarId"];
  $gameMap.updateHealthHud();

  this._gameoverSwitchId = +args["gameoverSwitchId"];

  $gameMap.ufcCalcGrid();

  this.cacheImage();
};

// Cache image that being used in tower data, bullets & character
TowerDefenseManager.cacheImage = function () {
  ImageManager.loadSystem("TDSet");
  for (let image of this._cacheSprite) {
    ImageManager.loadCharacter(image);
  }
};

TowerDefenseManager.actionTower = function (towerData, callback) {
  SceneManager.getScene().getTowerAction().setTower(towerData, callback);
};

TowerDefenseManager.selectTower = function (towerData) {
  this._state = TowerDefenseManager.STATE.BUILD;
  this._selectedUFCTD = new ufcTowerData(towerData);
  this._selectedUFCTD.setPlaceMode(true);
  // Disable Open Menu
  $gameSystem.disableMenu();
};

TowerDefenseManager.cancelSelect = function () {
  $gameParty.gainItem($dataItems[this._selectedUFCTD._id], 1);
  // SFX
  AudioManager.playSe({
    name: "Cancel1",
    volume: 100,
    pitch: 100,
    pan: 0,
  });
  this.clearSelect();
};

TowerDefenseManager.clearSelect = function () {
  this._state = TowerDefenseManager.STATE.IDLE;
  this._selectedUFCTD = null;
  $gameSystem.enableMenu();
  $gamePlayer.getGuideAction().setActive(false);
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

Object.defineProperty(TowerDefenseManager, "getHUDHealthValue", {
  get: function () {
    return $gameVariables.value(this._towerHealthVarId);
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealthMaxValue", {
  get: function () {
    return $gameVariables.value(this._towerHealthMaxVarId);
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
      let dataNote = /<(\w*)(:?)([^>]*)>/g.exec(lines[i]);
      if (dataNote) data[dataNote[1]] = dataNote[3];
    }
  }
  if (data) {
    data.id = itemid;
    data.name = item.name;
    item.ufcTower = data;
    item.ufcTower.bulletanimationid = item.animationId;
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
