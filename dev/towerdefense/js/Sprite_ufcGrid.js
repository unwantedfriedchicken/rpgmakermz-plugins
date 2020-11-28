const Sprite_ufcGrid = function () {
  this.initialize(...arguments);
};

Sprite_ufcGrid.prototype = Object.create(Sprite.prototype);
Sprite_ufcGrid.prototype.constructor = Sprite_ufcGrid;

Sprite_ufcGrid.prototype.initialize = function (data) {
  Sprite.prototype.initialize.call(this, data._bitmap);
  this._data = data;
  // this.bitmap.fillRect(
  //   0,
  //   0,
  //   this.bitmap.width,
  //   this.bitmap.height,
  //   this._gridColor
  // );

  // for (let i = 0; i < $gameMap.width(); i++) {
  //   this.bitmap.clearRect(
  //     this.posX(i) - this._lineSize / 2,
  //     this.posY(0),
  //     this._lineSize,
  //     this.bitmap.height
  //   );
  // }

  // for (let i = 0; i < $gameMap.height(); i++) {
  //   this.bitmap.clearRect(
  //     this.posX(0),
  //     this.posY(i) - this._lineSize / 2,
  //     this.bitmap.width,
  //     this._lineSize
  //   );
  // }

  this.opacity = 60;
  this.z = 20;
  this._data._event.on("showGrid", this.setVisible, this);
  this.setVisible(false);
  // this.setVisible(true);
};

Sprite_ufcGrid.prototype.setVisible = function (visible) {
  this.visible = visible;
};

Sprite_ufcGrid.prototype.update = function () {
  Sprite.prototype.update.call(this);

  this.x = this.screenX(-0.5);
  this.y = this.screenY(-0.5);

  this._data.updateEvents();
};

Sprite_ufcGrid.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Sprite_ufcGrid.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Sprite_ufcGrid.prototype.destroy = function (options) {
  this._data._event.removeListener("showGrid", this.setVisible, this);
  Sprite.prototype.destroy.call(this, options);
};
