const ufcTowerWaveData = function () {
  this.initialize(...arguments);
};

ufcTowerWaveData.prototype.initialize = function (data) {
  this._spawnLocationId = data["spawnLocationId"];
  this._enemy = data["enemy"];
  this._numberSpawn = data["numberSpawn"];
  this._delayPerSpawn = data["delayPerSpawn"];
  this._delay = data["delay"];
  this._start = false;
  this._startSE = data["startSE"];
  this._startSEVolume = data["startSEVolume"];
  this._timeSpawn = 0;
};
