const Sprite_ufcTDTower = function () {
  this.initialize(...arguments);
};

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

  this._towerData._event.on(
    "setRangeVisibility",
    this.setRangeVisibility,
    this
  );
};

Sprite_ufcTDTower.prototype.resetRangeGraphics = function () {
  let _rangeGraphics = new PIXI.Graphics();
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
  _rangeGraphics.drawRect(
    0,
    0,
    (this._range * 2 + 1) * $gameMap.tileWidth(),
    (this._range * 2 + 1) * $gameMap.tileHeight()
  );
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
  this.updateCharacterFrame();
  if (this._towerData._placeMode) return;
  this.updatePosition();
  if (this._tower.isDestroyed()) this.destroySprite();
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
  const sx = (this.characterBlockX() + 1) * pw;
  const sy = (this.characterBlockY() + 0) * ph;
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

Sprite_ufcTDTower.prototype.setRangeVisibility = function (visible) {
  if (visible) {
    this._range = this._tower.getTowerData().getRange();
    this.resetRangeGraphics();
  }
  this._rangeGraphics.visible = visible;
};

Sprite_ufcTDTower.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

Sprite_ufcTDTower.prototype.destroy = function (options) {
  this._towerData._event.removeListener(
    "setRangeVisibility",
    this.setRangeVisibility,
    this
  );
  Sprite.prototype.destroy.call(this, options);
};
