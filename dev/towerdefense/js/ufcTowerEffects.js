const ufcTowerEffects = function () {
  this.initialize(...arguments);
};

ufcTowerEffects.prototype.initialize = function (data) {
  this._name = data.name;
  this._effect = data.effect;
  this._duration = +data.duration;
  this._curTime = this._duration;
  this._isDone = false;
  this._effectPerSecond = false;
  this._epsTimeDefault = 60;
  this._epsTime = this._epsTimeDefault;
  this._epsCallback = null;
  switch (this._name) {
    case TowerDefenseManager.EFFECTS.POISON:
      this._effectPerSecond = true;
      break;
  }
};

ufcTowerEffects.prototype.setEPSCallback = function (callback) {
  this._epsCallback = callback;
};
ufcTowerEffects.prototype.epsCallback = function () {
  if (this._epsCallback) {
    this._epsCallback();
  }
};

ufcTowerEffects.prototype.getEffect = function () {
  return this._effect;
};

ufcTowerEffects.prototype.isDone = function () {
  return this._isDone;
};

ufcTowerEffects.prototype.update = function () {
  if (this._effectPerSecond) {
    this._epsTime--;
    if (this._epsTime <= 0) {
      this._epsTime = this._epsTimeDefault;
      this.epsCallback();
    }
  }

  this._curTime--;
  if (this._curTime <= 0) this._isDone = true;
};

ufcTowerEffects.prototype.reset = function () {
  this._curTime = this._duration;
  this._isDone = false;
};
