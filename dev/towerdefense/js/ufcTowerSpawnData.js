// eslint-disable-next-line no-redeclare
const ufcTowerSpawnData = function () {
  this.initialize(...arguments);
};

ufcTowerSpawnData.prototype.initialize = function (data) {
  this._x = data._x;
  this._y = data._y;
  this._direction = data["direction"];
};
