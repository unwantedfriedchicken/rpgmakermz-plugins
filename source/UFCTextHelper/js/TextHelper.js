function Text_UFCTextHelper() {
  this.initialize(...arguments);
}

Text_UFCTextHelper.prototype = Object.create(PIXI.Text.prototype);
Text_UFCTextHelper.prototype.constructor = Text_UFCTextHelper;

Text_UFCTextHelper.prototype.initialize = function (
  text,
  x,
  y,
  option = {},
  parent = null
) {
  if (!option.style) option.style = {};
  let style = {
    fontFamily: option.style.fontFamily || $gameSystem.mainFontFace(),
    fontSize: option.style.fontSize || UFC.TH.CONFIG.DEFAULT.size,
    fill: option.style.fill || UFC.TH.CONFIG.DEFAULT.color,
    align: option.style.align || "center",
    stroke: option.style.stroke || "#000000",
    strokeThickness: option.style.strokeThickness || 3,
  };
  PIXI.Text.call(this, text, style);
  this._x = x || 0;
  this._y = y || 0;
  this.z = 20;
  this.anchor.set(0.5);
  this.scale.set(0);
  if (!option.animate) option.animate = {};
  this._animate = {
    start: option.animate.start || false,
    time: option.animate.time || 60,
    timeMax: option.animate.time || 60,
    timeScale: option.animate.time / 6 || 60,
    timeScaleMax: option.animate.time / 6 || 60,
    randomX: option.animate.randomX || true,
    destroy: option.animate.destroy || true,
  };

  if (this._animate.randomX) this._x += Math.random() * 0.4 + -0.2;

  if (parent) {
    parent.addChild(this);
  }

  this.x = this.screenX();
  this.y = this.screenY();
};

Text_UFCTextHelper.prototype.update = function () {
  this.updateAnimation();
};

Text_UFCTextHelper.prototype.updateAnimation = function () {
  if (!this._animate || !this._animate.start) return;

  this._animate.time--;
  if (this._animate.time <= 0) {
    this._animate.start = false;
    if (this._animate.destroy) this.destroy();
    return;
  }
  this.y =
    this.screenY() +
    ((this._animate.timeMax - this._animate.time) / this._animate.timeMax) *
      -50;

  let half = this._animate.timeMax / 2;
  if (this._animate.time <= half) this.alpha = this._animate.time / half;

  if (this._animate.timeScale < 0) {
    return;
  }

  let scale = this._animate.timeScale / this._animate.timeScaleMax;
  this.scale.set(1 + scale * 1.3);
  this._animate.timeScale--;
};

Text_UFCTextHelper.prototype.screenX = function () {
  return this._x * $gameMap.tileWidth();
};

Text_UFCTextHelper.prototype.screenY = function () {
  return this._y * $gameMap.tileHeight();
};

Text_UFCTextHelper.prototype.destroy = function () {
  Sprite.prototype.destroy.call(this, { texture: true, baseTexture: true });
};
