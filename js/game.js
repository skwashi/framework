function Game () {
  this.init = function (context, openX, openY) {
    this.context = context;

    // flags if the game allows objects/camera to move outside the mapped grid

    this.openX = openX;
    this.openY = openY;

    // handlers that are called globally with game.handler

    this.imageRepo = new ImageRepo();
    this.imageHandler = new ImageHandler();
    this.messageHandler = new MessageHandler();
    this.colHandler = new CollisionHandler();
    this.motionHandler = new MotionHandler();
    this.enemyHandler = new EnemyHandler();

    // uninstantiated variables

    this.map = null;
    this.world = null;
    this.grid = null;
    this.cam = null;
    this.player = null;
    this.playerAlive = true;
    
    this.time = Date.now();
    this.campos = null;

    this.toggleCD = 1;
    this.cooldowns = {follow: 0, lock: 0, playertype: 0, addEnemy: 0};
  };
}

Game.prototype.initBackgrounds = function (backgrounds) {
  this.imageRepo.loadArray(backgrounds);
  this.imageHandler.addImage(this.imageRepo.get(backgrounds[0]), this.context, 1/9, -1);
  this.imageHandler.addImage(this.imageRepo.get(backgrounds[1]), this.context, 1/6, -1);
};

Game.prototype.loadMap = function (filename) {
  this.map = new Map(filename);
  this.map.load();
  var that = this;

  setTimeout(function () {
    that.map.loadTileMaps(that.imageHandler, that.context);
    //that.map.loadPictureLayers(that.imageHandler, that.context);
    //that.map.loadImages(that.imageHandler, that.context);
    
    that.grid = that.map.makeGrid(that.openX, that.openY);
    that.cam = new Camera(that.grid, 0, that.grid.height - that.context.canvas.height, 
                          that.context.canvas.width, that.context.canvas.height, 0, 0);

    var mapPlayer = that.map.getPlayer();
    var posx = (mapPlayer != undefined && mapPlayer.x != undefined) ? 
          mapPlayer.x : that.cam.width/2 - 22;
    var posy = (mapPlayer != undefined && mapPlayer.y != undefined) ? 
          mapPlayer.y : that.cam.y + that.cam.height - 52 - 70;
    var raptor = new Raptor("blue");
    raptor.loadSprites(that.imageRepo, raptor.rollInc, raptor.rollMax);
    raptor.loadFlameSprites(that.imageRepo);
    that.player = new Player(raptor, "free", that.grid, posx, posy, 0, 0);
    that.cam.findObject(that.player);
    that.cam.follow(that.player, true, true, 1/3, 1/4);
    
    that.world = new World(that.map, that.grid, that.cam);
    that.world.addPlayer(that.player);

    that.colHandler.init(that.grid, that.world.tileMap.propMap, that.world.tileWidth, that.world.tileHeight);
    that.motionHandler.init(that.grid, "air");   
    
    that.loadEnemies(that.map.getObjects("enemies"));
    that.world.add("large", [new Circle(1000, 300, 1, 200, "yellow")]);
    that.time = Date.now();
  }, 2000);
};

Game.prototype.loadEnemies = function (eArray) {
  this.world.addEnemies (_.map(eArray, function (espec) {
    return new Movable(this.grid, espec.x, espec.y, espec.width, espec.height, 
                       espec.color || "red", espec.speed || 500, espec.properties.vx || 0, espec.properties.vy || 0);
  }, this));
  _.forEach(this.world.objects.enemies, function (e) {
    e.setPath(new Path([new Vector(100, 100), new Vector(1000,100),
                        new Vector(1000,1000), new Vector(100, 1000)],
                       "cycle"));
  });
};


Game.prototype.handleCameraInput = function (dt) {
  var move = 5 * 60;

  if (keys["q"])
    this.cam.basevel.y -= 60;

  if (keys["e"])
    this.cam.basevel.y += 60;

  if (keys["r"])
    move *= 2;

  if (keys["f"])
    move /= 2;

  if (keys["a"]) {
    this.cam.x -= move*dt;
  }
  if (keys["w"]) {
    this.cam.y -= move*dt;
  }
  if (keys["d"]) {
    this.cam.x += move*dt;
  }  
  if (keys["s"]) {
    this.cam.y += move*dt;
  }


  if (keys["space"] && this.cooldowns.follow <= 0) {
    if (this.cam.followObject == null) {
      this.messageHandler.setMessage("Following player!", 2);
      this.cam.follow(this.player, true, true, 1/3, 1/4);
    } else {
      this.cam.unFollow();
      this.messageHandler.setMessage("Not following player!", 2);
    }
    this.cooldowns.follow = this.toggleCD;
  }
  
  if (keys["c"] && this.cooldowns.lock <= 0) {
    if (this.player.camLocked == false) {
      this.messageHandler.setMessage("Player locked to camera!", 2);
      this.player.camLock(this.cam);
    } else {
      this.player.camUnlock();
      this.messageHandler.setMessage("Player not locked to camera!", 2);
    }
    this.cooldowns.lock = this.toggleCD;
  }

};


