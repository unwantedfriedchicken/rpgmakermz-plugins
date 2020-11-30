/*:
@target MZ

@plugindesc Add Tower Defense Mechanic
@author Unwanted Fried Chicken

@command config
@text Config Tower Defense
@desc Configuration

@arg onlyTerrain
@text Place building terrain
@desc Set place building terrain tag, if set 0 then building can be placed anywhere except where player can't pass. multiple tag use , to seprate
@type text
@default 0

@arg exceptTerrain
@text Can't place in this terrain
@desc Set place where building can't be set with terrain tag. multiple tag use , to seprate
@type text
@default 0

@arg limitAnimation
@text Limit Animation
@desc If frame rate become low because so many effect try limit the animation
@type number
@default 0

@arg towerHealthVarId
@text Tower Health variable ID
@desc This health of the tower set to your variable id
@type number
@default 0

@arg towerMaxHealthVarId
@text Tower Max Health variable ID
@desc This Max health of the tower set to your variable id
@type number
@default 0

@arg gameoverSwitchId
@text Game Over Switch Id
@desc When health <= 0 this switch will change to ON
@type number
@default 0

@command showHealthBar
@text Show Health HUD
@desc Show Health HUD

@arg show
@text Show
@desc Show Health Hud
@type boolean
@default true

@command showGold
@text Show Gold HUD
@desc Show Gold HUD

@arg show
@text Show
@desc Show Gold Hud
@type boolean
@default true

@command updateHealthHud
@text Update Health Hud
@desc Update Health Hud To Current Variable Value

@command limitAnimation
@text Limit Animation
@desc Set limit animation

@arg limit
@text Total Limit animation
@desc This will limit animation, set 0 to unlimited animation
@type number
@default 0

@command triggerDestroy
@text Trigger Destroy Enemy
@desc Enemy will get destroy when go here

@arg attack
@text Attack
@desc Is enemy attack before get destroy?
@type select
@option true
@option false
@default true

@arg attackEventId
@text Attack Event ID
@desc If attack enemy, give attack animation to this event
@type number
@default 0

@arg animationId
@text Death Animation Id
@desc Give animation when enemy dead, set 0 to no animation
@type number
@default 0

@command triggerMove
@text Trigger Move Enemy
@desc Enemy will change their direction here

@arg direction
@text Direction
@desc Defines enemy direction, for multiple direction add "/" -> Left/Right/Up mean direction is left, right or up
@type select
@option Left
@option Right
@option Up
@option Down
@option Left/Right
@option Down/Left
@option Down/Right
@option Up/Down
@option Up/Right
@option Up/Left
@option Random
@default Left

@command startWave
@text Start Tower Defense
@desc When this fired the game will play

@arg spawnLocationId
@text Spawn Location ID
@type number
@default 1
@desc Defines this enemy spanw location

@arg enemy
@text Enemy Name
@type text
@default Jombi
@desc Defines this enemy name

@arg numberSpawn
@text Total Spawn
@type number
@default 5
@desc Defines total enemy number

@arg delayPerSpawn
@text Time Per Spawn
@type number
@default 60
@desc Defines time between each spawn number is perframe 1/60s

@arg delay
@text Delay Before Spawn
@type number
@default 0
@desc This usefull if have multiple spawn wave and want have delay between them

@arg startSE
@text Start Wave SE
@type text
@default 0
@desc Start wave sound effect, leave 0 to disable

@arg startSEVolume
@text Start Wave SE Volume
@type text
@default 100
@desc Start wave sound effect Volume

@command setSpawn
@text Set Enemy Spawn Location
@desc Set up where enemy will spawn

@arg direction
@text Direction Spawn
@desc Defines enemy default direction, for multiple direction add "/" -> Left/Right mean direction is left or right
@type select
@option Left
@option Right
@option Up
@option Down
@option Left/Right
@option Down/Left
@option Down/Right
@option Up/Down
@option Up/Right
@option Up/Left
@option Random
@default Left

@command setupEnemy
@text Setup enemy data
@desc Setup enemy data

@arg id
@text ID
@type text
@default anon
@desc Defines this enemy id, no space or special character

@arg name
@text Name
@type text
@default Anon
@desc Defines this enemy name

@arg health
@text Health
@type number
@default 10
@desc Defines this enemy health

@arg attackDamage
@text Attack Damage
@type number
@default 10
@desc Defines attack damage

@arg moveSpeed
@text Move Speed
@type number
@default 3.5
@desc Defines this enemy move speed, can use float number

@arg gold
@text Gold
@type number
@default 100
@desc When enemy get killed get gold

@arg attackAnimation
@text Attack Animation ID
@type number
@default 1
@desc Defines attack Animation when this enemy attack

@arg seDead
@text Dead SE
@type text
@default Slash2
@desc Defines Sound effect when dead

@arg seDeadVolume
@text Dead SE Volume
@type number
@default 90
@desc Defines Sound effect when dead volume

@arg scale
@text Enemy Scale
@type number
@default 1
@desc Defines enemy scale
*/

var $dataTDEnemy = $dataTDEnemy || {};
var $dataTDSpawnLocation = $dataTDSpawnLocation || {};
var $dataTDTrigger = $dataTDTrigger || {};

const Data_ufcGrid = function () {
  this.initialize(...arguments);
};

Data_ufcGrid.prototype.initialize = function () {
  this._event = new PIXI.utils.EventEmitter();
  this._gridData = [];
  this._eventData = [];
  this._bitmap = new Bitmap(
    $gameMap.width() * $gameMap.tileWidth(),
    $gameMap.height() * $gameMap.tileHeight()
  );
  this._lineSize = 4;
  this._gridColor = "#61FFB4";
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

function Game_TDEnemy() {
  this.initialize(...arguments);
}

Game_TDEnemy.prototype = Object.create(Game_Character.prototype);
Game_TDEnemy.prototype.constructor = Game_TDEnemy;

Game_TDEnemy.prototype.initialize = function (enemyName, spawnId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._enemyData = Object.assign({}, $dataTDEnemy[enemyName]);
  this._spawn = $dataTDSpawnLocation[this._mapId][spawnId];
  this._direction = TowerDefenseManager.convertDirection(
    this._spawn._direction
  );
  this._effects = {};
  for (const effect in TowerDefenseManager.EFFECTS) {
    this._effects[TowerDefenseManager.EFFECTS[effect]] = {
      enable: false,
      effect: null,
    };
  }
  this._x = this._spawn._x;
  this._y = this._spawn._y;
  this._realX = this._spawn._x;
  this._realY = this._spawn._y;
  this._destroy = false;
  this.setDirection(this._direction);
  this._realMoveSpeed = +this._enemyData.moveSpeed;
  this._moveSpeed = this._realMoveSpeed;
  this._animationPlaying = false;
  this._event = new PIXI.utils.EventEmitter();
};

Game_TDEnemy.prototype.getEnemyData = function () {
  return this._enemyData;
};

Game_TDEnemy.prototype.isStarting = function () {
  return false;
};

Game_TDEnemy.prototype.isTriggerIn = function () {
  return false;
};

Game_TDEnemy.prototype.refresh = function () {
  return false;
};

Game_TDEnemy.prototype.update = function () {
  Game_Character.prototype.update.call(this);

  this.updateEffects();
  if (!this.isMoving()) {
    if (
      $dataTDTrigger[this._mapId] &&
      $dataTDTrigger[this._mapId][this._x] &&
      $dataTDTrigger[this._mapId][this._x][this._y]
    ) {
      if ($dataTDTrigger[this._mapId][this._x][this._y].direction) {
        this.setDirection(
          TowerDefenseManager.convertDirection(
            $dataTDTrigger[this._mapId][this._x][this._y].direction
          )
        );
      }
      if ($dataTDTrigger[this._mapId][this._x][this._y].destroy) {
        this.triggerDestroy(
          $dataTDTrigger[this._mapId][this._x][this._y].destroy
        );
        return;
      }
    }
    this.moveStraight(this._direction);
  }
};

Game_TDEnemy.prototype.updateEffects = function () {
  for (const effect in this._effects) {
    if (!this._effects[effect].effect) continue;

    if (!this._effects[effect].enable) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this._moveSpeed = Math.max(
            0.1,
            (this._moveSpeed *
              (100 - this._effects[effect].effect.getEffect())) /
              100
          );
          break;
        case TowerDefenseManager.EFFECTS.POISON:
          this._effects[effect].effect.setEPSCallback(() =>
            this.attacked({ damage: this._effects[effect].effect.getEffect() })
          );
          break;
      }
      this._event.emit("addEffect", effect);
      this._effects[effect].enable = true;
    }
    this._effects[effect].effect.update();
    if (this._effects[effect].effect.isDone()) {
      switch (effect) {
        case TowerDefenseManager.EFFECTS.COLD:
          this._moveSpeed = this._realMoveSpeed;
          break;
      }
      this._effects[effect].enable = false;
      this._effects[effect].effect = null;
      this._event.emit("removeEffect", effect);
    }
  }
};

Game_TDEnemy.prototype.triggerDestroy = function (destroyData) {
  if (destroyData.attack) {
    this.attack(destroyData.attackEventId);
  }
  if (+destroyData.animationId != 0) {
    TowerDefenseManager.requestAnimation([this], +destroyData.animationId);
  }

  this.destroy();
};

Game_TDEnemy.prototype.attack = function (eventid) {
  TowerDefenseManager.requestAnimation(
    [$gameMap._events[eventid]],
    +this._enemyData.attackAnimation
  );
  TowerDefenseManager.attackTower(+this._enemyData.attackDamage);
};

