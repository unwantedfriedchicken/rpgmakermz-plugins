// eslint-disable-next-line no-redeclare
function TowerDefenseManager() {
  throw new Error("This is a static class");
}

TowerDefenseManager.initialize = function () {
  this._active = false;
  this._config = false;
  this._shopOpen = false;
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
    ticker: false,
  };
  // window.addEventListener("keydown", (e) => {}, false);
  window.addEventListener(
    "keyup",
    (e) => {
      if (e.key == 1) {
        if (UFC.UFCTD.DEBUGMODE.ticker) {
          Graphics.app.ticker.speed = 1;
          UFC.UFCTD.DEBUGMODE.ticker = false;
        } else {
          Graphics.app.ticker.speed = UFC.UFCTD.DEBUGMODE.tickerSpeed;
          UFC.UFCTD.DEBUGMODE.ticker = true;
        }
      }
      if (e.key == 2) {
        UFC.UFCTD.DEBUGMODE.CONFIG.showRange = !UFC.UFCTD.DEBUGMODE.CONFIG
          .showRange;
        $gameMap._events
          .filter((event) => event instanceof Game_TDTower)
          .forEach((event) =>
            event
              .getTowerData()
              .setRangeVisibility(UFC.UFCTD.DEBUGMODE.CONFIG.showRange)
          );
      }
      if (e.key == 3) {
        $gameVariables.setValue(UFC.UFCTD.CONFIG.healthVarId, 99999);
        TowerDefenseManager.updateHUDHealth();
        TowerDefenseManager.gainGold(99999999);
      }
      if (e.key == 4) {
        this.setLimitAnimation(UFC.UFCTD.DEBUGMODE.limitAnimation);
      }
      if (e.key == 5 && Imported.UFCTextHelper) {
        for (let i = 1; i < 1000; i++) {
          setTimeout(() => {
            TextHelper.spawnText(i, $gamePlayer._realX, $gamePlayer._realY, {
              animate: {
                start: true,
                time: 60,
              },
            });
          }, i * 50);
        }
      }
    },
    false
  );
};

TowerDefenseManager.TOWERTYPE = {
  TOWER: "tower",
  TRAP: "trap",
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
  WAIT: "wait",
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
  STEAL: "steal",
  CRITICAL: "critical",
};

TowerDefenseManager.UIHEALTHENEMY = {
  SHOW: "show",
  ONLYWHENDAMAGED: "onlyWhenDamaged",
  HIDE: "hide",
};

TowerDefenseManager.setLimitAnimation = function (limit) {
  this._limitAnimation = limit;
};

TowerDefenseManager.attackTrigger = function (damage) {
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
  if (!this.isActive) return;
  this._GUIItemSlot = args["show"] == "true";
  UFC.UFCTD.HUDGUI.ITEMSLOT.visible = this._GUIItemSlot;
  if (UFC.UFCTD.SHOPGUISETTINGS.enable)
    UFC.UFCTD.HUDGUI.SHOP.visible = this._GUIItemSlot;
  if (this._GUIItemSlot) UFC.UFCTD.HUDGUI.ITEMSLOT.open();
  else UFC.UFCTD.HUDGUI.ITEMSLOT.close();
};

TowerDefenseManager.showHUDTDGold = function (args) {
  if (!this.isActive) return;
  this._HUDGold = args["show"] == "true";
  UFC.UFCTD.HUDGUI.GOLDWINDOW.visible = this._HUDGold;
};

TowerDefenseManager.showHUDTDHealth = function (args) {
  if (!this.isActive) return;
  this._HUDHealth = args["show"] == "true";
  UFC.UFCTD.HUDGUI.HEALTHWINDOW.visible = this._HUDHealth;
};

TowerDefenseManager.gainGold = function (gold) {
  $gameParty.gainGold(gold);
  this.updateHUDGold();
};

TowerDefenseManager.gainItem = function (item, amount) {
  $gameParty.gainItem($dataItems[item], amount);
};

