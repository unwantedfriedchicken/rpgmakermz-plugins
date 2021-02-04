// eslint-disable-next-line no-redeclare
function Window_TDShop() {
  this.initialize(...arguments);
}

Window_TDShop.prototype = Object.create(Window_Command.prototype);
Window_TDShop.prototype.constructor = Window_TDShop;

Window_TDShop.prototype.initialize = function () {
  let rect = new Rectangle(
    UFC.UFCTD.SHOPGUISETTINGS.iconXPosition,
    UFC.UFCTD.SHOPGUISETTINGS.iconYPosition +
      Graphics.boxHeight -
      UFC.UFCTD.SHOPGUISETTINGS.iconHeight -
      $gameSystem.windowPadding() * 2 -
      this.itemPadding() / 2,
    UFC.UFCTD.SHOPGUISETTINGS.iconWidth +
      $gameSystem.windowPadding() * 2 +
      this.itemPadding(),
    UFC.UFCTD.SHOPGUISETTINGS.iconHeight +
      $gameSystem.windowPadding() * 2 +
      this.itemPadding()
  );
  Window_Command.prototype.initialize.call(this, rect);

  this.setBackgroundType(2);

  this.addCommand("shop", "TDShopIcon", true);
  this.drawItem(0);
  if (UFC.UFCTD.SHOPGUISETTINGS.type == "Quick Buy") this.createQuickBuy();
};

Window_TDShop.prototype.createQuickBuy = function () {
  let upgradeWidth = 250;
  let upgradeHeight = 250;
  UFC.UFCTD.HUDGUI.QUICKSHOP = new Window_TDShopQuick(
    new Rectangle(0, -upgradeHeight, upgradeWidth, upgradeHeight)
  );
  this.addChild(UFC.UFCTD.HUDGUI.QUICKSHOP);
};

Window_TDShop.prototype.lineHeight = function () {
  return this.innerHeight - this.itemPadding() - this.rowSpacing();
};

Window_TDShop.prototype.maxCols = function () {
  return 1;
};

Window_TDShop.prototype.maxRows = function () {
  return 1;
};

Window_TDShop.prototype.callOkHandler = function () {
  if (UFC.UFCTD.SHOPGUISETTINGS.type == "Quick Buy") {
    if (UFC.UFCTD.HUDGUI.QUICKSHOP.isOpenAndActive()) {
      UFC.UFCTD.HUDGUI.QUICKSHOP.close();
      return;
    }
    if (!this.isTouchOkEnabled()) UFC.UFCTD.HUDGUI.QUICKSHOP.selected();
    else UFC.UFCTD.HUDGUI.QUICKSHOP.deselect();
    UFC.UFCTD.HUDGUI.QUICKSHOP.open();
    UFC.UFCTD.HUDGUI.QUICKSHOP.show();
    UFC.UFCTD.HUDGUI.QUICKSHOP.activate();
  } else {
    let items = UFC.UFCTD.SHOPGUISETTINGS.defaultItems;
    if (UFC.UFCTD.SHOPGUISETTINGS.itemsEdit.length > 0)
      items = UFC.UFCTD.SHOPGUISETTINGS.itemsEdit;
    TowerDefenseManager.openShop(true);
    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(items, true);
  }
};

Window_TDShop.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (this.isClosed()) return;
  if ((this.isTouchedInsideFrame() || this._selected) && !this.active) {
    this.windowHovered(true);
  } else if (!this.isTouchedInsideFrame() && !this._selected && this.active) {
    this.windowHovered(false);
  }
};

Window_TDShop.prototype.windowHovered = function (isHovered) {
  if (isHovered) {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIShop = true;
    this.selected(true);
  } else {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIShop = false;
    this.deactivate();
    this.deselect();
  }
};

Window_TDShop.prototype.addCommand = function (
  name,
  spriteName,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    spriteName: spriteName,
    callback: callback,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_TDShop.prototype.drawItem = function (index) {
  const rect = this.itemRect(index);
  this.drawSprite(this._list[index].spriteName, rect.x, rect.y);
};

Window_TDShop.prototype.drawSprite = function (nameSprite, x, y) {
  const bitmap = ImageManager.loadSystem(nameSprite);
  const pw = UFC.UFCTD.SHOPGUISETTINGS.iconWidth;
  const ph = UFC.UFCTD.SHOPGUISETTINGS.iconHeight;
  this.contentsBack.blt(bitmap, 0, 0, pw, ph, x, y);
};

Window_TDShop.prototype.onTouchSelect = function () {
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

Window_TDShop.prototype.cursorRight = function (wrap) {
  if (wrap && this.index() === 0) {
    this.deselect();
    UFC.UFCTD.HUDGUI.ITEMSLOT.activeKeyboard();
    return;
  }

  Window_Command.prototype.cursorRight.call(this, wrap);
};

Window_TDShop.prototype.selected = function (isHovered = false) {
  this._selected = true;
  this.activate();
  this.select(0);
  if (isHovered) this._selected = false;
};

Window_TDShop.prototype.deselect = function () {
  Window_Command.prototype.deselect.call(this);
  this._selected = false;
  this.deactivate();
};

Window_TDShop.prototype.close = function (wrap) {
  UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIShop = false;
  Window_Command.prototype.close.call(this, wrap);
};
