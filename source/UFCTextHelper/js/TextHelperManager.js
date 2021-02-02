function TextHelper() {}

TextHelper.initialize = function () {};

TextHelper.spawnText = function (text, x, y, style) {
  let _text = new Text_UFCTextHelper(text, x, y, style);
  this.textContainer.addChild(_text);
  return _text;
};

TextHelper.initTextContainer = function () {
  if (!this.textContainer || this.textContainer._destroyed)
    this.textContainer = new Text_UFCContainer();

  return this.textContainer;
};
