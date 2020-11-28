const Sprite_ufcProjectile = function () {
  this.initialize(...arguments);
};

Sprite_ufcProjectile.prototype = Object.create(Sprite.prototype);
Sprite_ufcProjectile.prototype.constructor = Sprite_ufcProjectile;

Sprite_ufcProjectile.prototype.initialize = function (projectileData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(projectileData);
};

Sprite_ufcProjectile.prototype.initMembers = function (projectileData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._projectileData = projectileData;
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this.setCharacterBitmap();
};

Sprite_ufcProjectile.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcProjectile.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcProjectile.prototype.checkCharacter = function (character) {
  return character == this._projectileData;
};

Sprite_ufcProjectile.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  this.updatePosition();

  if (this._projectileData.destroy || !this._projectileData) {
    this.destroy();
  }
};

Sprite_ufcProjectile.prototype.setCharacterBitmap = function () {
  if (this._projectileData.characterName == "?") {
    this.bitmap = ImageManager.loadCharacter("");
  } else {
    this.bitmap = ImageManager.loadCharacter(
      this._projectileData.characterName
    );
  }
  this.updateCharacterFrame();
};

Sprite_ufcProjectile.prototype.updatePosition = function () {
  this.x = this._projectileData.canvasX;
  this.y = this._projectileData.canvasY;
  this.rotation = this._projectileData.rotation + PIXI.DEG_TO_RAD * -90;
};

Sprite_ufcProjectile.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  // this.updateHalfBodySprites();
  // if (this._bushDepth > 0) {
  //   const d = this._bushDepth;
  //   this._upperBody.setFrame(sx, sy, pw, ph - d);
  //   this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
  //   this.setFrame(sx, sy, 0, ph);
  // } else {
  this.setFrame(sx, sy, pw, ph);
  // }
};

Sprite_ufcProjectile.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcProjectile.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcProjectile.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._projectileData.characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcProjectile.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._projectileData.characterIndexY;
    // return Math.floor(index / 4) * 4;
    return index;
  }
};

Sprite_ufcProjectile.prototype.characterPatternX = function () {
  return this._projectileData.pattern();
};

Sprite_ufcProjectile.prototype.characterPatternY = function () {
  return (this._projectileData.direction() - 2) / 2;
};

Sprite_ufcProjectile.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};
