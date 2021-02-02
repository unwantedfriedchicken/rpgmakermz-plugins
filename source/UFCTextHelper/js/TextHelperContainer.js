function Text_UFCContainer() {
  this.initialize(...arguments);
}

Text_UFCContainer.prototype = Object.create(PIXI.Container.prototype);
Text_UFCContainer.prototype.constructor = Text_UFCContainer;

Text_UFCContainer.prototype.initialize = function () {
  PIXI.Container.call(this, ...arguments);
  this._x = 0;
  this._y = 0;
  this.z = 20;
};

Text_UFCContainer.prototype.update = function () {
  this.x = this.screenX(this._x);
  this.y = this.screenY(this._y);

  for (const child of this.children) {
    if (child.update) {
      child.update();
    }
  }
};

Text_UFCContainer.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Text_UFCContainer.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Text_UFCContainer.prototype.destroy = function (option) {
  PIXI.Container.prototype.destroy.call(
    this,
    option || {
      children: true,
      texture: true,
      baseTexture: true,
    }
  );
};