Game_TDEnemy.prototype.attacked = function (damage) {
  this._enemyData.health -= damage.damage;
  if (this._enemyData.health <= 0 && !this._destroy) {
    AudioManager.playSe({
      name: this._enemyData.seDead,
      volume: this._enemyData.seDeadVolume,
      pitch: 100,
      pan: 0,
    });
    this.destroy();
    return;
  }

  // Effects
  if (damage.effects && damage.effects.length > 0) {
    let _ef = damage.effects;
    for (const effect in _ef) {
      this._effects[_ef[effect].name].effect = new ufcTowerEffects(_ef[effect]);
    }
  }
};

Object.defineProperty(Game_TDEnemy.prototype, "health", {
  get: function () {
    return this._enemyData.health;
  },
});

Game_TDEnemy.prototype.isMoving = function () {
  return this._realX !== this._x || this._realY !== this._y;
};

Game_TDEnemy.prototype.destroy = function () {
  $gameMap.ufcDestroyEnemy(this);
  this._destroy = true;
  $gameParty.gainGold(+this._enemyData.gold);
  $gameMap.updateGoldHud();
};

Game_TDEnemy.prototype.isDestroyed = function () {
  return this._destroy;
};

function Game_TowerDefense() {
  this.initialize(...arguments);
}

Game_TowerDefense.prototype = Object.create(Game_Character.prototype);
Game_TowerDefense.prototype.constructor = Game_TowerDefense;

Game_TowerDefense.prototype.initialize = function (towerData, mapId) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = mapId;
  this._towerData = towerData;
  this._bulletData = {
    damage: {
      damage: this._towerData._attack,
      effects: this._towerData._effects,
    },
    speed: +this._towerData._bulletSpeed,
    animationId: this._towerData._bulletAnimationId,
    characterName: this._towerData._bulletCharacterName,
    characterIndex: +this._towerData._bulletCharacterIndex,
    characterIndexY: +this._towerData._bulletCharacterIndexY,
  };
  this._attackTime = 0;
  this._x = this._towerData._x;
  this._y = this._towerData._y;
  this._realX = this._towerData._x;
  this._realY = this._towerData._y;
  this._target = null;
  this._destroy = false;
};

Game_TowerDefense.prototype.getTowerData = function () {
  return this._towerData;
};

Game_TowerDefense.prototype.isStarting = function () {
  return false;
};

Game_TowerDefense.prototype.isTriggerIn = function () {
  return false;
};

Game_TowerDefense.prototype.refresh = function () {
  return false;
};

Game_TowerDefense.prototype.update = function () {
  this._attackTime--;
  if (!this._target && $gameMap.ufcEnemies().length > 0) {
    // Search target
    for (let i = 0; i < $gameMap.ufcEnemies().length; i++) {
      const enemy = $gameMap.ufcEnemies()[i];
      if (this.isInTowerRange(enemy._x, enemy._y) && !enemy.isDestroyed()) {
        this._target = enemy;
        break;
      }
    }
  } else if (this._target) {
    if (
      !this.isInTowerRange(this._target.x, this._target.y) ||
      this._target.isDestroyed()
    ) {
      // clear target
      this._target = null;
    } else {
      // shoot projectile
      if (this._attackTime <= 0) {
        this._attackTime = this._towerData._attackSpeed;
        this.attack(this._target);
      }
    }
  }
};

Game_TowerDefense.prototype.isInTowerRange = function (x, y) {
  return (
    x <= this._x + this._towerData._range &&
    x >= this._x - this._towerData._range &&
    y <= this._y + this._towerData._range &&
    y >= this._y - this._towerData._range
  );
};

Game_TowerDefense.prototype.attack = function (enemy) {
  let projectileId = $gameMap.ufcProjectiles();
  $gameMap.ufcAddProjectile(
    new Game_ufcProjectile(
      this._x,
      this._y,
      enemy,
      this._bulletData,
      projectileId
    )
  );
};

Game_TowerDefense.prototype.destroy = function () {
  AudioManager.playSe({
    name: "Door2",
    volume: 25,
    pitch: 100,
    pan: 0,
  });
  this._destroy = true;
  $gameMap.ufcDestroyTower(this);
};

Game_TowerDefense.prototype.isDestroyed = function () {
  return this._destroy;
};

Game_TowerDefense.prototype.actionTower = function () {
  $gameMessage.setWindowTower(true);
  TowerDefenseManager.actionTower(this._towerData, () => {
    this.destroy(); // Callback for move and upgrade
  });
  return;
};

function Game_ufcProjectile() {
  this.initialize(...arguments);
}

Game_ufcProjectile.prototype = Object.create(Game_Character.prototype);
Game_ufcProjectile.prototype.constructor = Game_ufcProjectile;

Game_ufcProjectile.prototype.initialize = function (
  spawnLocationX,
  spawnLocationY,
  target,
  bulletData
) {
  Game_Character.prototype.initialize.call(this);
  this._mapId = $gameMap._mapId;
  this._target = target;
  this._x = spawnLocationX;
  this._y = spawnLocationY;
  this.damage = bulletData.damage;
  this.speed = bulletData.speed;
  this.animationId = bulletData.animationId;
  this.characterName = bulletData.characterName;
  this.characterIndex = bulletData.characterIndex;
  this.characterIndexY = bulletData.characterIndexY;
  this.canvasX = this.screenX(this._x);
  this.canvasY = this.screenY(this._y);
  this.vX = 0;
  this.vY = 0;
  this.destroy = false;
  this.rotation = 180;
  this._distCollide = 38;
  this.setDirection(2);
};

Game_ufcProjectile.prototype.screenX = function (x = this._x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Game_ufcProjectile.prototype.screenY = function (y = this._y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Game_ufcProjectile.prototype.update = function () {
  Game_Character.prototype.update.call(this);
  let targetY = this.screenY(this._target._realY);
  let targetX = this.screenX(this._target._realX);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  this.rotation = Math.atan2(targetY - this.canvasY, targetX - this.canvasX);
  this.vX += Math.cos(this.rotation) * (this.speed / 60);
  this.vY += Math.sin(this.rotation) * (this.speed / 60);

  this.canvasX = this.screenX(this._x) + this.vX;
  this.canvasY = this.screenY(this._y) + this.vY;

  if (
    PIXI.utils.dist(this.canvasX, this.canvasY, targetX, targetY) <=
      this._distCollide ||
    this._target.isDestroyed()
  ) {
    this.destroyProjectile();
  }
};

Game_ufcProjectile.prototype.destroyProjectile = function () {
  TowerDefenseManager.requestAnimation([this._target], this.animationId);
  $gameMap.ufcDestroyProjectile(this);
  this._target.attacked(this.damage);
  this.destroy = true;
};

Game_ufcProjectile.prototype.isMoving = function () {
  return true;
};

const Sprite_ufcGrid = function () {
  this.initialize(...arguments);
};

Sprite_ufcGrid.prototype = Object.create(Sprite.prototype);
Sprite_ufcGrid.prototype.constructor = Sprite_ufcGrid;

Sprite_ufcGrid.prototype.initialize = function (data) {
  Sprite.prototype.initialize.call(this, data._bitmap);
  this._data = data;
  this.opacity = 60;
  this.z = 20;
  this._data._event.on("showGrid", this.setVisible, this);
  this.setVisible(false);
};

Sprite_ufcGrid.prototype.setVisible = function (visible) {
  this.visible = visible;
};

Sprite_ufcGrid.prototype.update = function () {
  Sprite.prototype.update.call(this);

  this.x = this.screenX(-0.5);
  this.y = this.screenY(-0.5);

  this._data.updateEvents();
};

Sprite_ufcGrid.prototype.screenX = function (x) {
  const tw = $gameMap.tileWidth();
  return Math.floor($gameMap.adjustX(x) * tw + tw / 2);
};

Sprite_ufcGrid.prototype.screenY = function (y) {
  const th = $gameMap.tileHeight();
  return Math.floor($gameMap.adjustY(y) * th + th / 2);
};

Sprite_ufcGrid.prototype.destroy = function (options) {
  this._data._event.removeListener("showGrid", this.setVisible, this);
  Sprite.prototype.destroy.call(this, options);
};

const Sprite_ufcProjectile = function () {
  this.initialize(...arguments);
};

Sprite_ufcProjectile.prototype = Object.create(Sprite.prototype);
Sprite_ufcProjectile.prototype.constructor = Sprite_ufcProjectile;

Sprite_ufcProjectile.prototype.initialize = function (projectileData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(projectileData);
};

Sprite_ufcProjectile.prototype.initMembers = function (projectileData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._projectileData = projectileData;
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this.setCharacterBitmap();
};

Sprite_ufcProjectile.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcProjectile.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcProjectile.prototype.checkCharacter = function (character) {
  return character == this._projectileData;
};

Sprite_ufcProjectile.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  this.updatePosition();

  if (this._projectileData.destroy || !this._projectileData) {
    this.destroy();
  }
};

Sprite_ufcProjectile.prototype.setCharacterBitmap = function () {
  if (this._projectileData.characterName == "?") {
    this.bitmap = ImageManager.loadCharacter("");
  } else {
    this.bitmap = ImageManager.loadCharacter(
      this._projectileData.characterName
    );
  }
  this.updateCharacterFrame();
};

Sprite_ufcProjectile.prototype.updatePosition = function () {
  this.x = this._projectileData.canvasX;
  this.y = this._projectileData.canvasY;
  this.rotation = this._projectileData.rotation + PIXI.DEG_TO_RAD * -90;
};

Sprite_ufcProjectile.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcProjectile.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcProjectile.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcProjectile.prototype.characterBlockX = function () {
  const index = this._projectileData.characterIndex;
  return (index % 4) * 3;
};

Sprite_ufcProjectile.prototype.characterBlockY = function () {
  return this._projectileData.characterIndexY;
};

Sprite_ufcProjectile.prototype.characterPatternX = function () {
  return this._projectileData.pattern();
};

Sprite_ufcProjectile.prototype.characterPatternY = function () {
  return (this._projectileData.direction() - 2) / 2;
};

Sprite_ufcProjectile.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

const Sprite_ufcTDEnemy = function () {
  this.initialize(...arguments);
};

Sprite_ufcTDEnemy.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemy.prototype.constructor = Sprite_ufcTDEnemy;

Sprite_ufcTDEnemy.prototype.initialize = function (enemyData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(enemyData);
};

Sprite_ufcTDEnemy.prototype.initMembers = function (enemyData) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._enemy = enemyData;
  this._enemyData = this._enemy.getEnemyData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._destroy = false;
  this.scale.x = this._enemyData.scale;
  this.scale.y = this._enemyData.scale;
  this._enemy._event.on("addEffect", this.addEffect, this);
  this._enemy._event.on("removeEffect", this.removeEffect, this);
  this.setCharacterBitmap();
};

