function World (map, grid, cam) {
  this.map = map;
  this.grid = grid;
  this.cam = cam;

  this.reset = function () {
    this.tileMap = this.map.makeWorldMap();
    this.enemies = [];
    this.projectiles = [];
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

World.prototype.cleanArray = function (array) {
  for (var i = array.length-1; i >= 0; i--)
    if (array[i].remove)
      array.splice(i,1);
};

World.prototype.update = function (dt) {

  // unregister all objects
  

  // move projectiles
  game.colHandler.clearBuckets("projectiles");
  _.forEach(this.projectiles, function (projectile) {
    projectile.move(dt);
    game.colHandler.registerObject("projectiles", projectile);
    if (game.colHandler.inSolid(projectile)) {
      var tile = this.grid.mapTile(this.grid.tileCoords(projectile.x, projectile.y));
      this.tileMap.destroy(tile);
      projectile.remove = true;
    }
    if (this.cam.outOfRange(projectile, 2))
      projectile.remove = true;
  }, this);
  
  // move enemies
  game.colHandler.clearBuckets("solids");
  _.forEach(this.enemies, function (enemy) {
    enemy.move(dt);
    game.colHandler.registerObject("solids", enemy);
  }, this);
  
  // cleanup
  this.cleanArray(this.projectiles);
  this.cleanArray(this.enemies);
  
};

World.prototype.draw = function (context) {
  
  if (this.tileMap.context === undefined)
    this.tileMap.context = context;
  this.tileMap.draw(this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  _.forEach(this.projectiles, function (projectile) {
    if (this.cam.canSee(projectile))
      projectile.draw(context, this.cam);
  }, this);

  _.forEach(this.enemies, function (enemy) {
    if (this.cam.canSee(enemy))
        enemy.draw(context, this.cam);
  }, this);
  
  if (this.player != undefined && this.cam.canSee(this.player)) {
    this.player.draw(context, this.cam);
  }

};
