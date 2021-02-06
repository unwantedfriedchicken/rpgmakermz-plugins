// eslint-disable-next-line no-redeclare
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

  if (UFC.UFCTD.TOOLTIPSETTINGS.enable) {
    this.toolTip = new Window_Base(
      new Rectangle(
        0,
        UFC.UFCTD.TOOLTIPSETTINGS.yPosition,
        UFC.UFCTD.HUDGUI.SETTINGS.itemSize,
        60
      )
    );
    this.toolTip.setBackgroundType(UFC.UFCTD.TOOLTIPSETTINGS.backgroundType);
    this.addChild(this.toolTip);
  }

  this.refresh();
};

Window_GUIItemSlot.prototype.moveTooltip = function (index) {
  let tower = this._towers[index];
  if (index == -1 || !tower) {
    this.toolTip.visible = false;
    return;
  }

  this.toolTip.visible = true;
  let fontSize = UFC.UFCTD.TOOLTIPSETTINGS.fontSize;
  this.toolTip.contents.fontSize = fontSize;
  let tooltipWidth = this.toolTip.textWidth(tower.name);
  let tooltipHeight =
    fontSize + $gameSystem.windowPadding() * 2 + this.toolTip.lineHeight() / 2;
  let rectItem = this.itemRect(index);
  this.toolTip.move(
    rectItem.x -
      tooltipWidth / 2 +
      UFC.UFCTD.HUDGUI.SETTINGS.itemSize / 2 -
      this.colSpacing() / 2,
    this.toolTip.y,
    tooltipWidth + $gameSystem.windowPadding() * 2,
    tooltipHeight
  );
  this.toolTip.createContents();
  this.toolTip.setBackgroundType(UFC.UFCTD.TOOLTIPSETTINGS.backgroundType);
  this.toolTip.contents.fontSize = fontSize;
  this.toolTip.contents.drawText(
    tower.name,
    0,
    0,
    tooltipWidth,
    this.toolTip.innerHeight - fontSize * 0.15,
    "center"
  );
};

Window_GUIItemSlot.prototype.select = function (index) {
  if (
    this._index != index &&
    this.toolTip &&
    UFC.UFCTD.TOOLTIPSETTINGS.enable
  ) {
    this.moveTooltip(index);
  }
  Window_Command.prototype.select.call(this, index);
};

Window_GUIItemSlot.prototype.callOkHandler = function () {
  this.activate();
  let tower = this._towers[this.index()];
  if (
    !tower ||
    ($gameMessage.isBusy() && !this._selectKeyboard) ||
    tower.ufcTowerMaterial
  )
    return;
  TowerDefenseManager.gainItem(tower.id, -1);
  TowerDefenseManager.clearSelect();
  TowerDefenseManager.selectTower(tower);
  TowerDefenseManager.selectTowerMode();
  this._selectKeyboard = false;
  $gameMessage.setWindowTower(false);
  this.close();
};

Window_GUIItemSlot.prototype.activeKeyboard = function () {
  $gameMessage.setWindowTower(true);
  this._selectKeyboard = true;
  this.activate();
  this.select(0);
};

Window_GUIItemSlot.prototype.deactiveKeyboard = function () {
  if (UFC.UFCTD.HUDGUI.QUICKSHOP.isOpen()) {
    UFC.UFCTD.HUDGUI.QUICKSHOP.close();
    UFC.UFCTD.HUDGUI.SHOP.selected();
    return;
  }

  this._selectKeyboard = false;
  $gameMessage.setWindowTower(false);
  this.deselect();
  this.deactivate();

  // Deactive Shop Selection
  UFC.UFCTD.HUDGUI.SHOP.deselect();
};

Window_GUIItemSlot.prototype.cursorLeft = function (wrap) {
  if (wrap && this.index() === 0 && UFC.UFCTD.SHOPGUISETTINGS.enable) {
    UFC.UFCTD.HUDGUI.SHOP.selected();
    this.deselect();
    this.deactivate();
    return;
  }

  Window_Command.prototype.cursorLeft.call(this, wrap);
};

Window_GUIItemSlot.prototype.processCursorMove = function () {
  if ($gameMessage.isBusyDefault() || !this.visible) return;

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
      rect.y + (rect.width - size) / 2 + this.rowSpacing() / 2,
      size,
      size
    );
  }
};

Window_GUIItemSlot.prototype.drawItem = function (index) {
  const itemRect = this.itemRect(index);
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
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
  if (
    this.isClosed() ||
    !this.isOpen() ||
    !this.visible ||
    TowerDefenseManager.getState !== TowerDefenseManager.STATE.IDLE
  )
    return;
  if (this.isTouchedInsideFrame()) {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = true;
    this.activate();
  } else {
    if (this._selectKeyboard) return;
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = false;
    this.deselect();
    this.deactivate();
  }
};

Window_GUIItemSlot.prototype.onTouchSelect = function () {
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
    } else if (
      !$gameMessage.isBusy() &&
      !this.visible &&
      TowerDefenseManager.getState == TowerDefenseManager.STATE.IDLE
    ) {
      this.open();
      this.visible = true;
    }
  }
};

Window_GUIItemSlot.prototype.refresh = function () {
  Window_Command.prototype.refresh.call(this);
  this.clearCommandList();
  this.deselect();
  this.makeCommandTowers();
  this.drawAllItems();
};

Window_GUIItemSlot.prototype.makeCommandTowers = function () {
  this._towers = $gameParty.towers();
  this._towers.push(...$gameParty.towersMaterial());
  let length =
    this._towers.length < this.maxCols() ? this.maxCols() : this._towers.length;
  for (let i = 0; i < length; i++) {
    if (this._towers[i]) {
      this.addCommand(
        this._towers[i].name,
        this._towers[i].iconIndex,
        $gameParty.numItems(this._towers[i]),
        true
      );
    } else {
      this.addCommand("", 0, 0, true);
    }
  }
};

Window_GUIItemSlot.prototype.close = function () {
  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }

  UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = false;

  // Also close shop
  if (UFC.UFCTD.SHOPGUISETTINGS.enable) UFC.UFCTD.HUDGUI.SHOP.close();

  Window_Command.prototype.close.call(this);
};

Window_GUIItemSlot.prototype.open = function () {
  for (const child of this.children) {
    if (child.close) {
      child.open();
    }
  }

  // Also close shop
  if (UFC.UFCTD.SHOPGUISETTINGS.enable) UFC.UFCTD.HUDGUI.SHOP.open();

  Window_Command.prototype.open.call(this);
};
