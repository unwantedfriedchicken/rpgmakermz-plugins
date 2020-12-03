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
  if (!tower) return;
  $gameParty.gainItem($dataItems[tower.id], -1);
  TowerDefenseManager.clearSelect();
  TowerDefenseManager.selectTower(tower);
  TowerDefenseManager.selectTowerMode();
};

Window_GUIItemSlot.prototype.onOk = function () {};

Window_GUIItemSlot.prototype.processCursorMove = function () {
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
  } else {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverHUDItem = false;
    this.select(-1);
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