Sprite_ufcTDEnemy.prototype.destroy = function () {
  this._enemy._event.removeListener("addEffect", this.addEffect, this);
  this._enemy._event.removeListener("removeEffect", this.removeEffect, this);
  Sprite.prototype.destroy.call(this);
};

Sprite_ufcTDEnemy.prototype.addEffect = function (effect) {
  let _effect = 0;
  switch (effect) {
    case TowerDefenseManager.EFFECTS.COLD:
      _effect = 10;
      break;
    case TowerDefenseManager.EFFECTS.POISON:
      _effect = 1;
      break;
  }
  this.addChild(new Sprite_ufcTDEnemyEffect(effect, _effect, 0, 25));
};

Sprite_ufcTDEnemy.prototype.removeEffect = function (effect) {
  for (const child of this.children) {
    if (child._name == effect) {
      child.destroy();
      break;
    }
  }
};

Sprite_ufcTDEnemy.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDEnemy.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDEnemy.prototype.checkCharacter = function (character) {
  return character == this._enemy;
};

Sprite_ufcTDEnemy.prototype.update = function () {
  if (this._destroy) {
    // Waiting for animation to get destroyed check towerdefense Spriteset_Map.prototype.removeAnimation
    return;
  }
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  this.updatePosition();
  if (this._enemy.isDestroyed()) {
    this.hide();
  }

  if (!this._enemy.isAnimationPlaying() && this._enemy.isDestroyed()) {
    this.destroyEnemy();
  }
};

Sprite_ufcTDEnemy.prototype.destroyEnemy = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this._destroy = true;
  // since use request animation, this sprite can't be destroyed immediately
  // so try delete it from targes animation first
  SceneManager.getSpriteSetMap().removeTargetFromAnimation(this);

  this.destroy();
};

Sprite_ufcTDEnemy.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._enemyData.characterName);
  this._isBigCharacter = false;
  this.updateCharacterFrame();
};

Sprite_ufcTDEnemy.prototype.updatePosition = function () {
  this.x = this._enemy.screenX();
  this.y = this._enemy.screenY();
  this.z = this._enemy.screenZ();
};

Sprite_ufcTDEnemy.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDEnemy.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDEnemy.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDEnemy.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._enemyData.characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDEnemy.prototype.characterPatternX = function () {
  return this._enemy.pattern();
};

Sprite_ufcTDEnemy.prototype.characterPatternY = function () {
  return (this._enemy.direction() - 2) / 2;
};

Sprite_ufcTDEnemy.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

function Sprite_ufcTDEnemyEffect() {
  this.initialize(...arguments);
}

Sprite_ufcTDEnemyEffect.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDEnemyEffect.prototype.constructor = Sprite_ufcTDEnemyEffect;

Sprite_ufcTDEnemyEffect.prototype.initialize = function (
  name,
  stateIndex,
  x,
  y
) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(name, stateIndex, x, y);
  this.loadBitmap();
};

Sprite_ufcTDEnemyEffect.prototype.initMembers = function (
  name,
  stateIndex,
  x = 0,
  y = 0
) {
  this._name = name;
  this._overlayIndex = stateIndex;
  this._animationCount = 0;
  this._pattern = 0;
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this.x = x;
  this.y = y;
};

Sprite_ufcTDEnemyEffect.prototype.loadBitmap = function () {
  this.bitmap = ImageManager.loadSystem("States");
  this.setFrame(0, 0, 0, 0);
};

Sprite_ufcTDEnemyEffect.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this._animationCount++;
  if (this._animationCount >= this.animationWait()) {
    this.updatePattern();
    this.updateFrame();
    this._animationCount = 0;
  }
};

Sprite_ufcTDEnemyEffect.prototype.animationWait = function () {
  return 8;
};

Sprite_ufcTDEnemyEffect.prototype.updatePattern = function () {
  this._pattern++;
  this._pattern %= 8;
};

Sprite_ufcTDEnemyEffect.prototype.updateFrame = function () {
  if (this._overlayIndex > 0) {
    const w = 96;
    const h = 96;
    const sx = this._pattern * w;
    const sy = (this._overlayIndex - 1) * h;
    this.setFrame(sx, sy, w, h);
  } else {
    this.setFrame(0, 0, 0, 0);
  }
};

const Sprite_ufcTDTower = function () {
  this.initialize(...arguments);
};

Sprite_ufcTDTower.prototype = Object.create(Sprite.prototype);
Sprite_ufcTDTower.prototype.constructor = Sprite_ufcTDTower;

Sprite_ufcTDTower.prototype.initialize = function (ufcTD) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(ufcTD);
};

Sprite_ufcTDTower.prototype.initMembers = function (ufcTD) {
  this.anchor.x = 0.5;
  this.anchor.y = 1;
  this._tower = ufcTD;
  this._towerData = ufcTD.getTowerData();
  this._balloonDuration = 0;
  this._tilesetId = 0;
  this._upperBody = null;
  this._lowerBody = null;
  this._range = this._tower.getTowerData()._range;

  let _rangeGraphics = new PIXI.Graphics();
  _rangeGraphics.beginFill(0x17b978, 0.4);
  _rangeGraphics.drawRect(
    0,
    0,
    (this._range * 2 + 1) * $gameMap.tileWidth(),
    (this._range * 2 + 1) * $gameMap.tileHeight()
  );
  _rangeGraphics.endFill();

  let rangeSprite = Graphics.app.renderer.generateTexture(_rangeGraphics);
  this._rangeGraphics = new PIXI.Sprite(rangeSprite);
  this._rangeGraphics.anchor.x = 0.5;
  this._rangeGraphics.anchor.y = 0.5;
  this._rangeGraphics.x = 0;
  this._rangeGraphics.y = -$gameMap.tileHeight() / 2;

  this.addChild(this._rangeGraphics);
  this.setCharacterBitmap();
  this._rangeVisible = this._towerData._rangeVisible;
  if (this._towerData._placeMode) this.setSelectPosition();

  this.setVisibleRange(this._rangeVisible);
};

Sprite_ufcTDTower.prototype.setSelectPosition = function () {
  this.move($gameMap.tileWidth() / 2, $gameMap.tileHeight());
};

Sprite_ufcTDTower.prototype.getRangeGraphics = function () {
  return this._rangeGraphics;
};

Sprite_ufcTDTower.prototype.checkCharacter = function (character) {
  return character == this._tower;
};

Sprite_ufcTDTower.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateCharacterFrame();
  if (this._towerData._placeMode) return;
  this.updatePosition();
  if (this._tower.isDestroyed()) this.destroySprite();
};

Sprite_ufcTDTower.prototype.destroySprite = function () {
  $gameMap.ufcDestroyCharacterSprite(this);
  this.destroy();
};

Sprite_ufcTDTower.prototype.setCharacterBitmap = function () {
  this.bitmap = ImageManager.loadCharacter(this._towerData._character);
  this._isBigCharacter = ImageManager.isBigCharacter(
    this._towerData._character
  );
  this.updateCharacterFrame();
};

Sprite_ufcTDTower.prototype.updatePosition = function () {
  this.x = this._tower.screenX();
  this.y = this._tower.screenY();
  this.z = this._tower.screenZ();
};

Sprite_ufcTDTower.prototype.updateCharacterFrame = function () {
  const pw = this.patternWidth();
  const ph = this.patternHeight();
  const sx = (this.characterBlockX() + 1) * pw;
  const sy = (this.characterBlockY() + 0) * ph;
  this.setFrame(sx, sy, pw, ph);
};

Sprite_ufcTDTower.prototype.patternWidth = function () {
  if (this._tileId > 0) {
    return $gameMap.tileWidth();
  } else if (this._isBigCharacter) {
    return this.bitmap.width / 3;
  } else {
    return this.bitmap.width / 12;
  }
};

Sprite_ufcTDTower.prototype.patternHeight = function () {
  if (this._tileId > 0) {
    return $gameMap.tileHeight();
  } else if (this._isBigCharacter) {
    return this.bitmap.height / 4;
  } else {
    return this.bitmap.height / 8;
  }
};

