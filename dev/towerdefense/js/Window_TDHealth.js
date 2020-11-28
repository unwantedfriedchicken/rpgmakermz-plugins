function Window_TDHealth() {
  this.initialize(...arguments);
}

Window_TDHealth.prototype = Object.create(Window_Selectable.prototype);
Window_TDHealth.prototype.constructor = Window_TDHealth;

Window_TDHealth.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.opacity = 0;
  this.refresh();
};

Window_TDHealth.prototype.colSpacing = function () {
  return 0;
};

Window_TDHealth.prototype.refresh = function () {
  const rect = this.itemLineRect(0);
  this.contents.clear();
  this.contents.fontSize = 22;
  this.drawBackground(-5, 3, 200, 30);
  this.drawText("Crystal Health", -10, 0, 200, "center");
  this.drawGaugeRect(0, rect.height, this.innerWidth, 20);
};

Window_TDHealth.prototype.drawBackground = function (x, y, width, height) {
  const color1 = ColorManager.dimColor1();
  const color2 = ColorManager.dimColor2();
  const half = width / 2;
  this.contents.gradientFillRect(x, y, half, height, color2, color1);
  this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
};

Window_TDHealth.prototype.drawGaugeRect = function (x, y, width, height) {
  const rate = this.gaugeRate(
    TowerDefenseManager.getHUDHealthValue,
    TowerDefenseManager.getHUDHealthMaxValue
  );
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  const color0 = ColorManager.gaugeBackColor();
  const color1 = ColorManager.hpGaugeColor1();
  const color2 = ColorManager.hpGaugeColor2();
  this.contents.fillRect(x, y, width, height, color0);
  this.contents.gradientFillRect(x, y, fillW, fillH, color1, color2);
};

Window_TDHealth.prototype.gaugeRate = function (val, max) {
  const value = val;
  const maxValue = max;
  return maxValue > 0 ? value / maxValue : 0;
};

Window_TDHealth.prototype.value = function () {
  return $gameParty.gold();
};

Window_TDHealth.prototype.open = function () {
  this.refresh();
  Window_Selectable.prototype.open.call(this);
};
