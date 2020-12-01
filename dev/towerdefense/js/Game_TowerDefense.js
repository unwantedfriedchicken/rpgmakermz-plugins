function Game_TowerDefense() {
  this.initialize(...arguments);
}

Game_TowerDefense.prototype = Object.create(Game_Character.prototype);
Game_TowerDefense.prototype.constructor = Game_TowerDefense;

Game_TowerDefense.prototype.initialize = function (towerData, mapId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = mapId;
  this._towerData = towerData;
  this._bulletData = {
    damage: {
      damage: this._towerData._attack,
      effects: this._towerData._effects,
    },
    speed: +this._towerData._bulletSpeed,
    animationId: this._towerData._bulletAnimationId,
    characterName: this._towerData._bulletCharacterName,
    characterIndex: +this._towerData._bulletCharacterIndex,
    characterIndexY: +this._towerData._bulletCharacterIndexY,
  };
  this._attackTime = 0;
  this._x = this._towerData._x;
  this._y = this._towerData._y;
  this._realX = this._towerData._x;
  this._realY = this._towerData._y;
  this._target = null;
  this._destroy = false;
};

Game_TowerDefense.prototype.getTowerData = function () {
  return this._towerData;
};

Game_TowerDefense.prototype.isStarting = function () {
  return false;
};

Game_TowerDefense.prototype.isTriggerIn = function () {
  return false;
};

Game_TowerDefense.prototype.refresh = function () {
  return false;
};

Game_TowerDefense.prototype.update = function () {
  this._attackTime--;
  if (!this._target && $gameMap.ufcEnemies().length > 0) {
    // Search target
    for (const enemy of $gameMap.ufcEnemies()) {
      if (
        this.isInTowerRange(enemy._x, enemy._y) &&
        !enemy.isDestroyed() &&
        enemy.isSameType(this._towerData._attackType)
      ) {
        this._target = enemy;
        break;
      }
    }
  } else if (this._target) {
    if (
      !this.isInTowerRange(this._target.x, this._target.y) ||
      this._target.isDestroyed()
    ) {
      // clear target
      this._target = null;
    } else {
      // shoot projectile
      if (this._attackTime <= 0) {
        this._attackTime = this._towerData._attackSpeed;
        this.attack(this._target);
      }
    }
  }
};

Game_TowerDefense.prototype.isInTowerRange = function (x, y) {
  return (
    x <= this._x + this._towerData._range &&
    x >= this._x - this._towerData._range &&
    y <= this._y + this._towerData._range &&
    y >= this._y - this._towerData._range
  );
};

Game_TowerDefense.prototype.attack = function (enemy) {
  let projectileId = $gameMap.ufcProjectiles();
  $gameMap.ufcAddProjectile(
    new Game_ufcProjectile(
      this._x,
      this._y,
      enemy,
      this._bulletData,
      projectileId
    )
  );
};

Game_TowerDefense.prototype.destroy = function () {
  AudioManager.playSe({
    name: "Door2",
    volume: 25,
    pitch: 100,
    pan: 0,
  });
  this._destroy = true;
  $gameMap.ufcDestroyTower(this);
};

Game_TowerDefense.prototype.isDestroyed = function () {
  return this._destroy;
};

Game_TowerDefense.prototype.actionTower = function () {
  $gameMessage.setWindowTower(true);
  TowerDefenseManager.actionTower(this._towerData, () => {
    this.destroy(); // Callback for move and upgrade
  });
  return;
};
