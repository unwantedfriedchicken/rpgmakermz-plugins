// eslint-disable-next-line no-redeclare
function Window_TDGold() {
  this.initialize(...arguments);
}

Window_TDGold.prototype = Object.create(Window_Selectable.prototype);
Window_TDGold.prototype.constructor = Window_TDGold;

Window_TDGold.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_TDGold.prototype.colSpacing = function () {
  return 0;
};

Window_TDGold.prototype.refresh = function () {
  const rect = this.itemLineRect(0);
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  this.contents.clear();
  this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
};

Window_TDGold.prototype.value = function () {
  return $gameParty.gold();
};

Window_TDGold.prototype.currencyUnit = function () {
  return TextManager.currencyUnit;
};

Window_TDGold.prototype.open = function () {
  this.refresh();
  Window_Selectable.prototype.open.call(this);
};