TowerDefenseManager.updateHUDGold = function () {
  if (
    !this.isActive ||
    !UFC.UFCTD.HUDGUI.GOLDWINDOW ||
    UFC.UFCTD.HUDGUI.GOLDWINDOW._destroyed
  )
    return;
  UFC.UFCTD.HUDGUI.GOLDWINDOW.refresh();
};

TowerDefenseManager.updateHUDHealth = function () {
  if (
    !this.isActive ||
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
  SceneManager.getScene().createHUDTD();
  let listTowerType = Object.keys(TowerDefenseManager.TOWERTYPE).map(
    (item) => TowerDefenseManager.TOWERTYPE[item]
  );
  $gameMap.setupTDGrid(listTowerType);

  const _spriteSet = SceneManager.getSpriteSetMap();

  for (let type of listTowerType) {
    _spriteSet._tilemap.addChild(new Sprite_ufcGrid(type));
  }

  // Set Terrain Tower
  GuideActionManager.getGuideAction.setType(TowerDefenseManager.TOWERTYPE.TOWER);
  let ot = JSON.parse(args["onlyTerrain"]);
  if (ot && ot.length > 0) {
    ot = ot.map(Number);
    GuideActionManager.getGuideAction.setOnlyTerrain(ot);
  }

  let et = JSON.parse(args["exceptTerrain"]);
  if (et && et.length > 0) {
    et = et.map(Number);
    GuideActionManager.getGuideAction.setExceptTerrain(et);
  }

  // Set Region Tower
  let or = JSON.parse(args["onlyRegionID"]);
  if (or && or.length > 0) {
    or = or.map(Number);
    GuideActionManager.getGuideAction.setOnlyRegion(or);
  }

  let er = JSON.parse(args["exceptRegionID"]);
  if (er && er.length > 0) {
    er = er.map(Number);
    GuideActionManager.getGuideAction.setExceptRegion(er);
  }

  // Set Terrain Trap
  GuideActionManager.getGuideAction.setType(TowerDefenseManager.TOWERTYPE.TRAP);
  let ott = JSON.parse(args["onlyTrapTerrain"]);
  if (ott && ott.length > 0) {
    ott = ott.map(Number);
    GuideActionManager.getGuideAction.setOnlyTerrain(ott);
  }

  let ett = JSON.parse(args["exceptTrapTerrain"]);
  if (ett && ett.length > 0) {
    ett = ett.map(Number);
    GuideActionManager.getGuideAction.setExceptTerrain(ett);
  }

  // Set Region Trap
  let ort = JSON.parse(args["onlyTrapRegionID"]);
  if (ort && ort.length > 0) {
    ort = ort.map(Number);
    GuideActionManager.getGuideAction.setOnlyRegion(ort);
  }

  let ert = JSON.parse(args["exceptTrapRegionID"]);
  if (ert && ert.length > 0) {
    ert = ert.map(Number);
    GuideActionManager.getGuideAction.setExceptRegion(ert);
  }

  if (args["limitAnimation"] != "0") {
    this.setLimitAnimation(+args["limitAnimation"]);
  }

  TowerDefenseManager.setActive(true);
  TowerDefenseManager.updateHUDHealth();
  $gameMap.ufcCalcGrid();

  // Disable Open Menu
  $gameSystem.disableMenu();

  this.cacheImage();

  this._config = true;
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

TowerDefenseManager.disableTowerDefense = function (
  destroyTower = false,
  destroyEnemy = false,
  destroyTDItems = true
) {
  this._config = false;

  this.setActive(false);

  // Destroy HUD
  UFC.UFCTD.HUDGUI.ITEMSLOT.destroy();
  UFC.UFCTD.HUDGUI.GOLDWINDOW.destroy();
  UFC.UFCTD.HUDGUI.HEALTHWINDOW.destroy();
  if (UFC.UFCTD.SHOPGUISETTINGS.enable) UFC.UFCTD.HUDGUI.SHOP.destroy();

  // Destroy Grid
  $gameMap.ufcGetGrid().destroy();

  // Destroy Projectile
  for (const projectile of $gameMap.ufcProjectiles()) {
    projectile.destroy(true);
  }

  // Destroy Tower
  if (destroyTower) {
    let towers = $gameMap._events.filter(
      (event) => event instanceof Game_TDTower
    );
    for (const tower of towers) {
      tower.destroy(true);
    }
  }

  // Destroy Enemy
  if (destroyEnemy) {
    for (let i = 0; i < $gameMap.ufcEnemies().length; i++) {
      $gameMap.ufcEnemies()[i].destroy(true);
      i--;
    }
  }

  // Delete Items
  if (destroyTDItems) {
    $gameParty._towers = {};
  }

  // Enable Open Menu
  $gameSystem.enableMenu();
};

TowerDefenseManager.actionTower = function (towerData, callback) {
  UFC.UFCTD.HUDGUI.TOWERACTION.setTower(towerData, callback);
};

TowerDefenseManager.selectTower = function (towerData) {
  this._state = TowerDefenseManager.STATE.BUILD;
  this._selectedUFCTD = new ufcTowerData(towerData);
  this._selectedUFCTD.setPlaceMode(true);
  GuideActionManager.getGuideAction.setType(this._selectedUFCTD.getType);
};

TowerDefenseManager.cancelSelect = function (sfx = true) {
  this.gainItem(this._selectedUFCTD._id, 1);
  // SFX
  if (sfx)
    AudioManager.playSe({
      name: UFC.UFCTD.CONFIG.sound.towerCancel,
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
  GuideActionManager.getGuideAction.setActive(false);
  if (GuideActionManager.getGuideActionGraphics.children.length > 0)
    GuideActionManager.getGuideActionGraphics.removeChildAt(0);
  $gameMap.ufcGetGrid().setVisible(false);
};

TowerDefenseManager.selectTowerMode = function () {
  const selectedTower = new Sprite_ufcTDTower(
    new Game_TDTower(this.getSelectedTowerData(), $gameMap._mapId)
  );
  selectedTower.setRangeVisibility(true);
  GuideActionManager.getGuideAction.setActive(true);

  GuideActionManager.getGuideActionGraphics.addChild(selectedTower);
  $gameMap
    .ufcGetGrid()
    .setType(this.getSelectedTowerData().getType)
    .setVisible(true);
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
    // parse in here instead in init Game_TDEnemy, so doesnt need to parse again
    switch (data) {
      case "itemDrop":
        enemyData[data] =
          JSON.parse(enemyData[data]).map((item) => JSON.parse(item)) || [];
        break;
      case "resistance":
        enemyData[data] = JSON.parse(enemyData[data]) || [];
        break;
    }
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
  let _gPosition = GuideActionManager.getGuideAction.getPosition();
  this._selectedUFCTD._x = _gPosition.x;
  this._selectedUFCTD._y = _gPosition.y;
  this._selectedUFCTD.setPlaceMode(false);
  $gameMap.ufcAddTower(this._selectedUFCTD);
  this._selectedUFCTD.setRangeVisibility(false);

  UFC.UFCTD.HUDGUI.ITEMSLOT.open();

  this.clearSelect();

  // SFX
  AudioManager.playSe({
    name: UFC.UFCTD.CONFIG.sound.towerPlace,
    volume: 100,
    pitch: 100,
    pan: 0,
  });
};

TowerDefenseManager.openShop = function (open) {
  this._shopOpen = open;
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

Object.defineProperty(TowerDefenseManager, "isActive", {
  get: function () {
    return this._active;
  },
});

Object.defineProperty(TowerDefenseManager, "isConfigured", {
  get: function () {
    return this._config;
  },
});

Object.defineProperty(TowerDefenseManager, "isShopOpen", {
  get: function () {
    return this._shopOpen && this.isActive && UFC.UFCTD.SHOPGUISETTINGS.enable;
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
    if (lines[i].match(/<ufcTDMaterial>/)) item.ufcTowerMaterial = true;

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
    data.iconIndex = item.iconIndex;
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
