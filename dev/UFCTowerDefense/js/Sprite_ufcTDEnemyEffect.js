// eslint-disable-next-line no-redeclare
function Sprite_ufcTDEnemyEffect() {
  this.initialize(...arguments);
}

Sprite_ufcTDEnemyEffect.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemyEffect.prototype.constructor = Sprite_ufcTDEnemyEffect;

Sprite_ufcTDEnemyEffect.prototype.initialize = function (
  name,
  stateIndex,
  x,
  y
) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(name, stateIndex, x, y);
  this.loadBitmap();
};

Sprite_ufcTDEnemyEffect.prototype.initMembers = function (
  name,
  stateIndex,
  x = 0,
  y = 0
) {
  this._name = name;
  this._overlayIndex = stateIndex;
  this._animationCount = 0;
  this._pattern = 0;
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this.x = x;
  this.y = y;
};

Sprite_ufcTDEnemyEffect.prototype.loadBitmap = function () {
  this.bitmap = ImageManager.loadSystem("States");
  this.setFrame(0, 0, 0, 0);
};

Sprite_ufcTDEnemyEffect.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this._animationCount++;
  if (this._animationCount >= this.animationWait()) {
    this.updatePattern();
    this.updateFrame();
    this._animationCount = 0;
  }
};

Sprite_ufcTDEnemyEffect.prototype.animationWait = function () {
  return 8;
};

Sprite_ufcTDEnemyEffect.prototype.updatePattern = function () {
  this._pattern++;
  this._pattern %= 8;
};

Sprite_ufcTDEnemyEffect.prototype.updateFrame = function () {
  if (this._overlayIndex > 0) {
    const w = 96;
    const h = 96;
    const sx = this._pattern * w;
    const sy = (this._overlayIndex - 1) * h;
    this.setFrame(sx, sy, w, h);
  } else {
    this.setFrame(0, 0, 0, 0);
  }
};