Sprite_ufcTDTower.prototype.characterBlockX = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return (index % 4) * 3;
  }
};

Sprite_ufcTDTower.prototype.characterBlockY = function () {
  if (this._isBigCharacter) {
    return 0;
  } else {
    const index = this._towerData._characterIndex;
    return Math.floor(index / 4) * 4;
  }
};

Sprite_ufcTDTower.prototype.setVisibleRange = function (visible) {
  this._rangeGraphics.visible = visible;
};

Sprite_ufcTDTower.prototype.setPosition = function (x, y) {
  let pos = $gameMap.positionToCanvas(x, y);
  this.move(pos.x, pos.y);
};

PluginManager.registerCommand("UFCTowerDefense", "setupEnemy", function (args) {
  args.characterName = $gameMap._events[this._eventId]._characterName;
  args.characterIndex = $gameMap._events[this._eventId]._characterIndex;
  TowerDefenseManager.addDBEnemy(args);
});

PluginManager.registerCommand("UFCTowerDefense", "setSpawn", function (args) {
  if (!$dataTDSpawnLocation[this._mapId])
    $dataTDSpawnLocation[this._mapId] = {};

  args._x = $gameMap._events[this._eventId]._x;
  args._y = $gameMap._events[this._eventId]._y;
  $dataTDSpawnLocation[this._mapId][this._eventId] = new ufcTowerSpawnData(
    args
  );
});

PluginManager.registerCommand("UFCTowerDefense", "showGold", function (args) {
  TowerDefenseManager.showHUDTDGold(args);
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "updateHealthHud",
  function () {
    $gameMap.updateHealthHud();
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "showHealthBar",
  function (args) {
    TowerDefenseManager.showHUDTDHealth(args);
  }
);

PluginManager.registerCommand("UFCTowerDefense", "config", function (args) {
  TowerDefenseManager.config(args);
});

PluginManager.registerCommand("UFCTowerDefense", "startWave", function (args) {
  $gameMap.addTowerDefenseNewWave(args);
});

PluginManager.registerCommand(
  "UFCTowerDefense",
  "limitAnimation",
  function (args) {
    TowerDefenseManager.setLimitAnimation(+args["limit"]);
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerMove",
  function (args) {
    if (!$dataTDTrigger[this._mapId]) {
      $dataTDTrigger[this._mapId] = [];
    }
    let evnt = $gameMap._events[this._eventId];
    if (!$dataTDTrigger[this._mapId][evnt._x]) {
      $dataTDTrigger[this._mapId][evnt._x] = [];
    }
    if (!$dataTDTrigger[this._mapId][evnt._x][evnt._y]) {
      $dataTDTrigger[this._mapId][evnt._x][evnt._y] = {};
    }

    $dataTDTrigger[this._mapId][evnt._x][evnt._y].direction = args["direction"];
  }
);

PluginManager.registerCommand(
  "UFCTowerDefense",
  "triggerDestroy",
  function (args) {
    if (!$dataTDTrigger[this._mapId]) {
      $dataTDTrigger[this._mapId] = [];
    }
    let evnt = $gameMap._events[this._eventId];
    if (!$dataTDTrigger[this._mapId][evnt._x]) {
      $dataTDTrigger[this._mapId][evnt._x] = [];
    }
    if (!$dataTDTrigger[this._mapId][evnt._x][evnt._y]) {
      $dataTDTrigger[this._mapId][evnt._x][evnt._y] = {};
    }

    $dataTDTrigger[this._mapId][evnt._x][evnt._y].destroy = {
      attack: args["attack"] == "true",
      attackEventId: args["attackEventId"],
      animationId: args["animationId"],
    };
  }
);

PIXI.utils.dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

PIXI.utils.randomArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

SceneManager.getScene = function () {
  return this._scene;
};

SceneManager.getSpriteSetMap = function () {
  return this.getScene()._spriteset;
};

const _Datamanager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
  _Datamanager_createGameObjects.call(this);
  TowerDefenseManager.initialize();
};

// Add Status Tower For shop -----------------------------------------
const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
Window_ShopStatus.prototype.refresh = function () {
  _Window_ShopStatus_refresh.call(this);

  if (this._item) {
    if (this.isTowerItem) {
      this.drawTowerInfo(0, 60, "center");
    }
  }
};

Window_ShopStatus.prototype.drawTowerInfo = function (x, y, align) {
  let towerData = this._item.ufcTower;
  let characterImage = ImageManager.loadCharacter(towerData.character);
  let characterIndex = towerData.characterindex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.5;
  if (align == "center") {
    x += this.width / 2;
    x -= (pw * scale) / 2;
    x -= this.itemPadding();
  }
  this.contents.blt(
    characterImage,
    sx,
    sy,
    pw,
    ph,
    x,
    y,
    pw * scale,
    ph * scale
  );

  let textY = y + 100;
  let textX = 10;
  let textHeight = 30;
  let textValueX = 180;
  let fontSize = 20;
  let status = ["Attack", "Range", "Attack Speed", "Bullet Speed"];
  let statusValue = [
    towerData.attack,
    towerData.range,
    towerData.attackspeed,
    towerData.bulletspeed,
  ];
  this.contents.fontSize = fontSize;
  for (let i = 0; i < status.length; i++) {
    this.resetTextColor();
    this.drawText(status[i], textX, textY + i * textHeight, 150);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(
      statusValue[i],
      textX + textValueX,
      textY + i * textHeight,
      150
    );
  }
  this.resetTextColor();
  this.drawText("Effect", textX, textY + status.length * textHeight, 150);

  let effectNote = `\\FS[${fontSize - 3}]\n`;
  if (!towerData.effectsnote) effectNote += "\\C[16]None";

  this.drawTextEx(
    effectNote + towerData.effectsnote.replace(/\\n/g, "\n"),
    textX,
    textY + status.length * textHeight - 5,
    200
  );
  this.resetFontSettings();
};

Window_ShopStatus.prototype.isTowerItem = function () {
  return !!this._item.ufcTower;
};

// ------------------------------------------------------------------

Game_Character.prototype.moveAwayFromHere = function () {
  const d = [4, 2, 6, 8];
  for (let i = 0; i < d.length; i++) {
    if (this.canPass(this.x, this.y, d[i])) {
      this.moveStraight(d[i]);
      return true;
    }
  }
  return false;
};

const _Game_Player_triggerButtonAction =
  Game_Player.prototype.triggerButtonAction;
Game_Player.prototype.triggerButtonAction = function () {
  if (
    Input.isTriggered("ok") &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    !this.getGuideAction().isBlocked()
  ) {
    TowerDefenseManager.placeTower();
    return true;
  }

  if (Input.isTriggered("ok") && this.checkEventTower()) {
    return true;
  }

  return _Game_Player_triggerButtonAction.apply(this, arguments);
};

const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function () {
  if (
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    this.getInputDirection() > 0 &&
    this.getGuideAction().isMouseMode
  ) {
    this.getGuideAction().setMouseMode(false);
  }
  _Game_Player_moveByInput.call(this);
};

const _Game_Player_executeMove = Game_Player.prototype.executeMove;
Game_Player.prototype.executeMove = function () {
  if (
    $gameTemp.isDestinationValid() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD
  ) {
    const destX = $gameTemp.destinationX();
    const destY = $gameTemp.destinationY();
    let dist = $gameMap.distance(this.x, this.y, destX, destY);
    if (dist <= 1) {
      this.turnTowardCharacter({ x: destX, y: destY });
      this.getGuideAction().updateBlocked();
      if (!this.getGuideAction().isBlocked()) {
        TowerDefenseManager.placeTower();
        $gameTemp.clearDestination();
      } else {
        this.getGuideAction().clearTrigger();
      }
      return;
    }
  }
  _Game_Player_executeMove.call(this, ...arguments);
};

const _Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function () {
  _Game_Player_update.call(this, ...arguments);

  if (
    TouchInput.isTriggered() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD
  ) {
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);
    if (this.pos(x, y)) {
      let t = this.moveAwayFromHere();
      if (t) $gameTemp.setDestination(x, y);
    }
  }
};

// Touch input, check event there (check function Game_Player.prototype.triggerTouchAction)
const _Game_Player_triggerTouchActionD2 =
  Game_Player.prototype.triggerTouchActionD2;
Game_Player.prototype.triggerTouchActionD2 = function (x2, y2) {
  if (this.checkEventTower(x2, y2)) return true;

  return _Game_Player_triggerTouchActionD2.call(this, ...arguments);
};

Game_Player.prototype.checkEventTower = function (x, y) {
  if (TowerDefenseManager.getState != TowerDefenseManager.STATE.IDLE) return;
  let x2 = x;
  let y2 = y;
  if (!x2 || !y2) {
    if ($gameMap.isEventRunning()) return false;
    x2 = $gameMap.roundXWithDirection(this._x, this._direction);
    y2 = $gameMap.roundYWithDirection(this._y, this._direction);
  }
  const events = $gameMap.eventsXyNt(x2, y2);
  const tower = events.filter((event) => event instanceof Game_TowerDefense);
  if (tower.length <= 0) return false;
  else {
    tower[0].actionTower();
    return true;
  }
};

// still not sure if I should cache here instead using event
// const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
// Scene_Boot.prototype.loadSystemImages = function () {
//   _Scene_Boot_loadSystemImages.call(this);
//   ImageManager.loadSystem("TDSet");
// };

const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function () {
  _Scene_Map_updateCallMenu.call(this);
  if (
    !this.isMenuEnabled() &&
    TowerDefenseManager.getState == TowerDefenseManager.STATE.BUILD &&
    this.isMenuCalled()
  ) {
    TowerDefenseManager.cancelSelect();
  }
};

var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  _Scene_Map_createAllWindows.call(this);
  this.createGoldWindow();
  this.createTowerActionButtonWindow();
  this.createTDHealth();
};

