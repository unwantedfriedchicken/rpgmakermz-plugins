const ufcTowerData = function () {
  this.initialize(...arguments);
};

ufcTowerData.prototype.initialize = function (data) {
  this._id = data["id"];
  this._name = data["name"];
  this._attack = +data["attack"];
  this._range = +data["range"];
  this._character = data["character"];
  this._characterIndex = data["characterindex"];
  this._attackSpeed = +data["attackspeed"];
  this._bulletSpeed = data["bulletspeed"];
  this._bulletAnimationId = data["bulletanimationid"];
  this._bulletCharacterName = data["bulletspritename"];
  this._bulletCharacterIndex = data["bulletspriteindex"];
  this._bulletCharacterIndexY = data["bulletspriteindexy"];
  this._upgrade = [];
  let listUpgrade = Object.keys(data).filter(
    (item) => item.slice(0, 7) == "upgrade"
  );
  if (listUpgrade.length > 0) {
    listUpgrade.forEach((item) => {
      let _data = data[item].split("|");
      let _price = 0;
      if (_data.length == 1) {
        _price = $dataItems[_data[0]].price;
      } else {
        _price = +_data[1];
      }

      this._upgrade.push({
        id: +_data[0],
        price: _price,
      });
    });
  }

  if (data["sellprice"] == "?") {
    this._sellPrice = $dataItems[this._id].price / 2;
  } else {
    this._sellPrice = data["sellprice"];
  }
  this._effects = [];
  if (data["effects"]) {
    let effects = data["effects"].split(",");
    for (const effect of effects) {
      let _effect = effect.split("|");
      this._effects.push({
        name: _effect[0],
        effect: +_effect[1],
        duration: +_effect[2],
        chance: +_effect[3] || 100,
      });
    }
  }
  this._auras = [];
  if (data["auras"]) {
    let auras = data["auras"].split(",");
    for (const aura of auras) {
      let _aura = aura.split("|");
      this._auras.push({
        name: _aura[0],
        effect: +_aura[1],
        type: _aura[2] || "fixed",
      });
    }
  }
  this._attackType = data["attacktype"] || TowerDefenseManager.ENEMYTYPE.ALL;
  this._note = data["note"];
  this._buffs = {};
  this.resetBuffs();
  this._x = 0;
  this._y = 0;
  this._event = new PIXI.utils.EventEmitter();
  this._placeMode = false;
};

ufcTowerData.prototype.setRangeVisibility = function (visible) {
  this._event.emit("setRangeVisibility", visible);
};

ufcTowerData.prototype.getBulletData = function () {
  return {
    damage: {
      damage: this.getAttack(),
      effects: this._effects,
    },
    speed: +this._bulletSpeed,
    animationId: this._bulletAnimationId,
    characterName: this._bulletCharacterName,
    characterIndex: +this._bulletCharacterIndex,
    characterIndexY: +this._bulletCharacterIndexY,
  };
};

ufcTowerData.prototype.getBuffs = function (buff) {
  if (!buff) return this._buffs;

  return this._buffs[buff];
};

ufcTowerData.prototype.getBaseValWithAuraType = function (type) {
  switch (type) {
    case TowerDefenseManager.AURATYPE.ATTACK:
      return this.getBaseAttack;
    case TowerDefenseManager.AURATYPE.RANGE:
      return this.getBaseRange;
    case TowerDefenseManager.AURATYPE.ATTACKSPEED:
      return this.getBaseAttackSpeed;
  }
  return false;
};

ufcTowerData.prototype.resetBuffs = function () {
  for (const aura in TowerDefenseManager.AURATYPE) {
    this._buffs[TowerDefenseManager.AURATYPE[aura]] = 0;
  }
};

ufcTowerData.prototype.getAttack = function () {
  return Math.max(
    0,
    this.getBaseAttack + this._buffs[TowerDefenseManager.AURATYPE.ATTACK]
  );
};

ufcTowerData.prototype.getRange = function () {
  return Math.max(
    0,
    this.getBaseRange + this._buffs[TowerDefenseManager.AURATYPE.RANGE]
  );
};

ufcTowerData.prototype.getAttackSpeed = function () {
  return (
    this.getBaseAttackSpeed +
    this._buffs[TowerDefenseManager.AURATYPE.ATTACKSPEED] * -1
  );
};

ufcTowerData.prototype.setBuffs = function (buffs) {
  for (const buff of buffs) {
    let be = buff.effect;
    if (buff.type === TowerDefenseManager.AURATYPEMODE.PERCENTAGE) {
      be = this.getBaseValWithAuraType(buff.name) * (be / 100);
    }

    if (this._buffs[buff.name] === 0) {
      this._buffs[buff.name] = be;
    } else {
      if (buff.name === TowerDefenseManager.AURATYPE.ATTACKSPEED) {
        this._buffs[buff.name] = Math.min(be, this._buffs[buff.name]);
      } else {
        this._buffs[buff.name] = Math.max(be, this._buffs[buff.name]);
      }
    }
  }
};

ufcTowerData.prototype.setPlaceMode = function (mode) {
  this._placeMode = mode;
};

ufcTowerData.prototype.getAuras = function () {
  return this._auras;
};

ufcTowerData.prototype.isHaveAura = function () {
  return this._auras.length > 0;
};

ufcTowerData.prototype.isHaveUpgrade = function () {
  return this._upgrade.length > 0;
};

ufcTowerData.prototype.checkGetBuffs = function () {
  let towers = $gameMap._events.filter(
    (event) =>
      event instanceof Game_TowerDefense &&
      event.getTowerData() !== this &&
      event.getTowerData().isHaveAura() &&
      PIXI.utils.isInRange(
        this._x,
        this._y,
        event._x,
        event._y,
        event.getTowerData().getRange()
      )
  );
  for (const tower of towers) {
    this.setBuffs(tower.getTowerData().getAuras());
    tower.addTowerEffectedByAura(this);
  }
};

Object.defineProperty(ufcTowerData.prototype, "getBaseAttack", {
  get: function () {
    return this._attack;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getBaseRange", {
  get: function () {
    return this._range;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getBaseAttackSpeed", {
  get: function () {
    return this._attackSpeed;
  },
});

Object.defineProperty(ufcTowerData.prototype, "getPlaceMode", {
  get: function () {
    return this._placeMode;
  },
});
