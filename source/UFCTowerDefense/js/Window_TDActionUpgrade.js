// eslint-disable-next-line no-redeclare
function Window_TDActionUpgrade() {
  this.initialize(...arguments);
}

Window_TDActionUpgrade.prototype = Object.create(Window_Command.prototype);
Window_TDActionUpgrade.prototype.constructor = Window_TDActionUpgrade;

Window_TDActionUpgrade.prototype.initialize = function (rect) {
  Window_Command.prototype.initialize.call(this, rect);
  this._tmpIndex = 0;
  this._lineHeight = Window_Command.prototype.lineHeight();
  this._selected = false;
  this._defaultLineHeight = this._lineHeight;
  this._upgradeData = [];
  let titleHeight = 60;
  this._title = new Window_BaseExtend(
    new Rectangle(0, -titleHeight, this.width, titleHeight)
  );
  this._title.setBackgroundType(2);
  this.addChild(this._title);

  let statusWidth = 360;
  let statusHeight = 240;
  this.status = new Window_TDStatus(
    new Rectangle(this.width, 0, statusWidth, statusHeight)
  );
  this.addChild(this.status);

  this.setHandler("cancel", this.onCancel.bind(this));

  this.setBackgroundType(0);
};

Window_TDActionUpgrade.prototype.onCancel = function () {
  this._selected = false;
  this.windowHovered(false, true);
};

Window_TDActionUpgrade.prototype.maxCols = function () {
  return 1;
};

Window_TDActionUpgrade.prototype.itemHeight = function () {
  let item = 3;
  return this.height / item - (item - 1) * this.rowSpacing();
};

Window_TDActionUpgrade.prototype.close = function () {
  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }
  Window_Command.prototype.close.call(this);
};

Window_TDActionUpgrade.prototype.callOkHandler = function () {
  let upgradeData = this._upgradeData[this.index()];
  if ($gameParty.gold() < upgradeData.price) {
    SoundManager.playBuzzer();
    return;
  }
  if (upgradeData.materials.length > 0) {
    for (let material of upgradeData.materials) {
      let numItem = $gameParty.numItems($dataItems[material.id]);
      if (numItem < material.ammount) {
        SoundManager.playBuzzer();
        return;
      }
    }
    for (let material of upgradeData.materials) {
      TowerDefenseManager.gainItem(material.id, -material.ammount);
    }
  }

  this.emit("upgradeTower", this.index());
  this._selected = false;
  this.deactivate();
};

Window_TDActionUpgrade.prototype.setUpgrade = function (upgradeData) {
  this.refresh();
  this._title.clear();
  this._upgradeData = [];
  this.setLineHeight(28);
  upgradeData.forEach((item) => {
    let upgradeData = {
      data: new ufcTowerData($dataItems[item.id].ufcTower),
      price: item.price,
      materials: item.material,
    };
    this.addCommand(
      "\\FS[20]" +
        upgradeData.data._name +
        "\\FS\n\\FS[18]\\C[14]" +
        upgradeData.price +
        "\\C " +
        TextManager.currencyUnit,
      upgradeData.data._character,
      upgradeData.data._characterIndex,
      true
    );
    this._upgradeData.push(upgradeData);
  });
  this.drawTitle();
  this.drawAllItems();
  this.open();
  this.status.open();
  this.deactivate();
  this.deselect();
};

Window_TDActionUpgrade.prototype.drawTitle = function () {
  const c1 = ColorManager.itemBackColor1();
  const c2 = ColorManager.itemBackColor2();
  let pad = 2;
  let w = this.contentsWidth() - pad;
  let h = this._title.contents.fontSize + 10;
  this._title.contentsBack.gradientFillRect(0, 0, w, h, c1, c2, true);
  this._title.drawText("UPGRADE", 0, 0, w, "center");
  this._title.open();
  this._title.show();
};

Window_TDActionUpgrade.prototype.processTouch = function () {
  Window_Command.prototype.processTouch.call(this);
  if (
    this.isClosed() ||
    !this.visible ||
    TowerDefenseManager.getState !== TowerDefenseManager.STATE.IDLE
  )
    return;
  if ((this.isTouchedInsideFrame() || this._selected) && !this.active) {
    this.windowHovered(true);
  } else if (!this.isTouchedInsideFrame() && !this._selected && this.active) {
    this.windowHovered(false);
  }
};

Window_TDActionUpgrade.prototype.windowHovered = function (
  isHovered,
  emit = true
) {
  if (isHovered) {
    this.activate();
    this.refreshStatus(this.index());
    this._selected = false;
  } else {
    this.deactivate();
    this.deselect();
  }
  if (emit) this.emit("selectUpgradeWindow", isHovered);
};

Window_TDActionUpgrade.prototype.open = function () {
  SoundManager.playOk();
  Window_Command.prototype.open.call(this);
};

Window_TDActionUpgrade.prototype.addCommand = function (
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

Window_TDActionUpgrade.prototype.drawCharacter = function (
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
    x - 4,
    y,
    pw * scale,
    ph * scale
  );
};

Window_TDActionUpgrade.prototype.drawTextEx = function (
  text,
  x,
  y,
  width,
  align
) {
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

Window_TDActionUpgrade.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.drawCharacter(
    this._list[index].character,
    this._list[index].characterIndex,
    rect.x,
    rect.y
  );
  let textY = rect.y - 10;
  this.drawTextEx(this.commandName(index), rect.x + 40, textY, 200);
  if (this._upgradeData[index].materials.length > 0) {
    this.drawMaterials(rect.x, rect.y, this._upgradeData[index].materials);
  }
};

Window_TDActionUpgrade.prototype.drawMaterials = function (x, y, materials) {
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const width = 18;
  const height = 18;
  const offset = 62;
  const offsetIcon = 21;
  const offsetAmmount = 17;
  for (let i = 0; i < materials.length; i++) {
    let material = $dataItems[materials[i].id];
    const sx = (material.iconIndex % 16) * pw;
    const sy = Math.floor(material.iconIndex / 16) * ph;
    const posX = this.width - (offset + i * width + i * offsetIcon);
    const posY = y + 14;
    this.contentsBack.blt(
      bitmap,
      sx,
      sy,
      pw,
      ph,
      posX,
      posY + 5,
      width,
      height
    );
    this.drawText(
      materials[i].ammount,
      posX + offsetAmmount,
      posY,
      width,
      "center"
    );
  }
};

// Enable sound when cursor hover the button
Window_TDActionUpgrade.prototype.onTouchSelect = function () {
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

Window_TDActionUpgrade.prototype.refreshStatus = function () {
  if (this._tmpIndex >= this._upgradeData.length) {
    if (this.index() == -1) this._tmpIndex = 0;
    else this._tmpIndex = this.index();
  }
  this.status.drawDefaultStatus(this._upgradeData[this._tmpIndex].data);
};

Window_TDActionUpgrade.prototype.select = function (index) {
  if (this._tmpIndex !== index && index !== -1 && this.status) {
    this._tmpIndex = index;
    this.refreshStatus();
  }
  Window_Command.prototype.select.call(this, index);
};

Window_TDActionUpgrade.prototype.refresh = function () {
  for (const child of this.children) {
    if (child.contents) {
      child.contents.clear();
      child.contentsBack.clear();
    }
  }
  Window_Command.prototype.refresh.call(this);
};

Window_TDActionUpgrade.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_TDActionUpgrade.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_TDActionUpgrade.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};
