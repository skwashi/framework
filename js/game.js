function Game () {
  this.init = function (context, imageHandler, messageLayer, imageRepo, openX, openY) {
    this.context = context;
    this.imageHandler = imageHandler;
    this.messageLayer = messageLayer;
    this.imageRepo = imageRepo;
    this.openX = openX;
    this.openY = openY;
    this.time = Date.now();
  };
}

Game.prototype.handleInput = function (dt) {
  var move = 5 * 60;
  var dir = new Vector(0,0);

  if (keys["e"])
    move *= 2;

  if (keys["f"])
    move /= 2;

  if (keys["left"]) {
    this.cam.vel.x -= move;
  }
  if (keys["up"]) {
    this.cam.vel.y -= move;
  }
  if (keys["right"]) {
    this.cam.vel.x += move;
  }  
  if (keys["down"]) {
    this.cam.vel.y += move;
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

  if (keys["z"])
    this.cam.centerOn(this.player, dt);
  
  if (keys["x"]) {
    if (this.cam.followObject == null)
      this.cam.follow(this.player, true, true, 1/5, 1/4);
    else
      this.cam.unFollow();
  }

  if (keys["q"])
    this.motionHandler.unstuck(this.player);
  
  this.player.move(this.motionHandler, dt, dir);
};

Game.prototype.frameReset = function () {
  this.cam.vel.init(0, 0);
};

Game.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = this.grid.projectX(this.cam.getCenter().x - w/2 - this.cam.pos.x);
  var y = this.grid.projectY(this.cam.getCenter().y - h/2 - this.cam.pos.y);
  this.context.strokeStyle = "red";
  this.context.strokeRect(x,y,w,h);
};

Game.prototype.makeBlot = function () {
  var w = 21;
  var h = 21;
  var x = this.cam.getCenter().x - w/2;
  var y = this.cam.getCenter().y - h/2;
  var rect = new Drawable(x, y, w, h, "yellow");
  rect.draw(this.context, this.cam);
};

Game.prototype.update = function () {
  var now = Date.now();
  var dt = (now - this.time)/1000;

  this.time = now;

  this.frameReset();
  this.handleInput(dt);
  this.cam.move(dt);
  if (this.cam.canSee(this.player))
    this.player.draw(this.context, this.cam);
  this.drawCrosshair();
};


Game.prototype.loadMap = function (filename) {
  this.map = new Map(filename);
  this.map.load();
  var sprite = this.imageRepo.load("imgs/ship.png");
  var that = this;
  setTimeout(function () {
    that.grid = that.map.makeGrid(that.openX, that.openY);
    that.cam = new Camera(that.grid, new Vector(0, that.grid.height - that.context.canvas.height), 
                          that.context.canvas.width, that.context.canvas.height, new Vector(0, 0));

    that.player = new Player(that.grid, that.cam.pos.x + that.cam.width/2 - (sprite.width / 2), 
                             that.cam.pos.y + that.cam.height - sprite.height, sprite.width, sprite.height, "blue", 800,
                             new Vector(0, 0), new Vector(3200, 3200), 60/10, 800);
    that.player.addSprite(sprite, 0);

    that.imageHandler.addImage(that.map.getImage(0), that.context, that.map.getScale(0), 1);
    that.imageHandler.addImage(that.map.getImage(1), that.context, that.map.getScale(1), 2);
    
    that.colHandler = new CollisionHandler(that.grid, that.map.getColArray(), that.map.tileWidth, that.map.tileHeight);
    
    //that.motionHandler = new MotionHandler(that.grid, that.colHandler, "air");   
    that.motionHandler = new MotionHandler(that.grid, that.colHandler, "side");
    that.motionHandler.setGravity(1600);
    that.motionHandler.setFriction(60/10);
    
    that.loadPlayerSprites(5, 45);
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
