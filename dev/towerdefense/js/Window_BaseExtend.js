function Window_BaseExtend() {
  this.initialize(...arguments);
}

Window_BaseExtend.prototype = Object.create(Window_Base.prototype);
Window_BaseExtend.prototype.constructor = Window_BaseExtend;

Window_BaseExtend.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._lineHeight = Window_Base.prototype.lineHeight();
  this._defaultLineHeight = this._lineHeight;
};

Window_BaseExtend.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_BaseExtend.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_BaseExtend.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

Window_BaseExtend.prototype.drawTextEx = function (text, x, y, width, align) {
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

Window_BaseExtend.prototype.clear = function () {
  this.contents.clear();
  this.contentsBack.clear();
};
