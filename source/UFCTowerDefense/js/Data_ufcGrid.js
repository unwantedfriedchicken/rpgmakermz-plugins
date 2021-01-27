// eslint-disable-next-line no-redeclare
const Data_ufcGrid = function () {
  this.initialize(...arguments);
};

Data_ufcGrid.prototype.initialize = function (types) {
  this._listType = types;
  this._destroy = false;
  this._event = new PIXI.utils.EventEmitter();
  this._type = null;
  this._gridData = {};
  this._bitmap = {};
  for (let type of this._listType) {
    this._gridData[type] = [];
    this._bitmap[type] = new Bitmap(
      $gameMap.width() * $gameMap.tileWidth(),
      $gameMap.height() * $gameMap.tileHeight()
    );
  }

  this._eventData = [];
  this._lineSize = 4;
  this._updateEventFreq = 60;
  this._updateEventTime = 0;
};

Data_ufcGrid.prototype.setType = function (type) {
  this._type = type;
  return this;
};

Data_ufcGrid.prototype.setVisible = function (visible) {
  this._event.emit("showGrid", visible);
};

Data_ufcGrid.prototype.refreshBitmap = function () {
  let _tmpType = this.getType;
  for (let type of this._listType) {
    this._bitmap[type] = new Bitmap(
      $gameMap.width() * $gameMap.tileWidth(),
      $gameMap.height() * $gameMap.tileHeight()
    );
    this.setType(type);
    for (let x = 0; x < $gameMap.width(); x++) {
      for (let y = 0; y < $gameMap.height(); y++) {
        if (this.getGridData()[x][y]) {
          this.fillGrid(x, y);
        } else {
          this.clearGrid(x, y);
        }
      }
    }
  }
  this.setType(_tmpType);
};

Data_ufcGrid.prototype.getGridData = function (type) {
  return this._gridData[!type ? this.getType : type];
};

Data_ufcGrid.prototype.calcGrid = function () {
  let bit = 0x0f;
  for (let type of this._listType) {
    this.setType(type);
    $gamePlayer.getGuideAction().setType(type);
    for (let x = 0; x < $gameMap.width(); x++) {
      for (let y = 0; y < $gameMap.height(); y++) {
        if (!this.getGridData()[x]) {
          this.getGridData()[x] = [];
        }

        this.getGridData()[x][y] = true;
        if (
          !$gameMap.checkPassage(x, y, bit) ||
          $gamePlayer.getGuideAction().checkGrid(x, y)
        ) {
          this.getGridData()[x][y] = false;
          this.clearGrid(x, y);
        } else {
          this.fillGrid(x, y);
        }
      }
    }
  }
  for (const event of $gameMap.events()) {
    if (!event.isThrough()) {
      for (const type of this._listType) {
        this.setType(type).clearGrid(event.x, event.y);
      }
    }
    this._eventData.push({ event: event, pos: { x: event.x, y: event.y } });
  }
};

Data_ufcGrid.prototype.updateEvents = function () {
  this._updateEventTime--;
  if (this._updateEventTime > 0) return;

  this._updateEventTime = this._updateEventFreq;
  let _tmpType = this.getType;
  // Clear Event
  for (const event of this._eventData) {
    let removeEvent = false;
    for (const type of this._listType) {
      let gridData = this.setType(type).getGridData()[event.pos.x][event.pos.y];
      if (event.event._erased) {
        if (gridData) this.fillGrid(event.pos.x, event.pos.y);
        removeEvent = true;
      } else if (!event.event.pos(event.pos.x, event.pos.y)) {
        if (this.getGridData()[event.pos.x][event.pos.y])
          this.fillGrid(event.pos.x, event.pos.y);
        this.clearGrid(event.event.x, event.event.y);
        event.pos.x = event.event.x;
        event.pos.y = event.event.y;
      }
    }
    if (removeEvent) this._eventData.remove(event);
  }
  this.setType(_tmpType);
};

Data_ufcGrid.prototype.posX = function (x) {
  return x * $gameMap.tileWidth();
};

Data_ufcGrid.prototype.posY = function (y) {
  return y * $gameMap.tileHeight();
};

Data_ufcGrid.prototype.fillGrid = function (x, y) {
  this.getBitmap.fillRect(
    this.posX(x) + this._lineSize / 2,
    this.posY(y) + this._lineSize / 2,
    $gameMap.tileWidth() - this._lineSize,
    $gameMap.tileHeight() - this._lineSize,
    this.getGridColor
  );
};

Data_ufcGrid.prototype.clearGrid = function (x, y) {
  this.getBitmap.clearRect(
    this.posX(x),
    this.posY(y),
    $gameMap.tileWidth(),
    $gameMap.tileHeight()
  );
};

Data_ufcGrid.prototype.destroy = function () {
  this._destroy = true;
  this.getBitmap.destroy();
};

Data_ufcGrid.prototype.isDestroyed = function () {
  return this._destroy;
};

Data_ufcGrid.prototype.getBitmapType = function (type) {
  return this._bitmap[type];
};

Object.defineProperty(Data_ufcGrid.prototype, "getBitmap", {
  get: function () {
    return this._bitmap[this.getType];
  },
});

Object.defineProperty(Data_ufcGrid.prototype, "getType", {
  get: function () {
    return this._type;
  },
});

Object.defineProperty(Data_ufcGrid.prototype, "getListType", {
  get: function () {
    return this._listType;
  },
});

Object.defineProperty(Data_ufcGrid.prototype, "getGridColor", {
  get: function () {
    switch (this.getType) {
      case TowerDefenseManager.TOWERTYPE.TRAP:
        return UFC.UFCTD.TOWERSETTINGS.gridTrapColor;
      default:
        return UFC.UFCTD.TOWERSETTINGS.gridColor;
    }
  },
});