Game.prototype.handleAdminInput = function (dt) {
  
  if (keys["1"] && this.cooldowns.addEnemy <= 0) {
    this.world.addEnemies([new EvilHomer(this.grid, this.cam.x + Math.floor(this.cam.width*Math.random()),
                                         this.cam.y - 50, this.player)]);
    this.cooldowns.addEnemy = this.toggleCD/4;
  }

  if (keys["2"] && this.cooldowns.addEnemy <= 0) {
    this.world.addEnemies([new Slider(this.grid, this.cam.x + Math.floor(this.cam.width*Math.random()),
                                        this.cam.y - 50, this.player)]);
    this.cooldowns.addEnemy = this.toggleCD/4;
  }

  if (keys["3"] && this.cooldowns.addEnemy <= 0) {
    this.world.addEnemies([new Downer(this.grid, this.cam.x + Math.floor(this.cam.width*Math.random()),
                                        this.cam.y - 100)]);
    this.cooldowns.addEnemy = this.toggleCD/4;
  }

  if (keys["t"] && this.cooldowns.addEnemy <= 0) {
    this.randomAdd = ! this.randomAdd;
    this.messageHandler.setMessage(
      (this.randomAdd ? "Enabling" : "Disabling") + " random enemies.", 2);
    this.cooldowns.addEnemy = this.toggleCD/4;
  }

};
  

Game.prototype.handlePlayerInput = function (dt) {

  if (keys["z"]) {
    this.cam.unFollow();
    this.cam.centerOn(this.player, dt);
    this.messageHandler.setMessage("Finding player!", 1);
  }

  var dir = new Vector(0,0);

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

  if (keys["m"] && this.cooldowns.playertype <= 0) {
    this.player.toggleType();
    this.cooldowns.playertype = this.toggleCD;
  }
  
  if (keys["u"])
    this.motionHandler.unstuck(this.player);

  if (keys["v"])
    this.player.dampen = true;
  else
    this.player.dampen = false;
  
  this.player.setDir(dir);

};

Game.prototype.frameReset = function () {
  this.cam.setBaseVel();
};

Game.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = this.cam.width/2 - w/2;
  var y = this.cam.height/2 - h/2;
  this.context.strokeStyle = "red";
  this.context.strokeRect(~~x,~~y,w,h);
};

Game.prototype.lowerCooldowns = function (dt) {
  for (key in this.cooldowns) {
    this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
  }
};

Game.prototype.handlePlayerDeath = function () {
  this.world.removePlayer();
  this.player.reset();
  this.cam.unFollow();
};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;
  this.time = now;
  this.frameReset();
  this.lowerCooldowns(dt);

  this.handleCameraInput(dt);
  if (this.player.alive) {
    this.handleAdminInput(dt);
    this.handlePlayerInput(dt);
  }

  if (this.randomAdd)
    this.world.addRandomEnemy(dt);
  this.cam.move(dt);
  this.world.update(dt);

  this.messageHandler.render(dt);

  if (!this.player.alive)
    this.handlePlayerDeath();
};

Game.prototype.draw = function () {
  var camMoved = (this.campos == null) || (this.campos.y != this.cam.y) || (this.campos.x != this.cam.x);
  this.campos = {x:this.cam.x, y: this.cam.y};

  // draw backgrounds
  this.imageHandler.drawLevel(-1, this.cam.x, this.cam.y, this.cam.width, this.cam.height);
  // draw map background
  this.imageHandler.drawLevel(0, this.cam.x, this.cam.y, this.cam.width, this.cam.height);

  this.world.draw(this.context);
  //this.drawCrosshair();

  // draw overlayer
  this.imageHandler.drawLevel(1, this.cam.x, this.cam.y, this.cam.width, this.cam.height);
};

