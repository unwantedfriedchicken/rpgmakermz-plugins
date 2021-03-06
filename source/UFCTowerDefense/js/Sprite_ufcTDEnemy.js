// eslint-disable-next-line no-redeclare
function Sprite_ufcTDEnemy() {
  this.initialize(...arguments);
}

Sprite_ufcTDEnemy.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemy.prototype.constructor = Sprite_ufcTDEnemy;

Sprite_ufcTDEnemy.prototype.initialize = function (enemyData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(enemyData);
};

Sprite_ufcTDEnemy.prototype.initMembers = function (enemyData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._enemy = enemyData;
  this._enemyData = this._enemy.getEnemyData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._destroy = false;
  this.scale.x = this._enemyData.scale;
  this.scale.y = this._enemyData.scale;
  // this._enemy._event.on("addEffect", this.addEffect, this);
  // this._enemy._event.on("removeEffect", this.removeEffect, this);
  // this._enemy._event.on("updateHealth", this.updateHealthGUI, this);
  this.setCharacterBitmap();

  if (
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthUI !==
    TowerDefenseManager.UIHEALTHENEMY.HIDE
  )
    this.createHealthGUI();
};

Sprite_ufcTDEnemy.prototype.createHealthGUI = function () {
  this._healthGUI = new PIXI.Graphics();
  if (
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthUI ===
    TowerDefenseManager.UIHEALTHENEMY.SHOW
  )
    this.updateHealthGUI();
  this.addChild(this._healthGUI);
};

Sprite_ufcTDEnemy.prototype.updateHealthGUI = function (healthScale = 1) {
  if (!this._healthGUI) return;

  this._healthGUI.clear();
  this._healthGUI.beginFill(
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthColor,
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthColorOpacity
  );
  this._healthGUI.drawRect(
    -UFC.UFCTD.ENEMYSETTINGS.enemyHealthWidth / 2,
    0,
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthWidth * healthScale,
    UFC.UFCTD.ENEMYSETTINGS.enemyHealthHeight
  );
  this._healthGUI.endFill();
};

Sprite_ufcTDEnemy.prototype.destroy = function () {
  // this._enemy._event.removeListener("addEffect", this.addEffect, this);
  // this._enemy._event.removeListener("removeEffect", this.removeEffect, this);
  // this._enemy._event.removeListener("updateHealth", this.updateHealthGUI, this);
  if (this._healthGUI)
    this._healthGUI.destroy({ texture: true, baseTexture: true });
  Sprite.prototype.destroy.call(this);
};

Sprite_ufcTDEnemy.prototype.addEffect = function (effect) {
  let _effect = 0;
  switch (effect) {
    case TowerDefenseManager.EFFECTS.COLD:
      _effect = 10;
      break;
    case TowerDefenseManager.EFFECTS.POISON:
      _effect = 1;
      break;
    case TowerDefenseManager.EFFECTS.STUN:
      _effect = 5;
      break;
    case TowerDefenseManager.EFFECTS.RAGE:
      _effect = 4;
      break;
  }
  this.addChild(new Sprite_ufcTDEnemyEffect(effect, _effect, 0, 25));
};

Sprite_ufcTDEnemy.prototype.removeEffect = function (effect) {
  for (const child of this.children) {
    if (child._name == effect) {
      child.destroy();
      break;
    }
  }
};

Sprite_ufcTDEnemy.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDEnemy.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDEnemy.prototype.checkCharacter = function (character) {
  return character == this._enemy;
};

Sprite_ufcTDEnemy.prototype.update = function () {
  if (this._destroy) {
    // Waiting for animation to get destroyed check towerdefense Spriteset_Map.prototype.removeAnimation
    return;
  }
  Sprite.prototype.update.call(this);
  this.updateEventTmp();
  this.updateCharacterFrame();
  this.updatePosition();
  if (this._enemy.isDestroyed()) {
    this.hide();
  }
  if (!this._enemy.isAnimationPlaying() && this._enemy.isDestroyed()) {
    this.destroyEnemy();
  }
};

Sprite_ufcTDEnemy.prototype.updateEventTmp = function () {
  if (this._enemy._eventTmp.addEffect.length > 0) {
    const effect = this._enemy._eventTmp.addEffect;
    for (let i = 0; i < effect.length; i++) {
      this.addEffect(effect[i]);
      effect.splice(i, 1);
      i--;
    }
  }
  if (this._enemy._eventTmp.removeEffect.length > 0) {
    const effect = this._enemy._eventTmp.removeEffect;
    for (let i = 0; i < effect.length; i++) {
      this.removeEffect(effect[i]);
      effect.splice(i, 1);
      i--;
    }
  }
  if (this._enemy._eventTmp.updateHealth) {
    this.updateHealthGUI(this._enemy._eventTmp.updateHealthValue);
    this._enemy._eventTmp.updateHealth = false;
  }
};
Sprite_ufcTDEnemy.prototype.destroyEnemy = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this._destroy = true;
  // since use request animation, this sprite can't be destroyed immediately
  // so try delete it from targes animation first
  SceneManager.getSpriteSetMap().removeTargetFromAnimation(this);

  this.destroy();
};

Sprite_ufcTDEnemy.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._enemyData.characterName);
  this._isBigCharacter = false;
  this.updateCharacterFrame();
};

Sprite_ufcTDEnemy.prototype.updatePosition = function () {
  this.x = this._enemy.screenX();
  this.y = this._enemy.screenY();
  this.z = this._enemy.screenZ();
};

Sprite_ufcTDEnemy.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDEnemy.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDEnemy.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDEnemy.prototype.characterPatternX = function () {
  return this._enemy.pattern();
};

Sprite_ufcTDEnemy.prototype.characterPatternY = function () {
  return (this._enemy.direction() - 2) / 2;
};

Sprite_ufcTDEnemy.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};
