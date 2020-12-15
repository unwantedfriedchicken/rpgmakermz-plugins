function Game_ufcProjectile() {
  this.initialize(...arguments);
}

Game_ufcProjectile.prototype = Object.create(Game_Character.prototype);
Game_ufcProjectile.prototype.constructor = Game_ufcProjectile;

Game_ufcProjectile.prototype.initialize = function (
  spawnLocationX,
  spawnLocationY,
  target,
  bulletData
) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._target = target;
  this._x = spawnLocationX;
  this._y = spawnLocationY;
  this.damage = bulletData.damage;
  this.speed = bulletData.speed;
  this.animationId = bulletData.animationId;
  this.characterName = bulletData.characterName;
  this.characterIndex = bulletData.characterIndex;
  this.characterIndexY = bulletData.characterIndexY;
  this.canvasX = this.screenX(this._x);
  this.canvasY = this.screenY(this._y);
  this.vX = 0;
  this.vY = 0;
  this._destroy = false;
  this.rotation = 180;
  this._distCollide = 38;
  this.setDirection(2);
};

Game_ufcProjectile.prototype.screenX = function (x = this._x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Game_ufcProjectile.prototype.screenY = function (y = this._y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Game_ufcProjectile.prototype.update = function () {
  Game_Character.prototype.update.call(this);
  let targetY = this.screenY(this._target._realY);
  let targetX = this.screenX(this._target._realX);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  this.rotation = Math.atan2(targetY - this.canvasY, targetX - this.canvasX);
  this.vX += Math.cos(this.rotation) * (this.speed / 60);
  this.vY += Math.sin(this.rotation) * (this.speed / 60);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  if (
    PIXI.utils.dist(this.canvasX, this.canvasY, targetX, targetY) <=
      this._distCollide ||
    this._target.isDestroyed()
  ) {
    this.destroy();
  }
};

Game_ufcProjectile.prototype.destroy = function (onlyDestroy = false) {
  if (!onlyDestroy) {
    TowerDefenseManager.requestAnimation([this._target], this.animationId);
    this._target.attacked(this.damage);
  }
  $gameMap.ufcDestroyProjectile(this);
  this._destroy = true;
};

Game_ufcProjectile.prototype.isMoving = function () {
  return true;
};

Game_ufcProjectile.prototype.isDestroyed = function () {
  return this._destroy;
};
