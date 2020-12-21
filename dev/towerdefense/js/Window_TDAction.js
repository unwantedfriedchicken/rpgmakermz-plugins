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
  TowerDefenseManager.gainGold(-+this._towerData._upgrade[upgradeIndex].price);
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
      TowerDefenseManager.clearSelect();
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
      TowerDefenseManager.gainGold(+this._towerData._sellPrice);
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
    "\\FS[16]Sell\n\\FS[20]" +
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
