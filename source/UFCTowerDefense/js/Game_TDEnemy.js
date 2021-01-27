// eslint-disable-next-line no-redeclare
function Game_TDEnemy() {
  this.initialize(...arguments);
}

Game_TDEnemy.prototype = Object.create(Game_Character.prototype);
Game_TDEnemy.prototype.constructor = Game_TDEnemy;

Game_TDEnemy.prototype.initialize = function (enemyName, spawnId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._enemyData = Object.assign({}, $dataTDEnemy[enemyName]);
  this._enemyData.maxHealth = this._enemyData.health;
  this._resistance = this._enemyData.resistance;
  this._itemDrop = this._enemyData.itemDrop;
  this._spawn = $dataTDSpawnLocation[this._mapId][spawnId];
  this._direction = TowerDefenseManager.convertDirection(
    this._spawn._direction
  );
  this._effects = {};
  for (const effect in TowerDefenseManager.EFFECTS) {
    this._effects[TowerDefenseManager.EFFECTS[effect]] = {
      enable: false,
      effect: null,
    };
  }
  this._x = this._spawn._x;
  this._y = this._spawn._y;
  this._realX = this._spawn._x;
  this._realY = this._spawn._y;
  this._destroy = false;
  this.setDirection(this._direction);
  this._realMoveSpeed = +this._enemyData.moveSpeed;
  this._moveSpeed = this._realMoveSpeed;
  this._moveSpeedEffects = {};
  this._isStun = false;
  this._animationPlaying = false;
  this._through = this._enemyData.isThrough == "true";
  this._event = new PIXI.utils.EventEmitter();
  this._triggerInit = false;
  this._triggerWait = 0;
  this._target = null;
  this._attack = {
    Damage: +this._enemyData.attackDamage,
    Time: 0,
  };
  this._forceMove = false;
};

Game_TDEnemy.prototype.isSameType = function (type) {
  if (
    type === TowerDefenseManager.ENEMYTYPE.ALL ||
    type === this._enemyData.enemyType ||
    this._enemyData.enemyType === TowerDefenseManager.ENEMYTYPE.ALL
  )
    return true;

  return false;
};

Game_TDEnemy.prototype.getEnemyData = function () {
  return this._enemyData;
};

Game_TDEnemy.prototype.isStarting = function () {
  return false;
};

Game_TDEnemy.prototype.isTriggerIn = function () {
  return false;
};

Game_TDEnemy.prototype.refresh = function () {
  return false;
};

Game_TDEnemy.prototype.checkTriggerConfig = function (config) {
  if (!config) return true;

  if (
    config.exceptEnemy.includes(this._enemyData.id) &&
    config.exceptEnemy.length > 0
  ) {
    return false;
  }

  if (
    !config.onlyEnemy.includes(this._enemyData.id) &&
    config.onlyEnemy.length > 0
  ) {
    return false;
  }

  if (
    config.enemyType === TowerDefenseManager.ENEMYTYPE.ALL ||
    config.enemyType === this._enemyData.enemyType ||
    this._enemyData.enemyType === TowerDefenseManager.ENEMYTYPE.ALL
  ) {
    return true;
  }

  return false;
};

Game_TDEnemy.prototype.update = function () {
  Game_Character.prototype.update.call(this);

  this.updateEffects();

  // Trigger Wait
  if (this._triggerWait > 0) this._triggerWait--;

  if (!this.isMoving() && this._triggerWait <= 0) {
    if (!this._triggerInit) {
      let getTrigger = TowerDefenseManager.getTrigger(
        this._mapId,
        this._x,
        this._y
      );
      if (getTrigger) {
        if (this.checkTriggerConfig(getTrigger.config)) {
          for (let trigger in getTrigger) {
            switch (trigger) {
              case TowerDefenseManager.TRIGGERTYPE.DIRECTION:
                this.setDirection(
                  TowerDefenseManager.convertDirection(getTrigger[trigger])
                );
                this._triggerInit = true;
                break;
              case TowerDefenseManager.TRIGGERTYPE.DESTROY:
                this.triggerDestroy(getTrigger[trigger]);
                this._triggerInit = true;
                break;
              case TowerDefenseManager.TRIGGERTYPE.WAIT:
                this._triggerWait = getTrigger[trigger].duration;
                this._triggerInit = true;
                break;
            }
          }
          if (this._triggerInit) return;
        }
      }
    }

    if (this.updateTrap()) return;

    this.moveStraight(this._direction);
    this._triggerInit = false;
    if (this._forceMove) this.setThrough(false);
  }
};