// ----------------------------------- HUD --------------------------------
Scene_Map.prototype.createTDHealth = function () {
  let windowWidth = 200;
  this._TDHealthWindow = new Window_TDHealth(
    new Rectangle(Graphics.boxWidth / 2 - windowWidth / 2, -10, windowWidth, 80)
  );
  this.addWindow(this._TDHealthWindow);
  this._TDHealthWindow.visible = TowerDefenseManager.getHUDHealth;
};

Scene_Map.prototype.createGoldWindow = function () {
  this._goldWindow = new Window_Gold(
    new Rectangle(0, 0, 200, this.calcWindowHeight(1, true))
  );
  this.addWindow(this._goldWindow);
  this._goldWindow.visible = TowerDefenseManager.getHUDGold;
};

Scene_Map.prototype.createTowerActionButtonWindow = function () {
  this._towerActionButton = new Window_TowerActionButton(
    new Rectangle(100, Graphics.boxHeight - 200, Graphics.boxWidth - 200, 200)
  );
  this.addWindow(this._towerActionButton);
};

Scene_Map.prototype.getTowerAction = function () {
  return this._towerActionButton;
};
// ----------------------------------- End HUD -------------------------

const _Scene_ItemBase_applyItem = Scene_ItemBase.prototype.applyItem;
Scene_ItemBase.prototype.applyItem = function () {
  _Scene_ItemBase_applyItem.apply(this, arguments);
  if (this.item().ufcTower) {
    TowerDefenseManager.selectTower(this.item().ufcTower);
    SceneManager.goto(Scene_Map);
  }
};

// Change Gold
const _Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
Game_Interpreter.prototype.command125 = function () {
  _Game_Interpreter_command125.apply(this, arguments);
  $gameMap.updateGoldHud();
  return true;
};

// variable to make message busy
const _Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  _Game_Message_clear.call(this);
  this._windowTowerActionShow = false;
};

const _Game_Message_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
  return this._windowTowerActionShow || _Game_Message_isBusy.call(this);
};

Game_Message.prototype.setWindowTower = function (showTower) {
  this._windowTowerActionShow = showTower;
};

const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function () {
  _Game_Map_initialize.apply(this, arguments);
  this._towerDefenseList = [];
  this._towerDefenseWave = [];
  this._towerDefenseEnemy = [];
  this._towerDefenseProjectile = [];
  this._towerDefenseGrid = null;
};

const _Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
  _Game_Map_setup.call(this, mapId);
  this._towerDefenseGrid = new Data_ufcGrid();
};

Game_Map.prototype.ufcGetGrid = function () {
  return this._towerDefenseGrid;
};

Game_Map.prototype.ufcCalcGrid = function () {
  this.ufcGetGrid().calcGrid();
};

Game_Map.prototype.updateGoldHud = function () {
  SceneManager.getScene()._goldWindow.refresh();
};

Game_Map.prototype.updateHealthHud = function () {
  SceneManager.getScene()._TDHealthWindow.refresh();
};

Game_Map.prototype.ufcGetTowerDefenseList = function () {
  return this._towerDefenseList;
};

Game_Map.prototype.ufcTowerAction = function (towerData) {
  SceneManager.getScene().getTowerAction().setTower(towerData);
};

// _characterSprites is used by rpgmaker engine to play animation
// if sprite need animation they need to push it to _characterSprites array
Game_Map.prototype.ufcAddCharacterSprites = function (characterSprite) {
  const _spriteSet = SceneManager.getSpriteSetMap();
  let newSpritesetIndex = _spriteSet._characterSprites.push(characterSprite);
  _spriteSet._tilemap.addChild(
    _spriteSet._characterSprites[newSpritesetIndex - 1]
  );
};
Game_Map.prototype.getCharacterSprites = function () {
  return SceneManager.getSpriteSetMap()._characterSprites;
};
Game_Map.prototype.ufcAddProjectile = function (projectileData) {
  // since projectile dont need animation, don't include to _charactersprites
  const _spriteSet = SceneManager.getSpriteSetMap();
  let newTowerIndex = this._towerDefenseProjectile.push(projectileData);
  _spriteSet._tilemap.addChild(
    new Sprite_ufcProjectile(this._towerDefenseProjectile[newTowerIndex - 1])
  );
};

Game_Map.prototype.ufcAddTower = function (towerData) {
  let newTowerIndex = this._events.push(
    new Game_TowerDefense(towerData, this._mapId)
  );
  this.ufcAddCharacterSprites(
    new Sprite_ufcTDTower(this._events[newTowerIndex - 1])
  );
};

Game_Map.prototype.ufcSpawnEnemy = function (enemyName, spawnId) {
  let newEnemy = this._towerDefenseEnemy.push(
    new Game_TDEnemy(enemyName, spawnId)
  );
  this.ufcAddCharacterSprites(
    new Sprite_ufcTDEnemy(this._towerDefenseEnemy[newEnemy - 1])
  );
};

Game_Map.prototype.ufcDestroyCharacterSprite = function (character) {
  return this.getCharacterSprites().remove(character);
};

Game_Map.prototype.ufcDestroyProjectile = function (projectile) {
  return this._towerDefenseProjectile.remove(projectile);
};

Game_Map.prototype.ufcDestroyEnemy = function (enemy) {
  return this._towerDefenseEnemy.remove(enemy);
};

Game_Map.prototype.ufcDestroyTower = function (tower) {
  return this._events.remove(tower);
};

Game_Map.prototype.ufcEnemies = function () {
  return this._towerDefenseEnemy;
};

Game_Map.prototype.ufcProjectiles = function () {
  return this._towerDefenseProjectile;
};

Game_Map.prototype.isWaveEnd = function () {
  return this.ufcEnemies().length <= 0 && this._towerDefenseWave.length <= 0;
};

Game_Map.prototype.xToCanvas = function (x) {
  return this.adjustX(x) * this.tileWidth();
};

Game_Map.prototype.yToCanvas = function (y) {
  return this.adjustY(y) * this.tileWidth();
};

Game_Map.prototype.positionToCanvas = function (x, y) {
  return { x: this.xToCanvas(x), y: this.yToCanvas(y) };
};

const _Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function (sceneActive) {
  _Game_Map_update.call(this, sceneActive);
  this.updateTowerDefenseWave();
  this.updateTowerDefenseEnemy();
  this.updateProjectile();
};

Game_Map.prototype.addTowerDefenseNewWave = function (wavedata) {
  this._towerDefenseWave.push(new ufcTowerWaveData(wavedata));
};

Game_Map.prototype.updateTowerDefenseWave = function () {
  if (this._towerDefenseWave.length > 0) {
    let td = this._towerDefenseWave;
    for (let i = 0; i < td.length; i++) {
      td[i].update();

      if (td[i].isSpawnEnemy()) {
        this.ufcSpawnEnemy(...td[i].getEnemy());
        if (td[i].isDone()) {
          td.splice(i, 1);
          i--;
        }
      }
    }
  }
};

Game_Map.prototype.updateTowerDefenseEnemy = function () {
  for (const enemy of this.ufcEnemies()) {
    enemy.update();
  }
};

Game_Map.prototype.updateProjectile = function () {
  for (const projectile of this.ufcProjectiles()) {
    if (!projectile.destroy) projectile.update();
  }
};

Spriteset_Map.prototype.checkLimitAnimation = function () {
  return (
    this._animationSprites.length > TowerDefenseManager.getLimitAnimation &&
    TowerDefenseManager.getLimitAnimation != 0
  );
};

Spriteset_Map.prototype.removeTargetFromAnimation = function (target) {
  for (const anim of this._animationSprites) {
    for (let i = 0; i < anim._targets.length; i++) {
      if (anim._targets[i] == target) {
        anim._targets.splice(i, 1);
        i--;
      }
    }
  }
};

const _Spriteset_Map_createCharacters =
  Spriteset_Map.prototype.createCharacters;

Spriteset_Map.prototype.createCharacters = function () {
  _Spriteset_Map_createCharacters.apply(this, arguments);

  // Create Tower
  let towers = $gameMap._events.filter(
    (event) => event instanceof Game_TowerDefense
  );
  for (const tower of towers) {
    this._tilemap.addChild(new Sprite_ufcTDTower(tower));
  }

  // Create enemy
  for (const enemy of $gameMap.ufcEnemies()) {
    let newSpritesetIndex = this._characterSprites.push(
      new Sprite_ufcTDEnemy(enemy)
    );
    this._tilemap.addChild(this._characterSprites[newSpritesetIndex - 1]);
  }

  for (const projectile of $gameMap.ufcProjectiles()) {
    this._tilemap.addChild(new Sprite_ufcProjectile(projectile));
  }

  this._tilemap.addChild(new Sprite_ufcGrid($gameMap.ufcGetGrid()));
  if (TowerDefenseManager.getState != TowerDefenseManager.STATE.IDLE) {
    TowerDefenseManager.selectTowerMode();
  }
};

function TowerDefenseManager() {
  throw new Error("This is a static class");
}

