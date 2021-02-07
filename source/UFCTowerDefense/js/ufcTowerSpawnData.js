// eslint-disable-next-line no-redeclare
function ufcTowerSpawnData() {
  this.initialize(...arguments);
}

ufcTowerSpawnData.prototype.constructor = ufcTowerSpawnData;
ufcTowerSpawnData.prototype.initialize = function (data) {
  this._x = data._x;
  this._y = data._y;
  this._direction = data["direction"];
};
