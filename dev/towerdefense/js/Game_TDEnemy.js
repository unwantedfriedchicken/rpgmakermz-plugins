function Game_TDEnemy() {
  this.initialize(...arguments);
}

Game_TDEnemy.prototype = Object.create(Game_Character.prototype);
Game_TDEnemy.prototype.constructor = Game_TDEnemy;

Game_TDEnemy.prototype.initialize = function (enemyName, spawnId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._enemyData = Object.assign({}, $dataTDEnemy[enemyName]);
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
  this._animationPlaying = false;
  this._event = new PIXI.utils.EventEmitter();
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

Game_TDEnemy.prototype.update = function () {
  Game_Character.prototype.update.call(this);

  this.updateEffects();
  if (!this.isMoving()) {
    let getTrigger = TowerDefenseManager.getTrigger(
      this._mapId,
      this._x,
      this._y
    );
    if (getTrigger) {
      for (let trigger in getTrigger) {
        switch (trigger) {
          case TowerDefenseManager.TRIGGERTYPE.DIRECTION:
            this.setDirection(
              TowerDefenseManager.convertDirection(getTrigger[trigger])
            );
            break;
          case TowerDefenseManager.TRIGGERTYPE.DESTROY:
            this.triggerDestroy(getTrigger[trigger]);
            return;
        }
      }
    }
    this.moveStraight(this._direction);
  }
};

Game_TDEnemy.prototype.updateEffects = function () {
  for (const effect in this._effects) {
    if (!this._effects[effect].effect) continue;

    if (!this._effects[effect].enable) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this._moveSpeed = Math.max(
            0.1,
            (this._moveSpeed *
              (100 - this._effects[effect].effect.getEffect())) /
              100
          );
          break;
        case TowerDefenseManager.EFFECTS.POISON:
          this._effects[effect].effect.setEPSCallback(() =>
            this.attacked({ damage: this._effects[effect].effect.getEffect() })
          );
          break;
      }
      this._event.emit("addEffect", effect);
      this._effects[effect].enable = true;
    }
    this._effects[effect].effect.update();
    if (this._effects[effect].effect.isDone()) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this._moveSpeed = this._realMoveSpeed;
          break;
      }
      this._effects[effect].enable = false;
      this._effects[effect].effect = null;
      this._event.emit("removeEffect", effect);
    }
  }
};

Game_TDEnemy.prototype.triggerDestroy = function (destroyData) {
  if (destroyData.attack) {
    this.attack(destroyData.attackEventId);
  }
  if (+destroyData.animationId != 0) {
    TowerDefenseManager.requestAnimation([this], +destroyData.animationId);
  }

  this.destroy();
};

Game_TDEnemy.prototype.attack = function (eventid) {
  TowerDefenseManager.requestAnimation(
    [$gameMap._events[eventid]],
    +this._enemyData.attackAnimation
  );
  TowerDefenseManager.attackTower(+this._enemyData.attackDamage);
};

Game_TDEnemy.prototype.attacked = function (damage) {
  this._enemyData.health -= damage.damage;
  if (this._enemyData.health <= 0 && !this._destroy) {
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
      this._effects[_ef[effect].name].effect = new ufcTowerEffects(_ef[effect]);
    }
  }
};

Object.defineProperty(Game_TDEnemy.prototype, "health", {
  get: function () {
    return this._enemyData.health;
  },
});

Game_TDEnemy.prototype.isMoving = function () {
  return this._realX !== this._x || this._realY !== this._y;
};

Game_TDEnemy.prototype.destroy = function () {
  $gameMap.ufcDestroyEnemy(this);
  this._destroy = true;
  $gameParty.gainGold(+this._enemyData.gold);
  $gameMap.updateGoldHud();
};

Game_TDEnemy.prototype.isDestroyed = function () {
  return this._destroy;
};
