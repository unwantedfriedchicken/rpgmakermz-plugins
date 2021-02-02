UFC.TH.ALIAS.Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function () {
  UFC.TH.ALIAS.Spriteset_Map_createCharacters.call(this);

  this._tilemap.addChild(TextHelper.initTextContainer());
};
