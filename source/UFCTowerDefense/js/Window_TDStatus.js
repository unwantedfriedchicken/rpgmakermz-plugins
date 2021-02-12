// eslint-disable-next-line no-redeclare
function Window_TDStatus() {
  this.initialize(...arguments);
}

Window_TDStatus.prototype = Object.create(Window_BaseExtend.prototype);
Window_TDStatus.prototype.constructor = Window_TDStatus;

Window_TDStatus.prototype.initialize = function (rect) {
  Window_BaseExtend.prototype.initialize.call(this, rect);
};

Window_TDStatus.prototype.drawDefaultStatus = function (towerData) {
  this.contents.clear();
  this.contentsBack.clear();

  // Character Image
  let x = 0;
  let y = 0;
  let characterImage = ImageManager.loadCharacter(towerData._character);
  let characterIndex = towerData._characterIndex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.6;

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

  // Name Character
  let xCharacter = pw * scale;
  this.contents.fontSize = 23;
  const c1 = ColorManager.itemBackColor1();
  const c2 = ColorManager.itemBackColor2();
  let pad = 2;
  let statusX = xCharacter + pad / 2;
  let w = this.contentsWidth() - xCharacter - pad;
  let h = this.contents.fontSize + 10;
  this.contentsBack.gradientFillRect(statusX, 0, w, h, c1, c2, true);
  this.drawText(towerData._name, statusX, 0, w, "center");

  // let textY = ph * scale + 30;
  let textY = h - 4;
  let textX = statusX + 10;
  let textX2 = 62;
  let textYValue = 20;
  let textHeight = 0;
  let status, statusValue;
  if (towerData.getType === TowerDefenseManager.TOWERTYPE.TOWER) {
    status = ["Attack", "Range", "ASPD", "ATK Type"];
    statusValue = [
      towerData.getBaseAttack,
      towerData.getBaseRange,
      towerData.getBaseAttackSpeed,
      towerData.getAttackTypeAsName,
    ];
  } else if (towerData.getType === TowerDefenseManager.TOWERTYPE.TRAP) {
    if (towerData._through) {
      status = [
        "Attack",
        "Trap Type",
        towerData._durability ? "Durability" : "",
        "",
      ];
      statusValue = [
        towerData.getBaseAttack,
        towerData.getAttackTypeAsName,
        towerData._durability ? towerData._durabilityValue : "",
        "",
      ];
    } else {
      status = ["Attack", "Health", "Trap Type", ""];
      statusValue = [
        towerData.getBaseAttack,
        towerData._health,
        towerData.getAttackTypeAsName,
        "",
      ];
    }
  }

  // Draw title Status
  this.contents.fontSize = 12;
  this.changeTextColor(ColorManager.systemColor());
  for (let i = 0; i < status.length; i++) {
    this.drawText(status[i], textX + i * textX2, textY + textHeight, 100);
  }

  this.contents.fontSize = 18;
  // Draw title Status value
  this.resetTextColor();
  for (let i = 0; i < statusValue.length; i++) {
    this.drawText(
      statusValue[i],
      textX + i * textX2,
      textY + textHeight + textYValue,
      80
    );
  }
  this.resetTextColor();

  let buffY = 40;
  let statusBuff = [];
  let buffSymbol = "+";
  let buffColor = ColorManager.powerUpColor();
  let buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.ATTACK);
  if (towerData.getAttack() < towerData.getBaseAttack) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "";
  }
  statusBuff[0] = {
    value: buffSymbol + buffValue,
    color: buffColor,
  };

  buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.RANGE);
  if (towerData.getRange() < towerData.getBaseRange) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "";
  }
  statusBuff[1] = {
    value: buffSymbol + buffValue,
    color: buffColor,
  };

  buffValue = towerData.getBuffs(TowerDefenseManager.AURATYPE.ATTACKSPEED);
  if (towerData.getAttackSpeed() > towerData.getBaseAttackSpeed) {
    buffColor = ColorManager.powerDownColor();
    buffSymbol = "+";
  } else {
    buffSymbol = "-";
  }
  statusBuff[2] = {
    value: buffSymbol + Math.abs(buffValue),
    color: buffColor,
  };

  for (let i = 0; i < statusBuff.length; i++) {
    if (statusBuff[i].value != 0) {
      this.resetTextColor();
      this.changeTextColor(statusBuff[i].color);
      this.drawText(
        statusBuff[i].value,
        textX + i * textX2,
        textY + textHeight + buffY,
        150
      );
    }
  }
  this.resetFontSettings();

  //Background Note
  let characterY = ph * scale;
  this.contents.fontSize = 18;
  this.drawText("Note", 0, characterY, 100);

  this.contentsBack.gradientFillRect(
    0,
    characterY + 30,
    this.contentsWidth(),
    this.contentsHeight() - characterY,
    c1,
    c2,
    true
  );

  this.setLineHeight(32);
  let note = `\\FS[${this.contents.fontSize - 3}]\n`;
  if (!towerData._note) note += "\\C[16]None";

  this.drawTextEx(
    note + towerData._note,
    5,
    characterY + 5,
    this.contentsWidth()
  );
  this.resetLineHeight();

  this.resetFontSettings();
};
