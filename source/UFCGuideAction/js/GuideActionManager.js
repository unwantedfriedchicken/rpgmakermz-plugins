function GuideActionManager() {}

GuideActionManager.initialize = function () {
  this._guideAction = new GuideAction();
};

Object.defineProperty(GuideActionManager, "getGuideAction", {
  get: function () {
    return this._guideAction;
  },
});

Object.defineProperty(GuideActionManager, "getGuideActionGraphics", {
  get: function () {
    return this.getGuideAction.getGraphics();
  },
});
