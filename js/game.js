function Game () {
  this.init = function (context, imageHandler, messageHandler, imageRepo, openX, openY) {
    this.context = context;
    this.imageHandler = imageHandler;
    this.messageHandler = messageHandler;
    this.imageRepo = imageRepo;
    this.openX = openX;
    this.openY = openY;
    this.time = Date.now();
    this.campos = null;


    this.enemies = [];

    this.toggleCooldown = 1;
    this.cooldowns = {follow: 0, lock: 0};
  };
}

Game.prototype.loadMap = function (filename) {
  this.map = new Map(filename);
  this.map.load();
  var sprite = this.imageRepo.load("imgs/ship.png");
  var that = this;
  setTimeout(function () {
    that.grid = that.map.makeGrid(that.openX, that.openY);
    that.cam = new Camera(that.grid, new Vector(0, that.grid.height - that.context.canvas.height), 
                          that.context.canvas.width, that.context.canvas.height, new Vector(0, 0));

    var mapPlayer = that.map.getPlayer();
    var posx = (mapPlayer != undefined && mapPlayer.x != undefined) ? 
          mapPlayer.x : that.cam.width/2 - (sprite.width / 2);
    var posy = (mapPlayer != undefined && mapPlayer.y != undefined) ? 
          mapPlayer.y : that.cam.pos.y + that.cam.height - sprite.height - 70;
    that.player = new FreePlayer(that.grid, posx, posy, sprite.width, sprite.height, "blue", 800,
                             new Vector(0, 0), new Vector(3200, 3200), 60/10, 800);
    that.player.addSprite(sprite, 0);

    /*
    that.imageHandler.addImage(that.map.getImage(0), that.context, that.map.getScale(0), 0);
    that.imageHandler.addImage(that.map.getImage(1), that.context, that.map.getScale(1), 1);
    */
    that.map.loadPictureLayers(that.imageHandler, that.context);
    //that.map.loadImages(that.imageHandler, that.context);

    that.colHandler = new CollisionHandler(that.grid, that.map.getColArray(), that.map.tileWidth, that.map.tileHeight);
    
    that.motionHandler = new MotionHandler(that.grid, that.colHandler, "air");   
    //that.motionHandler = new MotionHandler(that.grid, that.colHandler, "side");
    //that.motionHandler.setGravity(1600);
    //that.motionHandler.setFriction(60/10);
    
    //that.loadPlayerSprites(5, 45);

    that.loadEnemies(that.map.getObjects("enemies"));
    
    that.time = Date.now();
  }, 2000);
  
};


Game.prototype.loadPlayerSprites = function (inc, max) {
  var filename;
  for (var i = inc; i <= max; i += inc) {
    filename = "imgs/shipr"+i+".png";
    this.imageRepo.load(filename);
    this.player.addSprite(this.imageRepo.get(filename), i);
    filename = "imgs/shipl"+i+".png";
    this.imageRepo.load(filename);
    this.player.addSprite(this.imageRepo.get(filename), -i);
  }
  this.player.angleInc = inc;
  this.player.angleMax = max;

};


Game.prototype.loadEnemies = function (eArray) {
  this.enemies = _.map(eArray, function (espec) {
    return new Movable(this.grid, Math.round(espec.x), Math.round(espec.y), Math.round(espec.width), Math.round(espec.height), 
                       espec.color || "red", espec.speed || 500,  new Vector(espec.properties.vx || 0, espec.properties.vy || 0));
  }, this);
};


Game.prototype.handleInput = function (dt) {
  var move = 5 * 60;
  var dir = new Vector(0,0);

  if (keys["i"])
    this.cam.baseVel.y -= 60;

  if (keys["k"])
    this.cam.baseVel.y += 60;

  if (keys["e"])
    move *= 2;

  if (keys["f"])
    move /= 2;

  if (keys["left"]) {
    this.cam.pos.x -= Math.round(move*dt);
  }
  if (keys["up"]) {
    this.cam.pos.y -= Math.round(move*dt);
  }
  if (keys["right"]) {
    this.cam.pos.x += Math.round(move*dt);
  }  
  if (keys["down"]) {
    this.cam.pos.y += Math.round(move*dt);
  }

  if (keys["a"]) {
    dir.x -= 1;
  }
  if (keys["w"]) {
    dir.y -= 1;
  }
  if (keys["s"]) {
    dir.y += 1;
  }  
  if (keys["d"]) {
    dir.x += 1;
  }

  if (keys["space"]) {
    this.motionHandler.jump(this.player, dir);
  }

  if (keys["z"]) {
    this.cam.unFollow();
    this.cam.centerOn(this.player, dt);
    this.messageHandler.setMessage("Finding player!", 120);
  }
  
  if (keys["x"] && this.cooldowns.follow <= 0) {
    if (this.cam.followObject == null) {
      this.messageHandler.setMessage("Following player!", 120);
      this.cam.follow(this.player, true, true, 1/3, 1/4);
    } else {
      this.cam.unFollow();
      this.messageHandler.setMessage("Not following player!", 120);
    }
    this.cooldowns.follow = this.toggleCooldown;
  }
  
  if (keys["r"] && this.cooldowns.lock <= 0) {
    if (this.player.camLocked == false) {
      this.messageHandler.setMessage("Player locked to camera!", 120);
      this.player.camLock(this.cam);
    } else {
      this.player.camLocked = false;
      this.messageHandler.setMessage("Player not locked to camera!", 120);
    }
    this.cooldowns.lock = this.toggleCooldown;
  }
  
  if (keys["q"])
    this.motionHandler.unstuck(this.player);
  
  this.cam.move(dt);
  this.player.move(this.motionHandler, dt, dir);
};

Game.prototype.frameReset = function () {
  this.cam.vel.set(this.cam.baseVel);
};

Game.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = this.grid.projectX(this.cam.getCenter().x - w/2 - this.cam.pos.x);
  var y = this.grid.projectY(this.cam.getCenter().y - h/2 - this.cam.pos.y);
  this.context.strokeStyle = "red";
  this.context.strokeRect(x,y,w,h);
};

Game.prototype.lowerCooldowns = function (dt) {
  for (key in this.cooldowns) {
    this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
  }
};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;
  this.time = now;

  this.lowerCooldowns(dt);
  this.frameReset();
  this.handleInput(dt);

  // move enemies
  _.forEach(this.enemies, function (enemy) {enemy.move(this.motionHandler, dt);}, this);
  
};

Game.prototype.draw = function () {
  var camMoved = (this.campos == null) || ! this.cam.pos.equals(this.campos);

  if (this.campos == null)
    this.campos = this.cam.pos.copy();
  else
    this.campos.set(this.cam.pos);
  
  // draw starry backgrounds
  this.imageHandler.drawLevel(-1, this.cam.pos.x, this.cam.pos.y, this.cam.width, this.cam.height);
  // draw map background
  this.imageHandler.drawLevel(0, this.cam.pos.x, this.cam.pos.y, this.cam.width, this.cam.height);

  // update and draw objects

  // draw enemies

  _.forEach(this.enemies, function (enemy) {
    if (this.cam.canSee(enemy))
        enemy.draw(this.context, this.cam);
  }, this);
  
  if (this.cam.canSee(this.player)) {
    this.player.draw(this.context, this.cam);
  }
  this.drawCrosshair();

  // draw overlayer
  this.imageHandler.drawLevel(1, this.cam.pos.x, this.cam.pos.y, this.cam.width, this.cam.height);

  // show messages
  this.messageHandler.render();
};

