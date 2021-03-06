// eslint-disable-next-line no-redeclare
function Sprite_ufcTDTower() {
  this.initialize(...arguments);
}

Sprite_ufcTDTower.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDTower.prototype.constructor = Sprite_ufcTDTower;

Sprite_ufcTDTower.prototype.initialize = function (ufcTD) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(ufcTD);
};

Sprite_ufcTDTower.prototype.initMembers = function (ufcTD) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._tower = ufcTD;
  this._towerData = ufcTD.getTowerData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._range = this._tower.getTowerData().getRange();
  this.resetRangeGraphics();
  this.setCharacterBitmap();
  if (this._towerData._placeMode) this.setSelectPosition();

  // this._towerData._event.on(
  //   "setRangeVisibility",
  //   this.setRangeVisibility,
  //   this
  // );
};

Sprite_ufcTDTower.prototype.resetRangeGraphics = function () {
  let _rangeGraphics = new PIXI.Graphics();
  let _realRange = this._range * 2 + 1;
  if (this._towerData.isHaveAura())
    _rangeGraphics.beginFill(
      UFC.UFCTD.TOWERSETTINGS.auraRangeColor,
      UFC.UFCTD.TOWERSETTINGS.auraRangeOpacity
    );
  else
    _rangeGraphics.beginFill(
      UFC.UFCTD.TOWERSETTINGS.attackRangeColor,
      UFC.UFCTD.TOWERSETTINGS.attackRangeOpacity
    );

  // TODO: Add option for display range grid or plain fill
  // _rangeGraphics.drawRect(
  //   0,
  //   0,
  //   _realRange * $gameMap.tileWidth(),
  //   _realRange * $gameMap.tileHeight()
  // );
  // _rangeGraphics.endFill();

  let lineSize = 6;
  for (let x = 0; x < _realRange; x++) {
    for (let y = 0; y < _realRange; y++) {
      _rangeGraphics.drawRect(
        this.posX(x) + lineSize / 2,
        this.posY(y) + lineSize / 2,
        $gameMap.tileWidth() - lineSize,
        $gameMap.tileHeight() - lineSize
      );
    }
  }

  // TODO: make option for circle radius
  // https://www.redblobgames.com/grids/circle-drawing/
  // https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
  // let pos = {
  //   x: 0,
  //   y: 0,
  // };
  // let radius = this._range;
  // for (let y = -radius; y <= radius; y++) {
  //   let dy = y - pos.y,
  //     dx = Math.floor(Math.sqrt(radius * radius - dy * dy));
  //   let left = pos.x - dx,
  //     right = pos.x + dx;
  //   for (let x = left; x <= right; x++) {
  //     _rangeGraphics.drawRect(
  //       this.posX(x) + lineSize / 2,
  //       this.posY(y) + lineSize / 2,
  //       $gameMap.tileWidth() - lineSize,
  //       $gameMap.tileHeight() - lineSize
  //     );
  //   }
  // }

  _rangeGraphics.endFill();
  let rangeSprite = Graphics.app.renderer.generateTexture(_rangeGraphics);
  if (!this._rangeGraphics) {
    this._rangeGraphics = new PIXI.Sprite(rangeSprite);
    this._rangeGraphics.anchor.x = 0.5;
    this._rangeGraphics.anchor.y = 0.5;
    this._rangeGraphics.x = 0;
    this._rangeGraphics.y = -$gameMap.tileHeight() / 2;
    this.addChild(this._rangeGraphics);
  } else {
    this._rangeGraphics.texture = rangeSprite;
  }
  _rangeGraphics.destroy();
  this._rangeGraphics.visible = false;
};

Sprite_ufcTDTower.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDTower.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDTower.prototype.checkCharacter = function (character) {
  return character == this._tower;
};

Sprite_ufcTDTower.prototype.update = function () {
  Sprite.prototype.update.call(this);
  // console.log(this._towerData.getRangeVisibility);
  if (this._rangeGraphics.visible != this._towerData.getRangeVisibility) {
    this.setRangeVisibility(this._towerData.getRangeVisibility);
  }
  this.updateCharacterFrame();
  if (this._towerData._placeMode) return;
  this.updatePosition();
  if (this._tower.isDestroyed()) this.destroySprite();
  if (Imported.VisuMZ_1_EventsMoveCore) this._tower.update();
};

Sprite_ufcTDTower.prototype.destroySprite = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this.destroy();
};

Sprite_ufcTDTower.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._towerData._character);
  this._isBigCharacter = ImageManager.isBigCharacter(
    this._towerData._character
  );
  this.updateCharacterFrame();
};

Sprite_ufcTDTower.prototype.updatePosition = function () {
  this.x = this._tower.screenX();
  this.y = this._tower.screenY();
  this.z = this._tower.screenZ();
};

Sprite_ufcTDTower.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDTower.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDTower.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDTower.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDTower.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDTower.prototype.characterPatternX = function () {
  return this._tower.pattern();
};

Sprite_ufcTDTower.prototype.characterPatternY = function () {
  return this._tower.getYPattern();
};

Sprite_ufcTDTower.prototype.setRangeVisibility = function (visible) {
  let _range = this._tower.getTowerData().getRange();
  if (visible && this._range != _range) {
    this._range = _range;
    this.resetRangeGraphics();
  }
  this._rangeGraphics.visible = visible;
};

Sprite_ufcTDTower.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

Sprite_ufcTDTower.prototype.posX = function (x) {
  return x * $gameMap.tileWidth();
};

Sprite_ufcTDTower.prototype.posY = function (y) {
  return y * $gameMap.tileHeight();
};

Sprite_ufcTDTower.prototype.destroy = function (options) {
  // this._towerData._event.removeListener(
  //   "setRangeVisibility",
  //   this.setRangeVisibility,
  //   this
  // );
  this._rangeGraphics.destroy({ texture: true, baseTexture: true });
  Sprite.prototype.destroy.call(this, options);
};