Game_TDEnemy.prototype.updateTrap = function () {
  let trap = this.getTrap();
  if (!trap) return false;

  // Check infront of trap
  if (!trap.isThrough()) {
    // Trap Blocking
    this._attack.Time--;
    if (this._attack.Time <= 0) {
      this._attack.Time = this._enemyData.attackSpeed;
      this.attack(trap);
    }
    return true;
  } else {
    // Trap In grid
    trap.attackTrap(this);
    this._target = null;
    return false;
  }
};

Game_TDEnemy.prototype.getTrap = function () {
  if (this._target) {
    if (this._target.isDestroyed()) this._target = null;
    else return this._target;
  }

  const x2 = $gameMap.roundXWithDirection(this._x, this._direction);
  const y2 = $gameMap.roundYWithDirection(this._y, this._direction);
  let trap = $gameMap.ufcGetTrap(x2, y2);
  if (trap && !trap.isThrough()) {
    if (!this.isSameType(trap._towerData._attackType)) {
      this._forceMove = true;
      this.setThrough(true);
      return null;
    }
    this._target = trap;
    return this._target;
  }

  trap = $gameMap.ufcGetTrap(this._x, this._y);
  if (trap && this.isSameType(trap._towerData._attackType)) {
    this._target = trap;
    return this._target;
  }

  return null;
};

Game_TDEnemy.prototype.updateEffects = function () {
  for (const effect in this._effects) {
    if (!this._effects[effect].effect) continue;

    if (!this._effects[effect].enable) {
      if (
        this.checkResistance(effect) ||
        !this._effects[effect].effect.getChanceEffect()
      ) {
        this._effects[effect].enable = false;
        this._effects[effect].effect = null;
        continue;
      }
      let passive = false;
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this.addMoveSpeedEffect(
            effect,
            -this._realMoveSpeed *
              (this._effects[effect].effect.getEffect() / 100),
            true
          );
          break;
        case TowerDefenseManager.EFFECTS.POISON:
          this._effects[effect].effect.setEPSCallback(() =>
            this.attacked({ damage: this._effects[effect].effect.getEffect() })
          );
          break;
        case TowerDefenseManager.EFFECTS.STUN:
          this._isStun = true;
          break;
        case TowerDefenseManager.EFFECTS.RAGE:
          this.addMoveSpeedEffect(
            effect,
            this._realMoveSpeed *
              (this._effects[effect].effect.getEffect() / 100),
            false
          );
          break;
        case TowerDefenseManager.EFFECTS.STEAL:
          AudioManager.playSe({
            name: UFC.UFCTD.CONFIG.sound.effectSteal,
            volume: 40,
            pitch: 100,
            pan: 0,
          });
          TowerDefenseManager.gainGold(
            this._effects[effect].effect.getEffect()
          );
          passive = true;
          break;
        case TowerDefenseManager.EFFECTS.CRITICAL:
          this.attacked({
            damage: this._effects[effect].effect.getCriticalDamage(),
          });
          passive = true;
          break;
      }
      if (passive) {
        this._effects[effect].enable = false;
        this._effects[effect].effect = null;
        continue;
      }
      this._event.emit("addEffect", effect);
      this._effects[effect].enable = true;
    }
    this._effects[effect].effect.update();
    if (this._effects[effect].effect.isDone()) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
        case TowerDefenseManager.EFFECTS.RAGE:
          this.removeMoveSpeedEffect(effect);
          break;
        case TowerDefenseManager.EFFECTS.STUN:
          this._isStun = false;
          break;
      }
      this._effects[effect].enable = false;
      this._effects[effect].effect = null;
      this._event.emit("removeEffect", effect);
    }
  }
};

