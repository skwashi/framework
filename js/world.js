function World (game, map, grid, cam) {
  this.game = game;
  this.map = map;
  this.grid = grid;
  this.cam = cam;

  this.tileMap = map.makeWorldMap();
  this.enemies = [];
  this.projectiles = [];
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


World.prototype.update = function (dt) {

    // move projectiles
  _.forEach(this.projectiles, function (projectile) {
    projectile.move(this.game.motionHandler, dt);
    if (this.game.colHandler.inSolid(projectile)) {
      var tile = this.grid.mapTile(this.grid.tileCoords(projectile.x, projectile.y));
      this.tileMap.destroy(tile);
      projectile.remove = true;
    }
  }, this);
  
  // move enemies
  _.forEach(this.enemies, function (enemy) {enemy.move(this.motionHandler, dt);}, this);
  
  // cleanup
  for (var i = this.projectiles.length-1; i >= 0; i--)
    if (this.projectiles[i].remove)
      this.projectiles.splice(i,1);

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
