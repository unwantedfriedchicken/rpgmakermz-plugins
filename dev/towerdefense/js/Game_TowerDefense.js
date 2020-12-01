function Game_TowerDefense() {
  this.initialize(...arguments);
}

Game_TowerDefense.prototype = Object.create(Game_Character.prototype);
Game_TowerDefense.prototype.constructor = Game_TowerDefense;

Game_TowerDefense.prototype.initialize = function (towerData, mapId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = mapId;
  this._towerData = towerData;
  this._attackTime = 0;
  this._x = this._towerData._x;
  this._y = this._towerData._y;
  this._realX = this._towerData._x;
  this._realY = this._towerData._y;
  this._target = null;
  this._destroy = false;
  this._towerEffectedByAura = [];
  this.getTowerData().checkGetBuffs();
  if (this._towerData.getAuras()) {
    this.addAuraEffects();
  }
};

Game_TowerDefense.prototype.addAuraEffects = function () {
  let towers = $gameMap._events.filter(
    (event) =>
      event instanceof Game_TowerDefense &&
      PIXI.utils.isInRange(
        event._x,
        event._y,
        this._x,
        this._y,
        this._towerData.getRange()
      )
  );
  for (const tower of towers) {
    tower.getTowerData().setBuffs(this._towerData.getAuras());
    this.addTowerEffectedByAura(tower.getTowerData());
  }
};

Game_TowerDefense.prototype.addTowerEffectedByAura = function (tower) {
  this._towerEffectedByAura.push(tower);
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
  if (
    !this._target &&
    $gameMap.ufcEnemies().length > 0 &&
    this._towerData._attack > 0
  ) {
    // Search target
    for (const enemy of $gameMap.ufcEnemies()) {
      if (
        PIXI.utils.isInRange(
          enemy._x,
          enemy._y,
          this._x,
          this._y,
          this._towerData.getRange()
        ) &&
        !enemy.isDestroyed() &&
        enemy.isSameType(this._towerData._attackType)
      ) {
        this._target = enemy;
        break;
      }
    }
  } else if (this._target) {
    if (
      !PIXI.utils.isInRange(
        this._target.x,
        this._target.y,
        this._x,
        this._y,
        this._towerData.getRange()
      ) ||
      this._target.isDestroyed()
    ) {
      // clear target
      this._target = null;
    } else {
      // shoot projectile
      if (this._attackTime <= 0) {
        this._attackTime = this._towerData.getAttackSpeed();
        this.attack(this._target);
      }
    }
  }
};

Game_TowerDefense.prototype.attack = function (enemy) {
  let projectileId = $gameMap.ufcProjectiles();
  // Update bullet
  $gameMap.ufcAddProjectile(
    new Game_ufcProjectile(
      this._x,
      this._y,
      enemy,
      this._towerData.getBulletData(),
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
  $gameMap.ufcDestroyTower(this);

  for (let tower of this._towerEffectedByAura) {
    tower.resetBuffs();
    tower.checkGetBuffs();
  }
  this._towerEffectedByAura = [];
  this._destroy = true;
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
