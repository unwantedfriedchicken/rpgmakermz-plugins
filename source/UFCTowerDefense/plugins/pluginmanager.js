UFC.UFCTD.PARAMETERS = PluginManager.parameters("UFCTowerDefense");

UFC.UFCTD.CONFIG = {
  limitAnimation: +UFC.UFCTD.PARAMETERS["setting_limitAnimation"],
  healthVarId: +UFC.UFCTD.PARAMETERS["setting_towerHealthVarId"],
  healthMaxVarId: +UFC.UFCTD.PARAMETERS["setting_towerMaxHealthVarId"],
  gameOverSwitchId: +UFC.UFCTD.PARAMETERS["setting_gameoverSwitchId"],
  crystalName: UFC.UFCTD.PARAMETERS["setting_crystalName"],
  sound: JSON.parse(UFC.UFCTD.PARAMETERS["setting_soundSettings"]),
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
    isHoverGUIShop: false,
    isHoverGUIQuickShop: false,
    isBusy: function () {
      return (
        UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem ||
        UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIShop ||
        UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop
      );
    },
  },
};

UFC.UFCTD.TOWERSETTINGS = {
  animateTower: UFC.UFCTD.PARAMETERS["animateTower"] == "true",
  attackRangeOpacity: +UFC.UFCTD.PARAMETERS["attackRangeOpacity"],
  auraRangeOpacity: +UFC.UFCTD.PARAMETERS["auraRangeOpacity"],
  attackRangeColor: PIXI.utils.string2hex(
    UFC.UFCTD.PARAMETERS["attackRangeColor"]
  ),
  auraRangeColor: PIXI.utils.string2hex(UFC.UFCTD.PARAMETERS["auraRangeColor"]),
  gridColor: UFC.UFCTD.PARAMETERS["gridColor"],
  gridColorOpacity: +UFC.UFCTD.PARAMETERS["gridColorOpacity"] * 255,
  gridTrapColor: UFC.UFCTD.PARAMETERS["gridTrapColor"],
  gridTrapColorOpacity: +UFC.UFCTD.PARAMETERS["gridTrapColorOpacity"] * 255,
};

UFC.UFCTD.ENEMYSETTINGS = {
  enemyHealthUI: UFC.UFCTD.PARAMETERS["enemyHealthUI"],
  enemyHealthWidth: +UFC.UFCTD.PARAMETERS["enemyHealthWidth"],
  enemyHealthHeight: +UFC.UFCTD.PARAMETERS["enemyHealthHeight"],
  enemyHealthColor: PIXI.utils.string2hex(
    UFC.UFCTD.PARAMETERS["enemyHealthColor"]
  ),
  enemyHealthColorOpacity: UFC.UFCTD.PARAMETERS["enemyHealthColorOpacity"],
};

UFC.UFCTD.TOOLTIPSETTINGS = {
  enable: UFC.UFCTD.PARAMETERS["tooltip"] == "true",
  yPosition: +UFC.UFCTD.PARAMETERS["tooltipYPosition"],
  fontSize: +UFC.UFCTD.PARAMETERS["tooltipFontSize"],
  backgroundType: +UFC.UFCTD.PARAMETERS["tooltipBackgroundType"],
};

UFC.UFCTD.SHOPGUISETTINGS = {
  type: UFC.UFCTD.PARAMETERS["shopguiType"],
  enable: UFC.UFCTD.PARAMETERS["shopgui"] == "true",
  defaultItems: JSON.parse(
    UFC.UFCTD.PARAMETERS["shopguiDefaultItems"]
  ).map((item) => [0, +item, 0, 0]),
  itemsEdit: [],
  multiplier: +UFC.UFCTD.PARAMETERS["shopguiMultiplier"],
  roundPrice: +UFC.UFCTD.PARAMETERS["shopguiRoundPrice"],
  iconWidth: +UFC.UFCTD.PARAMETERS["shopguiIconWidth"],
  iconHeight: +UFC.UFCTD.PARAMETERS["shopguiIconHeight"],
  iconXPosition: +UFC.UFCTD.PARAMETERS["shopguiIconXPosition"],
  iconYPosition: +UFC.UFCTD.PARAMETERS["shopguiIconYPosition"],
};

UFC.UFCTD.DEBUGMODE = {
  enable: UFC.UFCTD.PARAMETERS["debugMode"] == "true",
  tickerSpeed: +UFC.UFCTD.PARAMETERS["tickerSpeed"],
  limitAnimation: +UFC.UFCTD.PARAMETERS["limitAnimation"],
};

PluginManager.registerCommand("UFCTowerDefense", "setupEnemy", function (args) {
  args.characterName = $gameMap._events[this._eventId]._characterName;
  args.characterIndex = $gameMap._events[this._eventId]._characterIndex;
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

PluginManager.registerCommand(
  "UFCTowerDefense",
  "disableTowerDefense",
  function (args) {
    let destroyTower = args["destroyTower"] == "true";
    let destroyEnemy = args["destroyEnemy"] == "true";
    let deleteTDItems = args["deleteTDItems"] == "true";
    TowerDefenseManager.disableTowerDefense(
      destroyTower,
      destroyEnemy,
      deleteTDItems
    );
  }
);

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
        enemyType: args["enemyType"],
        onlyEnemy: JSON.parse(args["onlyEnemy"]),
        exceptEnemy: JSON.parse(args["exceptEnemy"]),
      }
    );
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerWait",
  function (args) {
    TowerDefenseManager.addDBTrigger(
      this._mapId,
      this._eventId,
      TowerDefenseManager.TRIGGERTYPE.WAIT,
      {
        duration: +args["duration"],
      }
    );
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "shopGUIItemsEdit",
  function (args) {
    UFC.UFCTD.SHOPGUISETTINGS.itemsEdit = JSON.parse(
      args["items"]
    ).map((item) => [0, +item, 0, 0]);
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "shopGUIItemsReset",
  function () {
    UFC.UFCTD.SHOPGUISETTINGS.itemsEdit = [];
  }
);
