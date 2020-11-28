const ufcTowerData = function () {
  this.initialize(...arguments);
};

ufcTowerData.prototype.initialize = function (data) {
  this._id = data["id"];
  this._name = data["name"];
  this._attack = data["attack"];
  this._range = +data["range"];
  this._character = data["character"];
  this._characterIndex = data["characterindex"];
  this._attackSpeed = data["attackspeed"];
  this._bulletSpeed = data["bulletspeed"];
  this._bulletAnimationId = data["bulletanimationid"];
  this._bulletCharacterName = data["bulletspritename"];
  this._bulletCharacterIndex = data["bulletspriteindex"];
  this._bulletCharacterIndexY = data["bulletspriteindexy"];
  this._upgradeId = data["upgradeid"];
  if (this._upgradeId != "?" && data["upgradeprice"] == "?") {
    this._upgradePrice = $dataItems[this._upgradeId].price;
  } else {
    this._upgradePrice = data["upgradeprice"];
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
        effect: _effect[1],
        duration: _effect[2],
      });
    }
  }
  this._effectsNote = data["effectsnote"];
  this._x = 0;
  this._y = 0;
  this._rangeVisible = true;
  this._placeMode = false;
};

ufcTowerData.prototype.setPlaceMode = function (mode) {
  this._placeMode = mode;
};

Object.defineProperty(ufcTowerData.prototype, "getPlaceMode", {
  get: function () {
    return this._placeMode;
  },
});
