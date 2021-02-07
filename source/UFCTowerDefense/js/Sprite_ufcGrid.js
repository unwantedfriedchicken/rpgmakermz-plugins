// eslint-disable-next-line no-redeclare
function Sprite_ufcGrid() {
  this.initialize(...arguments);
}

Sprite_ufcGrid.prototype = Object.create(Sprite.prototype);
Sprite_ufcGrid.prototype.constructor = Sprite_ufcGrid;

Sprite_ufcGrid.prototype.initialize = function (type) {
  this._gridData = $gameMap.ufcGetGrid();
  Sprite.prototype.initialize.call(this, this._gridData.getBitmapType(type));
  this._type = type;
  switch (this._type) {
    case TowerDefenseManager.TOWERTYPE.TRAP:
      this.opacity = UFC.UFCTD.TOWERSETTINGS.gridTrapColorOpacity;
      break;
    default:
      this.opacity = UFC.UFCTD.TOWERSETTINGS.gridColorOpacity;
  }
  this._gridData._event.on("showGrid", this.setVisible, this);
  this.visible = false;
  this.z = 1;
};

Sprite_ufcGrid.prototype.setVisible = function (visible) {
  if (this._gridData.getType === this._type) {
    this.visible = visible;
  }
};

Sprite_ufcGrid.prototype.update = function () {
  Sprite.prototype.update.call(this);

  this.x = this.screenX(-0.5);
  this.y = this.screenY(-0.5);

  // this._gridData.updateEvents();

  if (this._gridData.isDestroyed()) {
    this.destroy();
  }
};

Sprite_ufcGrid.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Sprite_ufcGrid.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Sprite_ufcGrid.prototype.destroy = function () {
  this._gridData._event.removeListener("showGrid", this.setVisible, this);
  PIXI.Sprite.prototype.destroy.call(this, { children: true, texture: true });
};
