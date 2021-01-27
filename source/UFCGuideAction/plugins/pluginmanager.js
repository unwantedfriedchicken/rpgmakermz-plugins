UFC.UFCGA.PARAMETERS = PluginManager.parameters("UFCGuideAction");

UFC.UFCGA.CONFIG = {
  blockColor: PIXI.utils.string2hex(UFC.UFCGA.PARAMETERS["blockColor"]),
  blockColorAlpha: +UFC.UFCGA.PARAMETERS["blockColorAlpha"],
  openColor: PIXI.utils.string2hex(UFC.UFCGA.PARAMETERS["openColor"]),
  openColorAlpha: +UFC.UFCGA.PARAMETERS["openColorAlpha"],
};
