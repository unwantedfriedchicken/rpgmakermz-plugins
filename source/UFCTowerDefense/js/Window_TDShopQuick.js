// eslint-disable-next-line no-redeclare
function Window_TDShopQuick() {
  this.initialize(...arguments);
}

Window_TDShopQuick.prototype = Object.create(Window_Command.prototype);
Window_TDShopQuick.prototype.constructor = Window_TDShopQuick;

Window_TDShopQuick.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
  this._lineHeight = Window_Command.prototype.lineHeight();
  this._selected = false;
  this._defaultLineHeight = this._lineHeight;
  this._listItems = UFC.UFCTD.SHOPGUISETTINGS.defaultItems;
  if (UFC.UFCTD.SHOPGUISETTINGS.itemsEdit.length > 0)
    this._listItems = UFC.UFCTD.SHOPGUISETTINGS.itemsEdit;

  this._listItems = this._listItems.map((item) => {
    let dataItem = Object.assign({}, $dataItems[item[1]]);
    if (UFC.UFCTD.SHOPGUISETTINGS.multiplier != 1) {
      let _price = dataItem.price * UFC.UFCTD.SHOPGUISETTINGS.multiplier;
      if (UFC.UFCTD.SHOPGUISETTINGS.roundPrice != 0) {
        let _pow = Math.pow(10, UFC.UFCTD.SHOPGUISETTINGS.roundPrice);
        _price = Math.ceil(_price / _pow) * _pow;
      }
      dataItem.price = _price;
    }
    return dataItem;
  });
  this._listItems.forEach((item) => {
    this.addCommand(
      item.ufcTower.name,
      item.ufcTower.character,
      item.ufcTower.characterindex,
      true
    );
  });
  this.hide();
  this.close();
};

Window_TDShopQuick.prototype.onCancel = function () {
  this._selected = false;
};

Window_TDShopQuick.prototype.maxCols = function () {
  return 1;
};

Window_TDShopQuick.prototype.itemHeight = function () {
  return 60;
};

Window_TDShopQuick.prototype.close = function () {
  Window_Command.prototype.close.call(this);
  UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop = false;
};

Window_TDShopQuick.prototype.callOkHandler = function () {
  if ($gameParty.gold() < this._listItems[this._index].price) {
    SoundManager.playBuzzer();
    this.activate();
    return;
  }
  this.close();
  $gamePlayer.getGuideAction().resetParent();
  TowerDefenseManager.gainGold(-+this._listItems[this._index].price);
  TowerDefenseManager.clearSelect();
  TowerDefenseManager.selectTower(this._listItems[this._index].ufcTower);
  TowerDefenseManager.selectTowerMode();
  this.deselect();
};

Window_TDShopQuick.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (
    !this.visible ||
    TowerDefenseManager.getState !== TowerDefenseManager.STATE.IDLE ||
    !this.isOpen() // Use not isOpen instead close, because isClosed return true only when _openness <= 0 check rmmz_core
  ) {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop = false;
    return;
  }

  let touchInsideFrame = this.isTouchedInsideFrame(0, 100);
  if (touchInsideFrame) {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop = true;
  } else {
    UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop = false;
  }

  if (!this._selected && this.isOpenAndActive() && !touchInsideFrame) {
    this.windowHovered(false);
  }
};

Window_TDShopQuick.prototype.windowHovered = function () {
  this.deselect();
  this.hide();
  this.close();
};

Window_TDShopQuick.prototype.open = function () {
  SoundManager.playOk();
  this.setBackgroundType(0);
  this.paint();
  Window_Command.prototype.open.call(this);
};

Window_TDShopQuick.prototype.selected = function (isHovered = false) {
  this._selected = true;
  this.activate();
  if (isHovered) this._selected = false;
};

Window_TDShopQuick.prototype.deselect = function () {
  Window_Command.prototype.deselect.call(this);
  UFC.UFCTD.HUDGUI.MESSAGE.isHoverGUIQuickShop = false;
  this._selected = false;
  this.deactivate();
};

Window_TDShopQuick.prototype.addCommand = function (
  name,
  character,
  characterIndex,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    character: character,
    characterIndex: characterIndex,
    callback: callback,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_TDShopQuick.prototype.drawCharacter = function (
  character,
  characterIndex,
  x,
  y
) {
  let characterImage = ImageManager.loadCharacter(character);
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 0.8;
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
};

Window_TDShopQuick.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.drawCharacter(
    this._list[index].character,
    this._list[index].characterIndex,
    rect.x,
    rect.y
  );
  let textY = rect.y - 10;
  this.contents.fontSize = 18;
  this.drawText(this.commandName(index), rect.x + 48, textY, 200);

  textY = rect.y + 13;
  this.drawTextEx(
    "\\FS[18]\\C[14]" +
      this._listItems[index].price +
      "\\C " +
      TextManager.currencyUnit,
    rect.x + 48,
    textY,
    200
  );
};

// Enable sound when cursor hover the button
Window_TDShopQuick.prototype.onTouchSelect = function () {
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

Window_TDShopQuick.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_TDShopQuick.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_TDShopQuick.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

Window_TDShopQuick.prototype.isTouchedInsideFrame = function (
  offsetX = 0,
  offsetY = 0
) {
  const touchPos = new Point(TouchInput.x, TouchInput.y);
  const localPos = this.worldTransform.applyInverse(touchPos);
  let innerRect = new Rectangle(
    this._padding,
    this._padding,
    this.innerWidth + offsetX,
    this.innerHeight + offsetY
  );
  return innerRect.contains(localPos.x, localPos.y);
};
