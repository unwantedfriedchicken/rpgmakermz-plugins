function Window_TowerActionButton() {
  this.initialize(...arguments);
}

Window_TowerActionButton.prototype = Object.create(
  Window_HorzCommand.prototype
);
Window_TowerActionButton.prototype.constructor = Window_TowerActionButton;

Window_TowerActionButton.prototype.initialize = function (rect) {
  Window_HorzCommand.prototype.initialize.call(this, rect);
  this._towerData = null;
  this._towerDataDestroyCallback = null;
  this.setBackgroundType(0);

  this.setHandler("ok", this.onOk.bind(this));
  this.setHandler("cancel", this.onCancel.bind(this));

  this.statusWindow1 = new Window_BaseExtend(
    new Rectangle(0, -rect.height - 130, 200, rect.height + 130)
  );
  this.addChild(this.statusWindow1);

  this.statusWindow2 = new Window_BaseExtend(
    new Rectangle(
      this.statusWindow1.width,
      -this.statusWindow1.height,
      this.statusWindow1.width,
      this.statusWindow1.height
    )
  );

  this.addChild(this.statusWindow2);

  this.hide();
  this.close();
};

Window_TowerActionButton.prototype.onOk = function () {
  switch (this.index()) {
    // Move
    case 0:
      $gamePlayer.getGuideAction().resetParent();
      TowerDefenseManager.selectTower($dataItems[this._towerData._id].ufcTower);
      TowerDefenseManager.selectTowerMode();
      this._towerDataDestroyCallback();
      break;
    // Upgrade
    case 1:
      if (this._towerData._upgradeId != "?") {
        if ($gameParty.gold() >= this._towerData._upgradePrice) {
          AudioManager.playSe({
            name: "Coin",
            volume: 80,
            pitch: 100,
            pan: 0,
          });
          $gameParty.gainGold(-+this._towerData._upgradePrice);
          $gameMap.updateGoldHud();
          // Upgrade
          $gamePlayer.getGuideAction().resetParent();
          TowerDefenseManager.selectTower(
            $dataItems[this._towerData._upgradeId].ufcTower
          );
          TowerDefenseManager.selectTowerMode();
          TowerDefenseManager.placeTower();
          this._towerDataDestroyCallback();
        } else {
          SoundManager.playBuzzer();
          this.activate();
          return;
        }
      }
      break;
    // Sell
    case 2:
      AudioManager.playSe({
        name: "Coin",
        volume: 80,
        pitch: 100,
        pan: 0,
      });
      $gameParty.gainGold(+this._towerData._sellPrice);
      $gameMap.updateGoldHud();
      this._towerDataDestroyCallback();
      break;
  }
  this.close();
};

Window_TowerActionButton.prototype.close = function () {
  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }
  Window_HorzCommand.prototype.close.call(this);
  $gameMessage.setWindowTower(false);
};

Window_TowerActionButton.prototype.setTower = function (
  ufcTowerData,
  callback
) {
  this._towerData = ufcTowerData;
  this._towerDataDestroyCallback = callback;
  this.refresh();
  this.addCommand("MOVE", 0, true);

  if (this._towerData._upgradeId != "?") {
    this.addCommand(
      "Upgrade " +
        "\\C[14]" +
        this._towerData._upgradePrice +
        "\\C " +
        TextManager.currencyUnit,
      2,
      true
    );
    this.statusWindow2.show();
  } else {
    this.addCommand("Upgrade", 2, false);
    // hide upgrade window
    this.statusWindow2.hide();
  }
  this.addCommand(
    "Sell " +
      "\\C[14]" +
      this._towerData._sellPrice +
      "\\C " +
      TextManager.currencyUnit,
    1
  );
  this.addCommand("Cancel", 3, true);
  this.drawAllItems();
  this.drawTowerStatus(0, 0, "center");
  this.open();
  this.statusWindow1.open();
  this.show();
  this.activate();
  this.select(0);
};

Window_TowerActionButton.prototype.open = function () {
  SoundManager.playOk();
  Window_HorzCommand.prototype.open.call(this);
};

