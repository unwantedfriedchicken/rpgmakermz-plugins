const Data_ufcGrid = function () {
  this.initialize(...arguments);
};

Data_ufcGrid.prototype.initialize = function () {
  this._destroy = false;
  this._event = new PIXI.utils.EventEmitter();
  this._gridData = [];
  this._eventData = [];
  this._bitmap = new Bitmap(
    $gameMap.width() * $gameMap.tileWidth(),
    $gameMap.height() * $gameMap.tileHeight()
  );
  this._lineSize = 4;
  this._gridColor = UFC.UFCTD.TOWERSETTINGS.gridColor;
  this._updateEventFreq = 60;
  this._updateEventTime = 0;
};

Data_ufcGrid.prototype.setVisible = function (visible) {
  this._event.emit("showGrid", visible);
};

Data_ufcGrid.prototype.getData = function () {
  return this._gridData;
};

Data_ufcGrid.prototype.calcGrid = function () {
  let bit = 0x0f;
  for (let x = 0; x < $gameMap.width(); x++) {
    for (let y = 0; y < $gameMap.height(); y++) {
      if (!this._gridData[x]) {
        this._gridData[x] = [];
      }

      this._gridData[x][y] = true;
      if (
        !$gameMap.checkPassage(x, y, bit) ||
        $gamePlayer.getGuideAction().checkTerrainTag(x, y)
      ) {
        this._gridData[x][y] = false;
        this.clearGrid(x, y);
      } else {
        this.fillGrid(x, y);
      }
    }
  }
  for (const event of $gameMap.events()) {
    if (!event.isThrough()) {
      this.clearGrid(event.x, event.y);
    }
    this._eventData.push({ event: event, pos: { x: event.x, y: event.y } });
  }

  this.updateEvents();
};

Data_ufcGrid.prototype.updateEvents = function () {
  this._updateEventTime--;
  if (this._updateEventTime > 0) return;

  this._updateEventTime = this._updateEventFreq;
  // Clear Event
  for (const event of this._eventData) {
    if (event.event._erased) {
      if (this._gridData[event.pos.x][event.pos.y])
        this.fillGrid(event.pos.x, event.pos.y);
      this._eventData.remove(event);
    }
    if (!event.event.pos(event.pos.x, event.pos.y)) {
      this.fillGrid(event.pos.x, event.pos.y);
      this.clearGrid(event.event.x, event.event.y);
      event.pos.x = event.event.x;
      event.pos.y = event.event.y;
    }
  }
};

Data_ufcGrid.prototype.getGrid = function () {
  return this._gridData;
};

Data_ufcGrid.prototype.posX = function (x) {
  return x * $gameMap.tileWidth();
};

Data_ufcGrid.prototype.posY = function (y) {
  return y * $gameMap.tileHeight();
};

Data_ufcGrid.prototype.fillGrid = function (x, y) {
  this._bitmap.fillRect(
    this.posX(x) + this._lineSize / 2,
    this.posY(y) + this._lineSize / 2,
    $gameMap.tileWidth() - this._lineSize,
    $gameMap.tileHeight() - this._lineSize,
    this._gridColor
  );
};

Data_ufcGrid.prototype.clearGrid = function (x, y) {
  this._bitmap.clearRect(
    this.posX(x),
    this.posY(y),
    $gameMap.tileWidth(),
    $gameMap.tileHeight()
  );
};

Data_ufcGrid.prototype.destroy = function () {
  this._destroy = true;
  this._bitmap.destroy();
};

Data_ufcGrid.prototype.isDestroyed = function () {
  return this._destroy;
};
