function World (map, grid, cam) {
  this.map = map;
  this.grid = grid;
  this.cam = cam;
  this.player = null;

  this.objects = {
    solids: [],
    powerups: [],
    projectiles: [],
    enemies: [],
    enemyProjectiles: [],
    large: [],
    misc: []
  };

  this.reset = function () {
    this.tileMap = this.map.makeWorldMap();
    this.player = null;
    for (var key in this.objects)
      this.objects[key] = [];
  };

  this.reset();
}

World.prototype.addPlayer = function (player) {
  this.player = player;
};

World.prototype.removePlayer = function () {
  this.player = null;
};

World.prototype.add = function (type, array) {
  if (this.objects.hasOwnProperty(type))
    this.objects[type] = this.objects[type].concat(array);
  else
    this.objects.misc = this.objects.misc.concat(array);
};

World.prototype.addEnemies = function (enemies) {
  this.add("enemies", enemies);
};

World.prototype.addProjectiles = function (projectiles) {
  this.add("projectiles", projectiles);
};

World.prototype.addMisc = function (misc) {
  this.add("misc", misc);
};

World.prototype.addRandomEnemy = function (dt) {  
  if (Math.random() <= 2*dt) {
    var type = game.enemyHandler.randomType();
    this.addEnemies([game.enemyHandler.newEnemy(type, this.grid, this.cam.x + Math.floor(this.cam.width*Math.random()), 
                                      this.cam.y - 100, this.player)]);
  }
};

World.prototype.clean = function (type, dt) {
  var array = this.objects[type] || this.objects.misc;
  var ds;
  for (var i = array.length-1; i >= 0; i--) {
    if (array[i].remove)
      array.splice(i,1);
    else if (array[i].alive == false) {
      if (array[i].timeToDeath === undefined || array[i].timeToDeath <= 0) {
        ds = array[i].deathSpawn();
        array.splice(i,1);
        this.addMisc(ds);
      }
      else {
        array[i].timeToDeath -= dt;
      }
    }
  }
};

World.prototype.updatePlayer = function (dt) {
  this.player.lowerCooldowns(dt);
  this.player.move(dt);
  if (game.colHandler.collidingObjects("enemies", this.player).length != 0) {
    this.player.takeDamage(50*dt);
  }
};

World.prototype.updateProjectiles = function (dt) {
  game.colHandler.clearBuckets("projectiles");
  _.forEach(this.objects.projectiles, function (projectile) {
    projectile.move(dt);
    game.colHandler.registerObject("projectiles", projectile);
    if (game.colHandler.inSolid(projectile)) {
      var tile = this.grid.mapTile(this.grid.tileCoords(projectile.x, projectile.y));
      this.tileMap.destroy(tile);
      projectile.alive = false;
    }
    _.forEach(game.colHandler.collidingObjects("enemies", projectile), 
              function (enemy) {
                enemy.takeDamage(projectile.damage); 
                projectile.alive = false;
              });
    if (projectile.outOfRange(this.cam, 2*this.cam.width) &&
       (this.player == null || 
        projectile.outOfRange(this.player, 2*this.cam.width)))
      projectile.remove = true;
  }, this);
};

World.prototype.updateEnemies = function (dt) {
  game.colHandler.clearBuckets("enemies");
  _.forEach(this.objects.enemies, function (enemy) {
    enemy.move(dt);
    game.colHandler.registerObject("enemies", enemy);
    if (enemy.outOfRange(this.cam, 4*this.cam.width) && 
        (this.player == null ||
         enemy.outOfRange(this.player, 4*this.cam.width)))
      enemy.remove = true;
  }, this);
};

World.prototype.updateMisc = function (dt) {
  _.forEach(this.objects.misc, function(m) {
    m.move(dt);
    if (m.outOfRange(this.cam, 2*this.cam.width) &&
        (this.player == null ||
         m.outOfRange(this.player, 2*this.cam.width)))
      m.remove = true;
  }, this);
};

World.prototype.updateLarge = function (dt) {
  _.forEach(this.objects.large, function(l) {
    l.move(dt);
    if (l.outOfRange(this.cam, 2*this.cam.width) &&
        (this.player == null ||
         l.outOfRange(this.player, 2*this.cam.width)))
      l.remove = true;
  }, this);
};

World.prototype.update = function (dt) {
  
  if (this.player != undefined)
    this.updatePlayer(dt);
  this.updateLarge(dt);
  this.updateProjectiles(dt);
  this.updateEnemies(dt);
  this.updateMisc(dt);

  for (var key in this.objects)
    this.clean(key, dt);
};

World.prototype.drawArray = function (type, context) {
  var array = this.objects[type] || this.objects.misc;
  _.forEach(array, function (e) {
    if (e.isSeen(this.cam))
      e.draw(context, this.cam);
  }, this);
};

World.prototype.draw = function (context) {
  
  if (this.tileMap.context === undefined)
    this.tileMap.context = context;
  this.tileMap.draw(this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  this.drawArray("large", context);
  this.drawArray("misc", context);
  this.drawArray("enemies", context);
  this.drawArray("projectiles", context);

  if (this.player != undefined && this.player.isSeen(this.cam)) {
    this.player.draw(context, this.cam);
  }

};