Game_TDEnemy.prototype.updateMoveSpeed = function () {
  let newSpeed = this._realMoveSpeed;
  for (let speedEffect in this._moveSpeedEffects) {
    newSpeed += this._moveSpeedEffects[speedEffect];
  }
  this._moveSpeed = newSpeed;
};

Game_TDEnemy.prototype.removeMoveSpeedEffect = function (effect) {
  delete this._moveSpeedEffects[effect];
  this.updateMoveSpeed();
};

Game_TDEnemy.prototype.addMoveSpeedEffect = function (effect, value, isSlow) {
  if (!this._moveSpeedEffects[effect]) {
    this._moveSpeedEffects[effect] = value;
  } else if (
    (this._moveSpeedEffects[effect] < value && isSlow) ||
    (this._moveSpeedEffects[effect] > value && !isSlow)
  ) {
    this._moveSpeedEffects[effect] = value;
  } else {
    return;
  }
  this.updateMoveSpeed();
};

Game_TDEnemy.prototype.distancePerFrame = function () {
  if (this._isStun) return 0;
  else return Game_Character.prototype.distancePerFrame.call(this);
};

Game_TDEnemy.prototype.triggerDestroy = function (destroyData) {
  if (destroyData.attack) {
    this.attackTrigger(destroyData.attackEventId);
  }
  if (+destroyData.animationId != 0) {
    TowerDefenseManager.requestAnimation([this], +destroyData.animationId);
  }

  this.destroy(true);
};

Game_TDEnemy.prototype.attackTrigger = function (eventid) {
  TowerDefenseManager.requestAnimation(
    [$gameMap._events[eventid]],
    +this._enemyData.attackAnimation
  );
  TowerDefenseManager.attackTrigger(this._attack.Damage);
};

Game_TDEnemy.prototype.attacked = function (damage) {
  this._enemyData.health -= damage.damage;
  this._event.emit(
    "updateHealth",
    this._enemyData.health / this._enemyData.maxHealth
  );
  if (this._enemyData.health <= 0 && !this._destroy) {
    if (this._enemyData.seDead)
      AudioManager.playSe({
        name: this._enemyData.seDead,
        volume: this._enemyData.seDeadVolume,
        pitch: 100,
        pan: 0,
      });
    this.destroy();
    return;
  }

  // Effects
  if (damage.effects && damage.effects.length > 0) {
    let _ef = damage.effects;
    for (const effect in _ef) {
      _ef[effect].damage = damage.damage;
      this._effects[_ef[effect].name].effect = new ufcTowerEffects(_ef[effect]);
    }
  }
};

Game_TDEnemy.prototype.attack = function (target) {
  TowerDefenseManager.requestAnimation(
    [target],
    +this._enemyData.attackAnimation
  );
  target.attacked({
    damage: this._attack.Damage,
  });
};

Game_TDEnemy.prototype.checkResistance = function (effect) {
  return this._resistance.length > 0
    ? this._resistance.includes(effect)
    : false;
};

Game_TDEnemy.prototype.getDropItem = function () {
  if (this._itemDrop.length > 0)
    for (let item of this._itemDrop) {
      if (item.chance < 100) {
        let chance = Math.randomInt(100);
        if (item.chance < chance) continue;
      }
      TowerDefenseManager.gainItem(+item.items, +item.amount);
    }
};

Game_TDEnemy.prototype.isMoving = function () {
  return this._realX !== this._x || this._realY !== this._y;
};

Game_TDEnemy.prototype.destroy = function (isTrigger = false) {
  $gameMap.ufcDestroyEnemy(this);
  this._destroy = true;
  if (!isTrigger) {
    this.getDropItem();
    TowerDefenseManager.gainGold(+this._enemyData.gold);
  }
};

Game_TDEnemy.prototype.isDestroyed = function () {
  return this._destroy;
};

Object.defineProperty(Game_TDEnemy.prototype, "health", {
  get: function () {
    return this._enemyData.health;
  },
});

Object.defineProperty(Game_TDEnemy.prototype, "attackSpeed", {
  get: function () {
    return this._enemyData.attackSpeed;
  },
});
