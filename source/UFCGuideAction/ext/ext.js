UFC.UFCGA.ALIAS._Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function () {
  UFC.UFCGA.ALIAS._Game_Player_update.call(this, ...arguments);
  GuideActionManager.getGuideAction.update();
};

UFC.UFCGA.ALIAS._Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function () {
  UFC.UFCGA.ALIAS._Game_Player_initMembers.call(this, ...arguments);
  GuideActionManager.initialize();
};

UFC.UFCGA.ALIAS._Game_Player_clearTransferInfo =
  Game_Player.prototype.clearTransferInfo;
Game_Player.prototype.clearTransferInfo = function () {
  UFC.UFCGA.ALIAS._Game_Player_clearTransferInfo.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(
    this._direction,
    this._x,
    this._y
  );
};

UFC.UFCGA.ALIAS._Game_Player_setDirection = Game_Player.prototype.setDirection;
Game_Player.prototype.setDirection = function (d) {
  UFC.UFCGA.ALIAS._Game_Player_setDirection.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(d, this._x, this._y);
};

UFC.UFCGA.ALIAS._Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function (d) {
  UFC.UFCGA.ALIAS._Game_Player_moveStraight.call(this, ...arguments);
  GuideActionManager.getGuideAction.setDirection(d, this._x, this._y);
};

UFC.UFCGA.ALIAS._Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function () {
  UFC.UFCGA.ALIAS._Spriteset_Map_createCharacters.call(this, ...arguments);
  this._tilemap.addChild(GuideActionManager.getGuideActionGraphics);
};