Window_TowerActionButton.prototype.drawTowerStatus = function (x, y, align) {
  let characterImage = ImageManager.loadCharacter(this._towerData._character);
  let characterIndex = this._towerData._characterIndex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.5;
  if (align == "center") {
    x += this.statusWindow1.width / 2;
    x -= (pw * scale) / 2;
    x -= this.statusWindow1.itemPadding();
  }
  this.statusWindow1.contents.blt(
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

  let textY = 100;
  let textX = 10;
  let textHeight = 28;
  let textValueX = 130;
  let fontSize = 17;
  let status = ["Attack", "Range", "Attack Speed", "Bullet Speed"];
  let statusValue = [
    this._towerData._attack,
    this._towerData._range,
    this._towerData._attackSpeed,
    this._towerData._bulletSpeed,
  ];

  this.statusWindow1.contents.fontSize = fontSize + 3;
  this.statusWindow1.drawText(
    this._towerData._name,
    textX,
    ph + 20,
    150,
    "center"
  );

  this.statusWindow1.contents.fontSize = fontSize;
  for (let i = 0; i < status.length; i++) {
    this.statusWindow1.resetTextColor();
    this.statusWindow1.drawText(status[i], textX, textY + i * textHeight, 150);
    this.statusWindow1.changeTextColor(ColorManager.systemColor());
    this.statusWindow1.drawText(
      statusValue[i],
      textX + textValueX,
      textY + i * textHeight,
      150
    );
  }
  this.statusWindow1.resetTextColor();
  this.statusWindow1.drawText(
    "Effect",
    textX,
    textY + status.length * textHeight,
    150
  );

  let effectNote = `\\FS[${fontSize - 3}]\n`;
  if (!this._towerData._effectsNote) effectNote += "\\C[16]None";

  this.statusWindow1.setLineHeight(28);
  this.statusWindow1.drawTextEx(
    effectNote + this._towerData._effectsNote.replace(/\\n/g, "\n"),
    textX,
    textY + status.length * textHeight + 2,
    200
  );
  this.statusWindow1.resetLineHeight();

  this.statusWindow1.resetFontSettings();

  if (this._towerData._upgradeId != "?") {
    let upgradeTowerData = $dataItems[this._towerData._upgradeId].ufcTower;
    characterImage = ImageManager.loadCharacter(upgradeTowerData.character);
    characterIndex = upgradeTowerData.characterindex;
    pw = characterImage.width / 12;
    ph = characterImage.height / 8;
    sx = ((characterIndex % 4) * 3 + 1) * pw;
    sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
    this.statusWindow2.contents.blt(
      characterImage,
      sx,
      sy,
      pw,
      ph,
      x - 8,
      y,
      pw * scale,
      ph * scale
    );

    let statusValue2 = [
      +upgradeTowerData.attack,
      +upgradeTowerData.range,
      +upgradeTowerData.attackspeed,
      +upgradeTowerData.bulletspeed,
    ];

    this.statusWindow2.contents.fontSize = fontSize + 3;
    this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
    this.statusWindow2.drawText("UPGRADE", textX, -10, 150, "center");

    this.statusWindow2.resetTextColor();
    this.statusWindow2.drawText(
      upgradeTowerData.name,
      textX,
      ph + 20,
      150,
      "center"
    );

    this.statusWindow2.contents.fontSize = fontSize;
    for (let i = 0; i < status.length; i++) {
      this.statusWindow2.resetTextColor();
      this.statusWindow2.drawText(
        status[i],
        textX,
        textY + i * textHeight,
        150
      );
      this.statusWindow2.changeTextColor(ColorManager.systemColor());
      if (statusValue[i] > statusValue2[i]) {
        this.statusWindow2.changeTextColor(ColorManager.powerDownColor());
        if (i == 2) {
          this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
        }
      } else if (statusValue[i] < statusValue2[i]) {
        this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
        if (i == 2) {
          this.statusWindow2.changeTextColor(ColorManager.powerDownColor());
        }
      }
      this.statusWindow2.drawText(
        statusValue2[i],
        textX + textValueX,
        textY + i * textHeight,
        150
      );
    }

    this.statusWindow2.resetTextColor();
    this.statusWindow2.drawText(
      "Effect",
      textX,
      textY + status.length * textHeight,
      150
    );
    effectNote = `\\FS[${fontSize - 3}]\n`;
    if (!upgradeTowerData.effectsnote) effectNote += "\\C[16]None";

    this.statusWindow2.setLineHeight(28);
    this.statusWindow2.drawTextEx(
      effectNote + upgradeTowerData.effectsnote.replace(/\\n/g, "\n"),
      textX,
      textY + status.length * textHeight + 2,
      200
    );
    this.statusWindow2.resetLineHeight();
    this.statusWindow2.resetFontSettings();
    this.statusWindow2.open();
  }
};

Window_TowerActionButton.prototype.setMoveCallback = function (callback) {
  this._list[0].callback = callback;
};

Window_TowerActionButton.prototype.onCancel = function () {
  this.close();
};

Window_TowerActionButton.prototype.addCommand = function (
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

Window_TowerActionButton.prototype.drawIconTD = function (index, x, y, align) {
  const bitmap = ImageManager.loadSystem("TDSet");
  const pw = 72;
  const ph = 72;
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
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

Window_TowerActionButton.prototype.drawTextEx = function (
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

Window_TowerActionButton.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  const align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawIconTD(
    this._list[index].icon,
    rect.x - this.itemPadding() * 2,
    rect.y - 30,
    align
  );
  this.drawTextEx(this.commandName(index), rect.x, rect.y + 50, 200, align);
};

// Enable sound when cursor hover the button
Window_TowerActionButton.prototype.onTouchSelect = function (trigger) {
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

Window_TowerActionButton.prototype.update = function () {
  Window_HorzCommand.prototype.update.call(this);
  this.updateChildren();
};

Window_TowerActionButton.prototype.updateChildren = function () {
  for (const child of this.children) {
    if (child.update) {
      child.update();
    }
  }
};
Window_TowerActionButton.prototype.refresh = function () {
  for (const child of this.children) {
    if (child.contents) {
      child.contents.clear();
    }
  }
  Window_HorzCommand.prototype.refresh.call(this);
};

Window_TowerActionButton.prototype.itemHeight = function () {
  return this.height - 24;
};

Window_TowerActionButton.prototype.colSpacing = function () {
  return 20;
};
