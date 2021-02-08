// eslint-disable-next-line no-redeclare
function Game_TDTower() {
  this.initialize(...arguments);
}

Game_TDTower.prototype = Object.create(Game_Character.prototype);
Game_TDTower.prototype.constructor = Game_TDTower;

Game_TDTower.prototype.initialize = function (
  towerData,
  mapId,
  placeMode = false
) {
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
  this._trapAttack = false;
  this._trapAttackTimeDefault = 60;
  this._trapAttackTime = this._trapAttackTimeDefault;
  if (this._towerData.getType == TowerDefenseManager.TOWERTYPE.TRAP) {
    this._pattern = this._towerData._characterIndexX;
    this._through = this._towerData._through;
    if (this._towerData._through) this.setPriorityType(0);
    if (placeMode) {
      let trap = $gameMap.ufcTraps();
      if (!trap[this._x]) trap[this._x] = [];
      trap[this._x][this._y] = this;
    }
  } else {
    this.checkAura();
  }
};

Game_TDTower.prototype.checkAura = function (resetBuff = false) {
  this._towerEffectedByAura = [];

  // This is used for reset the aura, when load the game
  // because the reference is different
  if (resetBuff) this.getTowerData().resetBuffs();

  // Buffs And Aura From Type Tower
  this.getTowerData().checkGetBuffs();
  if (this.getTowerData().isHaveAura()) {
    this.addAuraEffects();
  }
};

Game_TDTower.prototype.addAuraEffects = function () {
  let towers = $gameMap._events.filter(
    (event) =>
      event instanceof Game_TDTower &&
      event !== this &&
      PIXI.utils.isInRange(
        event._x,
        event._y,
        this._x,
        this._y,
        this.getTowerData().getRange()
      )
  );
  for (const tower of towers) {
    tower.getTowerData().setBuffs(this.getTowerData().getAuras());
    this.addTowerEffectedByAura(tower.getTowerData());
  }
};

Game_TDTower.prototype.addTowerEffectedByAura = function (tower) {
  this._towerEffectedByAura.push(tower);
};

Game_TDTower.prototype.getTowerData = function () {
  return this._towerData;
};

Game_TDTower.prototype.isStarting = function () {
  return false;
};

Game_TDTower.prototype.isTriggerIn = function () {
  return false;
};

Game_TDTower.prototype.refresh = function () {
  return false;
};

Game_TDTower.prototype.update = function () {
  if (this.getTowerData().getType === TowerDefenseManager.TOWERTYPE.TRAP) {
    if (this._trapAttack) {
      this._trapAttackTime--;
      if (this._trapAttackTime <= 0) this._trapAttack = false;
    }
    return;
  }

  if (
    UFC.UFCTD.TOWERSETTINGS.animateTower &&
    this.getTowerData().getType === TowerDefenseManager.TOWERTYPE.TOWER
  )
    Game_Character.prototype.update.call(this);

  this._attackTime--;
  if (
    !this._target &&
    $gameMap.ufcEnemies().length > 0 &&
    this.getTowerData().getBaseAttack > 0
  ) {
    // Search target
    for (const enemy of $gameMap.ufcEnemies()) {
      if (
        PIXI.utils.isInRange(
          enemy._x,
          enemy._y,
          this._x,
          this._y,
          this.getTowerData().getRange()
        ) &&
        !enemy.isDestroyed() &&
        enemy.isSameType(this.getTowerData()._attackType)
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
        this.getTowerData().getRange()
      ) ||
      this._target.isDestroyed()
    ) {
      // clear target
      this._target = null;
    } else {
      // shoot projectile
      if (this._attackTime <= 0) {
        this._attackTime = this.getTowerData().getAttackSpeed();
        this.attack(this._target);
      }
    }
  }
};

Game_TDTower.prototype.attack = function (enemy) {
  let projectileId = $gameMap.ufcProjectiles();
  // Update bullet
  $gameMap.ufcAddProjectile(
    new Game_ufcProjectile(
      this._x,
      this._y,
      enemy,
      this.getTowerData().getBulletData(),
      projectileId
    )
  );
};

Game_TDTower.prototype.attackTrap = function (target) {
  TowerDefenseManager.requestAnimation(
    [target],
    this.getTowerData()._bulletAnimationId
  );
  target.attacked(this.getTowerData().getBulletData().damage);

  this._trapAttack = true;

  if (!this.getTowerData()._durability) return;

  this.getTowerData()._durabilityValue--;
  if (this.getTowerData()._durabilityValue <= 0) {
    this.destroy();
  }
};

Game_TDTower.prototype.attacked = function (attackData) {
  this.getTowerData()._health -= attackData.damage;
  if (this.getTowerData()._health <= 0 && !this._destroy) {
    this.destroy(true);
  }
};

Game_TDTower.prototype.destroy = function (onlyDestroy = false) {
  if (!onlyDestroy) {
    let se = this.getTowerData()._se;
    AudioManager.playSe({
      name: se.Destroy ? se.Destroy : UFC.UFCTD.CONFIG.sound.towerDestroy,
      volume: se.DestroyVolume,
      pitch: 100,
      pan: 0,
    });
  }

  this._destroy = true;
  $gameMap.ufcDestroyTower(this);
  if (this.getTowerData().getType == TowerDefenseManager.TOWERTYPE.TRAP) {
    $gameMap.ufcDestroyTrap(this);
    // TODO: Still notsure if trap tower should effected with aure/buffs or not
    return;
  }

  for (let tower of this._towerEffectedByAura) {
    tower.resetBuffs();
    if (!onlyDestroy) tower.checkGetBuffs();
  }
  this._towerEffectedByAura = [];
};

Game_TDTower.prototype.getYPattern = function () {
  if (this.getTowerData().getType == TowerDefenseManager.TOWERTYPE.TOWER)
    return 0;

  if (!this._trapAttack) return 0;
  else {
    return this.getTowerData()._attackIndexY;
  }
};

Game_TDTower.prototype.isDestroyed = function () {
  return this._destroy;
};

Game_TDTower.prototype.isMoving = function () {
  return true;
};

Game_TDTower.prototype.actionTower = function () {
  $gameMessage.setWindowTower(true);
  TowerDefenseManager.actionTower(this.getTowerData(), () => {
    this.destroy(); // Callback for move and upgrade
  });
};