TowerDefenseManager.initialize = function () {
  this._HUDGold = false;
  this._HUDHealth = false;
  this._towerHealthVarId = 0;
  this._towerHealthMaxVarId = 0;
  this._gameoverSwitchId = 0;
  this._state = TowerDefenseManager.STATE.IDLE;
  this._selectedUFCTD = null;
  this._limitAnimation = 0;
  this._controlBuildingMouse = false;
  this._cacheSprite = [];
  this.addTowerList();
};

TowerDefenseManager.STATE = {
  IDLE: "idle",
  BUILD: "build",
};

TowerDefenseManager.EFFECTS = {
  COLD: "cold",
  POISON: "poison",
};

TowerDefenseManager.setLimitAnimation = function (limit) {
  this._limitAnimation = limit;
};

TowerDefenseManager.attackTower = function (damage) {
  let _curHealth = this.getHUDHealthValue;
  $gameVariables.setValue(this._towerHealthVarId, _curHealth - damage);

  if (_curHealth - damage <= 0) {
    $gameSwitches.setValue(this._gameoverSwitchId, true);
  }

  $gameMap.updateHealthHud();
};

TowerDefenseManager.requestAnimation = function (targets, animation) {
  if (!SceneManager.getSpriteSetMap().checkLimitAnimation())
    $gameTemp.requestAnimation(targets, animation);
};

TowerDefenseManager.showHUDTDGold = function (args) {
  this._HUDGold = args["show"] == "true";
  SceneManager.getScene()._goldWindow.visible = this._HUDGold;
};

TowerDefenseManager.showHUDTDHealth = function (args) {
  this._HUDHealth = args["show"] == "true";
  SceneManager.getScene()._TDHealthWindow.visible = this._HUDHealth;
};

TowerDefenseManager.config = function (args) {
  if (args["onlyTerrain"] != "0") {
    let ot = args["onlyTerrain"].split(",").map(Number);
    $gamePlayer.getGuideAction().setOnlyTerrain(ot);
  }

  if (args["exceptTerrain"] != "0") {
    let ot = args["exceptTerrain"].split(",").map(Number);
    $gamePlayer.getGuideAction().setExceptTerrain(ot);
  }

  if (args["limitAnimation"] != "0") {
    this.setLimitAnimation(+args["limitAnimation"]);
  }

  this._towerHealthVarId = +args["towerHealthVarId"];
  this._towerHealthMaxVarId = +args["towerMaxHealthVarId"];
  $gameMap.updateHealthHud();

  this._gameoverSwitchId = +args["gameoverSwitchId"];

  $gameMap.ufcCalcGrid();

  this.cacheImage();
};

// Cache image that being used in tower data, bullets & character
TowerDefenseManager.cacheImage = function () {
  ImageManager.loadSystem("TDSet");
  for (let image of this._cacheSprite) {
    ImageManager.loadCharacter(image);
  }
};

TowerDefenseManager.isWaveEnd = function () {
  return $gameMap.ufcEnemies().length <= 0;
};

TowerDefenseManager.actionTower = function (towerData, callback) {
  SceneManager.getScene().getTowerAction().setTower(towerData, callback);
};

TowerDefenseManager.selectTower = function (towerData) {
  this._state = TowerDefenseManager.STATE.BUILD;
  this._selectedUFCTD = new ufcTowerData(towerData);
  this._selectedUFCTD.setPlaceMode(true);
  // Disable Open Menu
  $gameSystem.disableMenu();
};

TowerDefenseManager.cancelSelect = function () {
  $gameParty.gainItem($dataItems[this._selectedUFCTD._id], 1);
  // SFX
  AudioManager.playSe({
    name: "Cancel1",
    volume: 100,
    pitch: 100,
    pan: 0,
  });
  this.clearSelect();
};

TowerDefenseManager.clearSelect = function () {
  this._state = TowerDefenseManager.STATE.IDLE;
  this._selectedUFCTD = null;
  $gameSystem.enableMenu();
  $gamePlayer.getGuideAction().setActive(false);
  $gamePlayer.getGuideActionGraphics().removeChildAt(0);
  $gameMap.ufcGetGrid().setVisible(false);
};

TowerDefenseManager.selectTowerMode = function () {
  const selectedTower = new Sprite_ufcTDTower(
    new Game_TowerDefense(this.getSelectedTowerData(), $gameMap._mapId)
  );
  $gamePlayer.getGuideAction().setActive(true);

  $gamePlayer.getGuideActionGraphics().addChild(selectedTower);
  $gameMap.ufcGetGrid().setVisible(true);
};

TowerDefenseManager.getSelectedTowerData = function () {
  return this._selectedUFCTD;
};

TowerDefenseManager.addDBEnemy = function (enemyData) {
  if (!$dataTDEnemy[enemyData.id]) {
    $dataTDEnemy[enemyData.id] = {};
  } else {
    // console.warn("Duplicate ID for " + enemyData.id);
    return;
  }

  for (let data in enemyData) {
    $dataTDEnemy[enemyData.id][data] = enemyData[data];
  }
};

TowerDefenseManager.placeTower = function () {
  let _gPosition = $gamePlayer.getGuideAction().getPosition();
  this._selectedUFCTD._x = _gPosition.x;
  this._selectedUFCTD._y = _gPosition.y;
  this._selectedUFCTD._rangeVisible = false;
  this._selectedUFCTD.setPlaceMode(false);
  $gameMap.ufcAddTower(this._selectedUFCTD);

  this.clearSelect();

  // SFX
  AudioManager.playSe({
    name: "Equip1",
    volume: 100,
    pitch: 100,
    pan: 0,
  });
};

Object.defineProperty(TowerDefenseManager, "getState", {
  get: function () {
    return this._state;
  },
});

Object.defineProperty(TowerDefenseManager, "getLimitAnimation", {
  get: function () {
    return this._limitAnimation;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDGold", {
  get: function () {
    return this._HUDGold;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealth", {
  get: function () {
    return this._HUDHealth;
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealthValue", {
  get: function () {
    return $gameVariables.value(this._towerHealthVarId);
  },
});

Object.defineProperty(TowerDefenseManager, "getHUDHealthMaxValue", {
  get: function () {
    return $gameVariables.value(this._towerHealthMaxVarId);
  },
});

TowerDefenseManager.addTowerList = function () {
  for (let i = 0; i < $dataItems.length; i++) {
    if ($dataItems[i] && $dataItems[i].note) this.addTower(i, $dataItems[i]);
  }
};

TowerDefenseManager.addTower = function (itemid, item) {
  const lines = item.note.split(/[\r\n]+/);
  let tdMode = false;
  let data = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/<ufcTD>/)) {
      tdMode = true;
      data = {};
    }

    if (lines[i].match(/<\/ufcTD>/)) {
      break;
    }

    if (tdMode) {
      let dataNote = /<(\w*)(:?)([^>]*)>/g.exec(lines[i]);
      if (dataNote) data[dataNote[1]] = dataNote[3];
    }
  }
  if (data) {
    data.id = itemid;
    data.name = item.name;
    item.ufcTower = data;
    item.ufcTower.bulletanimationid = item.animationId;
    if (
      this._cacheSprite.indexOf(item.ufcTower.character) === -1 &&
      item.ufcTower.character
    ) {
      this._cacheSprite.push(item.ufcTower.character);
    }

    if (
      this._cacheSprite.indexOf(item.ufcTower.bulletspritename) === -1 &&
      item.ufcTower.bulletspritename != "?"
    ) {
      this._cacheSprite.push(item.ufcTower.bulletspritename);
    }
  }
};

TowerDefenseManager.convertDirection = function (direction) {
  let dir = 2;
  let _isMultipleDirection = direction.split("/");
  if (_isMultipleDirection.length > 1) {
    direction = PIXI.utils.randomArray(_isMultipleDirection);
  }
  switch (direction) {
    case "Left":
      dir = 4;
      break;
    case "Right":
      dir = 6;
      break;
    case "Down":
      dir = 2;
      break;
    case "Up":
      dir = 8;
      break;
    case "Random":
      dir = PIXI.utils.randomArray([4, 6, 2, 8]);
      break;
  }

  return dir;
};

const ufcTowerData = function () {
  this.initialize(...arguments);
};

ufcTowerData.prototype.initialize = function (data) {
  this._id = data["id"];
  this._name = data["name"];
  this._attack = data["attack"];
  this._range = +data["range"];
  this._character = data["character"];
  this._characterIndex = data["characterindex"];
  this._attackSpeed = data["attackspeed"];
  this._bulletSpeed = data["bulletspeed"];
  this._bulletAnimationId = data["bulletanimationid"];
  this._bulletCharacterName = data["bulletspritename"];
  this._bulletCharacterIndex = data["bulletspriteindex"];
  this._bulletCharacterIndexY = data["bulletspriteindexy"];
  this._upgradeId = data["upgradeid"];
  if (this._upgradeId != "?" && data["upgradeprice"] == "?") {
    this._upgradePrice = $dataItems[this._upgradeId].price;
  } else {
    this._upgradePrice = data["upgradeprice"];
  }
  if (data["sellprice"] == "?") {
    this._sellPrice = $dataItems[this._id].price / 2;
  } else {
    this._sellPrice = data["sellprice"];
  }
  this._effects = [];
  if (data["effects"]) {
    let effects = data["effects"].split(",");
    for (const effect of effects) {
      let _effect = effect.split("|");
      this._effects.push({
        name: _effect[0],
        effect: _effect[1],
        duration: _effect[2],
      });
    }
  }
  this._effectsNote = data["effectsnote"];
  this._x = 0;
  this._y = 0;
  this._rangeVisible = true;
  this._placeMode = false;
};

