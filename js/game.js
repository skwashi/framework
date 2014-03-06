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

    this.world = null;

    this.toggleCooldown = 1;
    this.cooldowns = {follow: 0, lock: 0, playertype : 0};
  };
}


Game.prototype.loadMap = function (filename) {
  this.map = new Map(filename);
  this.map.load();
  var that = this;
  setTimeout(function () {
    that.grid = that.map.makeGrid(that.openX, that.openY);
    that.cam = new Camera(that.grid, 0, that.grid.height - that.context.canvas.height, 
                          that.context.canvas.width, that.context.canvas.height, 0, 0);

    var mapPlayer = that.map.getPlayer();
    //var posx = (mapPlayer != undefined && mapPlayer.x != undefined) ? 
    //      mapPlayer.x : that.cam.width/2 - 22;
    //var posy = (mapPlayer != undefined && mapPlayer.y != undefined) ? 
    //mapPlayer.y : that.cam.pos.y + that.cam.height - 52 - 70;
    var posx = that.cam.width/2 - 22;
    var posy = that.cam.y + that.cam.height - 52 - 70;
    var raptor = new Raptor("blue");
    raptor.loadSprites(that.imageRepo, raptor.rollInc, raptor.rollMax);
    raptor.loadFlameSprites(that.imageRepo);
    that.player = new Player(raptor, "free", that.grid, posx, posy, 0, 0);

    /*
    that.imageHandler.addImage(that.map.getImage(0), that.context, that.map.getScale(0), 0);
    that.imageHandler.addImage(that.map.getImage(1), that.context, that.map.getScale(1), 1);
    */
    that.map.loadTileMaps(that.imageHandler, that.context);
    //that.map.loadPictureLayers(that.imageHandler, that.context);
    //that.map.loadImages(that.imageHandler, that.context);

    that.colHandler = new CollisionHandler(that.grid, that.map.getPropArray(), that.map.tileWidth, that.map.tileHeight);
    
    that.motionHandler = new MotionHandler(that.grid, that.colHandler, "air");   
    //that.motionHandler = new MotionHandler(that.grid, that.colHandler, "side");
    //that.motionHandler.setGravity(1600);
    //that.motionHandler.setFriction(60/10);
    
    //that.loadPlayerSprites(5, 45);

    that.world = new World(that, that.map, that.grid, that.cam);
    that.world.addPlayer(that.player);

    that.loadEnemies(that.map.getObjects("enemies"));
    
    that.time = Date.now();
  }, 2000);
  
};

Game.prototype.loadEnemies = function (eArray) {
  this.world.enemies = _.map(eArray, function (espec) {
    return new Movable(this.grid, espec.x, espec.y, espec.width, espec.height, 
                       espec.color || "red", espec.speed || 500, espec.properties.vx || 0, espec.properties.vy || 0);
  }, this);
};


Game.prototype.handleInput = function (dt) {
  var move = 5 * 60;
  var dir = new Vector(0,0);

  if (keys["q"])
    this.cam.base.vy -= 60;

  if (keys["e"])
    this.cam.base.vy += 60;

  if (keys["r"])
    move *= 2;

  if (keys["f"])
    move /= 2;

  if (keys["a"]) {
    this.cam.x -= Math.round(move*dt);
  }
  if (keys["w"]) {
    this.cam.y -= Math.round(move*dt);
  }
  if (keys["d"]) {
    this.cam.x += Math.round(move*dt);
  }  
  if (keys["s"]) {
    this.cam.y += Math.round(move*dt);
  }

  if (keys["left"]) {
    dir.x -= 1;
  }
  if (keys["up"]) {
    dir.y -= 1;
  }
  if (keys["down"]) {
    dir.y += 1;
  }  
  if (keys["right"]) {
    dir.x += 1;
  }

  if (keys["x"] && this.player.cooldowns.laser <= 0) {
    this.world.addProjectiles(this.player.fire("laser"));
    this.player.cooldowns.laser = this.player.cooldown;
  }

  if (keys["z"]) {
    this.cam.unFollow();
    this.cam.centerOn(this.player, dt);
    this.messageHandler.setMessage("Finding player!", 120);
  }
  
  if (keys["space"] && this.cooldowns.follow <= 0) {
    if (this.cam.followObject == null) {
      this.messageHandler.setMessage("Following player!", 120);
      this.cam.follow(this.player, true, true, 1/3, 1/4);
    } else {
      this.cam.unFollow();
      this.messageHandler.setMessage("Not following player!", 120);
    }
    this.cooldowns.follow = this.toggleCooldown;
  }
  
  if (keys["c"] && this.cooldowns.lock <= 0) {
    if (this.player.camLocked == false) {
      this.messageHandler.setMessage("Player locked to camera!", 120);
      this.player.camLock(this.cam);
    } else {
      this.player.camLocked = false;
      this.messageHandler.setMessage("Player not locked to camera!", 120);
    }
    this.cooldowns.lock = this.toggleCooldown;
  }

  if (keys["m"] && this.cooldowns.playertype <= 0) {
    this.player.toggleType();
    this.cooldowns.playertype = this.toggleCooldown;
  }
  
  if (keys["u"])
    this.motionHandler.unstuck(this.player);
  
  this.cam.move(dt);
  this.player.move(this.motionHandler, dt, dir);

};

Game.prototype.frameReset = function () {
  this.cam.setBaseVel();
};

Game.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = this.grid.projectX(this.cam.getCenter().x - w/2 - this.cam.x);
  var y = this.grid.projectY(this.cam.getCenter().y - h/2 - this.cam.y);
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
  this.player.lowerCooldowns(dt);
  this.frameReset();
  this.handleInput(dt);
  this.world.update(dt);
};

Game.prototype.draw = function () {
  var camMoved = (this.campos == null) || (this.campos.y != this.cam.y) || (this.campos.x != this.cam.x);
        
  this.campos = {x:this.cam.x, y: this.cam.y};


  // draw starry backgrounds
  this.imageHandler.drawLevel(-1, this.cam.x, this.cam.y, this.cam.width, this.cam.height);
  // draw map background
  this.imageHandler.drawLevel(0, this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  this.world.draw(this.context);
  this.drawCrosshair();
  
  // draw overlayer
  this.imageHandler.drawLevel(1, this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  // show messages
  this.messageHandler.render();
};

