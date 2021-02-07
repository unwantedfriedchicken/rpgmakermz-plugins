// eslint-disable-next-line no-redeclare
function ufcTowerWaveData() {
  this.initialize(...arguments);
}

ufcTowerWaveData.prototype.constructor = ufcTowerWaveData;
ufcTowerWaveData.prototype.initialize = function (data) {
  this._spawnLocationId = data["spawnLocationId"];
  this._enemy = data["enemy"];
  this._numberSpawn = +data["numberSpawn"];
  this._delayPerSpawn = +data["delayPerSpawn"];
  this._delay = +data["delay"];
  this._start = false;
  this._startSE = data["startSE"];
  this._startSEVolume = +data["startSEVolume"];
  this._timeSpawn = 0;
  this._spawnEnemy = false;
};

ufcTowerWaveData.prototype.getEnemy = function () {
  return [this._enemy, this._spawnLocationId];
};

ufcTowerWaveData.prototype.update = function () {
  if (this._delay > 0) {
    this._delay--;
    return;
  }

  if (!this._start) {
    this._start = true;
    if (this._startSE) {
      AudioManager.playSe({
        name: this._startSE,
        volume: this._startSEVolume,
        pitch: 100,
        pan: 0,
      });
    }
  }

  this._timeSpawn--;
  if (this._timeSpawn <= 0) {
    this.spawnEnemy();
  }
};

ufcTowerWaveData.prototype.spawnEnemy = function () {
  this._spawnEnemy = true;
  this._timeSpawn = this._delayPerSpawn;
  this._numberSpawn--;
};

ufcTowerWaveData.prototype.isSpawnEnemy = function () {
  if (this._spawnEnemy) {
    this._spawnEnemy = false;
    return true;
  }
  return false;
};

ufcTowerWaveData.prototype.isDone = function () {
  return this._numberSpawn <= 0;
};