ufcTowerData.prototype.setPlaceMode = function (mode) {
  this._placeMode = mode;
};

Object.defineProperty(ufcTowerData.prototype, "getPlaceMode", {
  get: function () {
    return this._placeMode;
  },
});

const ufcTowerEffects = function () {
  this.initialize(...arguments);
};

ufcTowerEffects.prototype.initialize = function (data) {
  this._name = data.name;
  this._effect = data.effect;
  this._duration = +data.duration;
  this._curTime = this._duration;
  this._isDone = false;
  this._effectPerSecond = false;
  this._epsTimeDefault = 60;
  this._epsTime = this._epsTimeDefault;
  this._epsCallback = null;
  switch (this._name) {
    case TowerDefenseManager.EFFECTS.POISON:
      this._effectPerSecond = true;
      break;
  }
};

ufcTowerEffects.prototype.setEPSCallback = function (callback) {
  this._epsCallback = callback;
};
ufcTowerEffects.prototype.epsCallback = function () {
  if (this._epsCallback) {
    this._epsCallback();
  }
};

ufcTowerEffects.prototype.getEffect = function () {
  return this._effect;
};

ufcTowerEffects.prototype.isDone = function () {
  return this._isDone;
};

ufcTowerEffects.prototype.update = function () {
  if (this._effectPerSecond) {
    this._epsTime--;
    if (this._epsTime <= 0) {
      this._epsTime = this._epsTimeDefault;
      this.epsCallback();
    }
  }

  this._curTime--;
  if (this._curTime <= 0) this._isDone = true;
};

ufcTowerEffects.prototype.reset = function () {
  this._curTime = this._duration;
  this._isDone = false;
};

const ufcTowerSpawnData = function () {
  this.initialize(...arguments);
};

ufcTowerSpawnData.prototype.initialize = function (data) {
  this._x = data._x;
  this._y = data._y;
  this._direction = data["direction"];
};

const ufcTowerWaveData = function () {
  this.initialize(...arguments);
};

ufcTowerWaveData.prototype.initialize = function (data) {
  this._spawnLocationId = data["spawnLocationId"];
  this._enemy = data["enemy"];
  this._numberSpawn = +data["numberSpawn"];
  this._delayPerSpawn = +data["delayPerSpawn"];
  this._delay = +data["delay"];
  this._start = false;
  this._startSE = data["startSE"];
  this._startSEVolume = +data["startSEVolume"];
  this._timeSpawn = 0;
  this._spawnEnemy = false;
};

ufcTowerWaveData.prototype.getEnemy = function () {
  return [this._enemy, this._spawnLocationId];
};

ufcTowerWaveData.prototype.update = function () {
  if (this._delay > 0) {
    this._delay--;
    return;
  }

  if (!this._start) {
    this._start = true;
    if (this._startSE != "0") {
      AudioManager.playSe({
        name: this._startSE,
        volume: this._startSEVolume,
        pitch: 100,
        pan: 0,
      });
    }
  }

  this._timeSpawn--;
  if (this._timeSpawn <= 0) {
    this.spawnEnemy();
  }
};

ufcTowerWaveData.prototype.spawnEnemy = function () {
  this._spawnEnemy = true;
  this._timeSpawn = this._delayPerSpawn;
  this._numberSpawn--;
};

ufcTowerWaveData.prototype.isSpawnEnemy = function () {
  if (this._spawnEnemy) {
    this._spawnEnemy = false;
    return true;
  }
  return false;
};

ufcTowerWaveData.prototype.isDone = function () {
  return this._numberSpawn <= 0;
};

function Window_BaseExtend() {
  this.initialize(...arguments);
}

Window_BaseExtend.prototype = Object.create(Window_Base.prototype);
Window_BaseExtend.prototype.constructor = Window_BaseExtend;

Window_BaseExtend.prototype.initialize = function (rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._lineHeight = Window_Base.prototype.lineHeight();
  this._defaultLineHeight = this._lineHeight;
};

Window_BaseExtend.prototype.lineHeight = function () {
  return this._lineHeight;
};

Window_BaseExtend.prototype.setLineHeight = function (lineheight) {
  this._lineHeight = lineheight;
};

Window_BaseExtend.prototype.resetLineHeight = function () {
  this._lineHeight = this._defaultLineHeight;
};

Window_BaseExtend.prototype.drawTextEx = function (text, x, y, width, align) {
  if (align == "center") {
    let textWidth = this.textSizeEx(text).width;
    x += this.itemWidth() / 2;
    x -= textWidth / 2;
    x -= this.itemPadding() * 2;
  }
  this.resetFontSettings();
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);
  return textState.outputWidth;
};

function Window_TDHealth() {
  this.initialize(...arguments);
}

Window_TDHealth.prototype = Object.create(Window_Selectable.prototype);
Window_TDHealth.prototype.constructor = Window_TDHealth;

Window_TDHealth.prototype.initialize = function (rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this.opacity = 0;
  this.refresh();
};

Window_TDHealth.prototype.colSpacing = function () {
  return 0;
};

Window_TDHealth.prototype.refresh = function () {
  const rect = this.itemLineRect(0);
  this.contents.clear();
  this.contents.fontSize = 22;
  this.drawBackground(-5, 3, 200, 30);
  this.drawText("Crystal Health", -10, 0, 200, "center");
  this.drawGaugeRect(0, rect.height, this.innerWidth, 20);
};

Window_TDHealth.prototype.drawBackground = function (x, y, width, height) {
  const color1 = ColorManager.dimColor1();
  const color2 = ColorManager.dimColor2();
  const half = width / 2;
  this.contents.gradientFillRect(x, y, half, height, color2, color1);
  this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
};

Window_TDHealth.prototype.drawGaugeRect = function (x, y, width, height) {
  const rate = this.gaugeRate(
    TowerDefenseManager.getHUDHealthValue,
    TowerDefenseManager.getHUDHealthMaxValue
  );
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  const color0 = ColorManager.gaugeBackColor();
  const color1 = ColorManager.hpGaugeColor1();
  const color2 = ColorManager.hpGaugeColor2();
  this.contents.fillRect(x, y, width, height, color0);
  this.contents.gradientFillRect(x, y, fillW, fillH, color1, color2);
};

Window_TDHealth.prototype.gaugeRate = function (val, max) {
  const value = val;
  const maxValue = max;
  return maxValue > 0 ? value / maxValue : 0;
};

Window_TDHealth.prototype.value = function () {
  return $gameParty.gold();
};

Window_TDHealth.prototype.open = function () {
  this.refresh();
  Window_Selectable.prototype.open.call(this);
};

function Window_TowerActionButton() {
  this.initialize(...arguments);
}

Window_TowerActionButton.prototype = Object.create(
  Window_HorzCommand.prototype
);
Window_TowerActionButton.prototype.constructor = Window_TowerActionButton;

Window_TowerActionButton.prototype.initialize = function (rect) {
  Window_HorzCommand.prototype.initialize.call(this, rect);
  this._towerData = null;
  this._towerDataDestroyCallback = null;
  this.setBackgroundType(0);

  this.setHandler("ok", this.onOk.bind(this));
  this.setHandler("cancel", this.onCancel.bind(this));

  this.statusWindow1 = new Window_BaseExtend(
    new Rectangle(0, -rect.height - 130, 200, rect.height + 130)
  );
  this.addChild(this.statusWindow1);

  this.statusWindow2 = new Window_BaseExtend(
    new Rectangle(
      this.statusWindow1.width,
      -this.statusWindow1.height,
      this.statusWindow1.width,
      this.statusWindow1.height
    )
  );

  this.addChild(this.statusWindow2);

  this.hide();
  this.close();
};

Window_TowerActionButton.prototype.onOk = function () {
  switch (this.index()) {
    // Move
    case 0:
      $gamePlayer.getGuideAction().resetParent();
      TowerDefenseManager.selectTower($dataItems[this._towerData._id].ufcTower);
      TowerDefenseManager.selectTowerMode();
      this._towerDataDestroyCallback();
      break;
    // Upgrade
    case 1:
      if (this._towerData._upgradeId != "?") {
        if ($gameParty.gold() >= this._towerData._upgradePrice) {
          AudioManager.playSe({
            name: "Coin",
            volume: 80,
            pitch: 100,
            pan: 0,
          });
          $gameParty.gainGold(-+this._towerData._upgradePrice);
          $gameMap.updateGoldHud();
          // Upgrade
          $gamePlayer.getGuideAction().resetParent();
          TowerDefenseManager.selectTower(
            $dataItems[this._towerData._upgradeId].ufcTower
          );
          TowerDefenseManager.selectTowerMode();
          TowerDefenseManager.placeTower();
          this._towerDataDestroyCallback();
        } else {
          SoundManager.playBuzzer();
          this.activate();
          return;
        }
      }
      break;
    // Sell
    case 2:
      AudioManager.playSe({
        name: "Coin",
        volume: 80,
        pitch: 100,
        pan: 0,
      });
      $gameParty.gainGold(+this._towerData._sellPrice);
      $gameMap.updateGoldHud();
      this._towerDataDestroyCallback();
      break;
  }
  this.close();
};

