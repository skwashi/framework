function World (map, grid, cam) {
  this.map = map;
  this.grid = grid;
  this.cam = cam;

  this.reset = function () {
    this.tileMap = this.map.makeWorldMap();
    this.solids = [];
    this.powerups = [];
    this.projectiles = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.misc = [];
  };

  this.reset();
}

World.prototype.addPlayer = function (player) {
  this.player = player;
};

World.prototype.addEnemies = function (enemies) {
  this.enemies = this.enemies.concat(enemies);
};

World.prototype.addProjectiles = function (projectiles) {
  this.projectiles = this.projectiles.concat(projectiles);
};

World.prototype.addMisc = function (misc) {
  this.misc = this.misc.concat(misc);
};

World.prototype.cleanArray = function (array, dt) {
  var ds;
  for (var i = array.length-1; i >= 0; i--)
    if (array[i].remove) {
      if (array[i].timeToDeath === undefined || array[i].timeToDeath <= 0) {
        ds = array[i].deathSpawn();
        array.splice(i,1);
        this.addMisc(ds);
      }
      else {
        array[i].timeToDeath -= dt;
      }
    }
};

World.prototype.updateProjectiles = function (dt) {
  game.colHandler.clearBuckets("projectiles");
  _.forEach(this.projectiles, function (projectile) {
    projectile.move(dt);
    game.colHandler.registerObject("projectiles", projectile);
    if (game.colHandler.inSolid(projectile)) {
      var tile = this.grid.mapTile(this.grid.tileCoords(projectile.x, projectile.y));
      this.tileMap.destroy(tile);
      projectile.remove = true;
    }
    _.forEach(game.colHandler.collidingObjects("enemies", projectile), 
              function (enemy) {enemy.remove = true; projectile.remove = true;});
    if (this.cam.outOfRange(projectile, 2))
      projectile.remove = true;
  }, this);
};

World.prototype.updateEnemies = function (dt) {
  game.colHandler.clearBuckets("enemies");
  _.forEach(this.enemies, function (enemy) {
    enemy.move(dt);
    game.colHandler.registerObject("enemies", enemy);
  }, this);
};

World.prototype.updateMisc = function (dt) {
  _.forEach(this.misc, function(m) {
    m.move(dt);
  });
};

World.prototype.update = function (dt) {

  this.updateProjectiles(dt);
  this.updateEnemies(dt);
  this.updateMisc(dt);

  this.cleanArray(this.projectiles, dt);
  this.cleanArray(this.enemies, dt);
  this.cleanArray(this.misc, dt);

};

World.prototype.drawArray = function (context, array) {
  _.forEach(array, function (e) {
    if (this.cam.canSee(e))
      e.draw(context, this.cam);
  }, this);
};

World.prototype.draw = function (context) {
  
  if (this.tileMap.context === undefined)
    this.tileMap.context = context;
  this.tileMap.draw(this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  this.drawArray(context, this.misc);
  this.drawArray(context, this.enemies);
  this.drawArray(context, this.projectiles);
  
  if (this.player != undefined && this.cam.canSee(this.player)) {
    this.player.draw(context, this.cam);
  }

};