Window_TowerActionButton.prototype.close = function () {
  for (const child of this.children) {
    if (child.close) {
      child.close();
    }
  }
  Window_HorzCommand.prototype.close.call(this);
  $gameMessage.setWindowTower(false);
};

Window_TowerActionButton.prototype.setTower = function (
  ufcTowerData,
  callback
) {
  this._towerData = ufcTowerData;
  this._towerDataDestroyCallback = callback;
  this.refresh();
  this.addCommand("MOVE", 0, true);

  if (this._towerData._upgradeId != "?") {
    this.addCommand(
      "Upgrade " +
        "\\C[14]" +
        this._towerData._upgradePrice +
        "\\C " +
        TextManager.currencyUnit,
      2,
      true
    );
    this.statusWindow2.show();
  } else {
    this.addCommand("Upgrade", 2, false);
    // hide upgrade window
    this.statusWindow2.hide();
  }
  this.addCommand(
    "Sell " +
      "\\C[14]" +
      this._towerData._sellPrice +
      "\\C " +
      TextManager.currencyUnit,
    1
  );
  this.addCommand("Cancel", 3, true);
  this.drawAllItems();
  this.drawTowerStatus(0, 0, "center");
  this.open();
  this.statusWindow1.open();
  this.show();
  this.activate();
  this.select(0);
};

Window_TowerActionButton.prototype.open = function () {
  SoundManager.playOk();
  Window_HorzCommand.prototype.open.call(this);
};

Window_TowerActionButton.prototype.drawTowerStatus = function (x, y, align) {
  let characterImage = ImageManager.loadCharacter(this._towerData._character);
  let characterIndex = this._towerData._characterIndex;
  let pw = characterImage.width / 12;
  let ph = characterImage.height / 8;
  let sx = ((characterIndex % 4) * 3 + 1) * pw;
  let sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
  let scale = 1.5;
  if (align == "center") {
    x += this.statusWindow1.width / 2;
    x -= (pw * scale) / 2;
    x -= this.statusWindow1.itemPadding();
  }
  this.statusWindow1.contents.blt(
    characterImage,
    sx,
    sy,
    pw,
    ph,
    x,
    y,
    pw * scale,
    ph * scale
  );

  let textY = 100;
  let textX = 10;
  let textHeight = 28;
  let textValueX = 130;
  let fontSize = 17;
  let status = ["Attack", "Range", "Attack Speed", "Bullet Speed"];
  let statusValue = [
    this._towerData._attack,
    this._towerData._range,
    this._towerData._attackSpeed,
    this._towerData._bulletSpeed,
  ];

  this.statusWindow1.contents.fontSize = fontSize + 3;
  this.statusWindow1.drawText(
    this._towerData._name,
    textX,
    ph + 20,
    150,
    "center"
  );

  this.statusWindow1.contents.fontSize = fontSize;
  for (let i = 0; i < status.length; i++) {
    this.statusWindow1.resetTextColor();
    this.statusWindow1.drawText(status[i], textX, textY + i * textHeight, 150);
    this.statusWindow1.changeTextColor(ColorManager.systemColor());
    this.statusWindow1.drawText(
      statusValue[i],
      textX + textValueX,
      textY + i * textHeight,
      150
    );
  }
  this.statusWindow1.resetTextColor();
  this.statusWindow1.drawText(
    "Effect",
    textX,
    textY + status.length * textHeight,
    150
  );

  let effectNote = `\\FS[${fontSize - 3}]\n`;
  if (!this._towerData._effectsNote) effectNote += "\\C[16]None";

  this.statusWindow1.setLineHeight(28);
  this.statusWindow1.drawTextEx(
    effectNote + this._towerData._effectsNote.replace(/\\n/g, "\n"),
    textX,
    textY + status.length * textHeight + 2,
    200
  );
  this.statusWindow1.resetLineHeight();

  this.statusWindow1.resetFontSettings();

  if (this._towerData._upgradeId != "?") {
    let upgradeTowerData = $dataItems[this._towerData._upgradeId].ufcTower;
    characterImage = ImageManager.loadCharacter(upgradeTowerData.character);
    characterIndex = upgradeTowerData.characterindex;
    pw = characterImage.width / 12;
    ph = characterImage.height / 8;
    sx = ((characterIndex % 4) * 3 + 1) * pw;
    sy = (Math.floor(characterIndex / 4) * 4 + 0) * ph;
    this.statusWindow2.contents.blt(
      characterImage,
      sx,
      sy,
      pw,
      ph,
      x - 8,
      y,
      pw * scale,
      ph * scale
    );

    let statusValue2 = [
      +upgradeTowerData.attack,
      +upgradeTowerData.range,
      +upgradeTowerData.attackspeed,
      +upgradeTowerData.bulletspeed,
    ];

    this.statusWindow2.contents.fontSize = fontSize + 3;
    this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
    this.statusWindow2.drawText("UPGRADE", textX, -10, 150, "center");

    this.statusWindow2.resetTextColor();
    this.statusWindow2.drawText(
      upgradeTowerData.name,
      textX,
      ph + 20,
      150,
      "center"
    );

    this.statusWindow2.contents.fontSize = fontSize;
    for (let i = 0; i < status.length; i++) {
      this.statusWindow2.resetTextColor();
      this.statusWindow2.drawText(
        status[i],
        textX,
        textY + i * textHeight,
        150
      );
      this.statusWindow2.changeTextColor(ColorManager.systemColor());
      if (statusValue[i] > statusValue2[i]) {
        this.statusWindow2.changeTextColor(ColorManager.powerDownColor());
        if (i == 2) {
          this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
        }
      } else if (statusValue[i] < statusValue2[i]) {
        this.statusWindow2.changeTextColor(ColorManager.powerUpColor());
        if (i == 2) {
          this.statusWindow2.changeTextColor(ColorManager.powerDownColor());
        }
      }
      this.statusWindow2.drawText(
        statusValue2[i],
        textX + textValueX,
        textY + i * textHeight,
        150
      );
    }

    this.statusWindow2.resetTextColor();
    this.statusWindow2.drawText(
      "Effect",
      textX,
      textY + status.length * textHeight,
      150
    );
    effectNote = `\\FS[${fontSize - 3}]\n`;
    if (!upgradeTowerData.effectsnote) effectNote += "\\C[16]None";

    this.statusWindow2.setLineHeight(28);
    this.statusWindow2.drawTextEx(
      effectNote + upgradeTowerData.effectsnote.replace(/\\n/g, "\n"),
      textX,
      textY + status.length * textHeight + 2,
      200
    );
    this.statusWindow2.resetLineHeight();
    this.statusWindow2.resetFontSettings();
    this.statusWindow2.open();
  }
};

Window_TowerActionButton.prototype.setMoveCallback = function (callback) {
  this._list[0].callback = callback;
};

Window_TowerActionButton.prototype.onCancel = function () {
  this.close();
};

Window_TowerActionButton.prototype.addCommand = function (
  name,
  icon,
  enabled = true,
  callback = null
) {
  this._list.push({
    name: name,
    icon: icon,
    callback: callback,
    symbol: null,
    enabled: enabled,
    ext: null,
  });
};

Window_TowerActionButton.prototype.drawIconTD = function (index, x, y, align) {
  const bitmap = ImageManager.loadSystem("TDSet");
  const pw = 72;
  const ph = 72;
  if (align == "center") {
    x += this.itemWidth() / 2;
    x -= pw / 2;
  } else if (align == "right") {
    let _x = x;
    x = this.itemWidth();
    x -= pw;
    x -= _x;
  }
  const sx = (index % pw) * pw;
  const sy = Math.floor(index / ph) * ph;
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

Window_TowerActionButton.prototype.drawTextEx = function (
  text,
  x,
  y,
  width,
  align
) {
  if (align == "center") {
    let textWidth = this.textSizeEx(text).width;
    x += this.itemWidth() / 2;
    x -= textWidth / 2;
    x -= this.itemPadding() * 2;
  }
  this.resetFontSettings();
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);

  return textState.outputWidth;
};

Window_TowerActionButton.prototype.drawItem = function (index) {
  const rect = this.itemLineRect(index);
  const align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawIconTD(
    this._list[index].icon,
    rect.x - this.itemPadding() * 2,
    rect.y - 30,
    align
  );
  this.drawTextEx(this.commandName(index), rect.x, rect.y + 50, 200, align);
};

// Enable sound when cursor hover the button
Window_TowerActionButton.prototype.onTouchSelect = function (trigger) {
  this._doubleTouch = false;
  if (this.isCursorMovable()) {
    const lastIndex = this.index();
    const hitIndex = this.hitIndex();
    if (hitIndex >= 0) {
      if (hitIndex === this.index()) {
        this._doubleTouch = true;
      }
      this.select(hitIndex);
    }
    if (this.index() !== lastIndex) {
      this.playCursorSound();
    }
  }
};

Window_TowerActionButton.prototype.update = function () {
  Window_HorzCommand.prototype.update.call(this);
  this.updateChildren();
};

Window_TowerActionButton.prototype.updateChildren = function () {
  for (const child of this.children) {
    if (child.update) {
      child.update();
    }
  }
};
Window_TowerActionButton.prototype.refresh = function () {
  for (const child of this.children) {
    if (child.contents) {
      child.contents.clear();
    }
  }
  Window_HorzCommand.prototype.refresh.call(this);
};

Window_TowerActionButton.prototype.itemHeight = function () {
  return this.height - 24;
};

Window_TowerActionButton.prototype.colSpacing = function () {
  return 20;
};
