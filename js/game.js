function Game () {
  this.init = function (context, imageHandler, openX, openY) {
    this.context = context;
    this.imageHandler = imageHandler;
    this.openX = openX;
    this.openY = openY;
  };
}

Game.prototype.handleInput = function () {
  var move = 5;
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
  
  if (keys["x"]) {
    var vector = new Vector(this.grid.projectX(this.player.x), this.grid.projectY(this.player.y));
    console.log(this.colHandler.collidesWithTile(this.player));
  }
  
  this.player.move(1, dir, this.colHandler);
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
  this.frameReset();
  this.handleInput();
  this.cam.move();
  if (this.cam.canSee(this.player))
    this.player.draw(this.context, this.cam);
  this.drawCrosshair();
};


Game.prototype.loadMap = function (filename) {
  this.map = new Map(filename);
  this.map.load();
  var that = this;
  setTimeout(function () {
    that.grid = that.map.makeGrid(that.openX, that.openY);
    that.cam = new Camera(that.grid, new Vector(0, that.grid.height - that.context.canvas.height), 
                          that.context.canvas.width, that.context.canvas.height, new Vector(0, 0));
    that.player = new Player(that.grid, that.cam.pos.x + that.cam.width/2 - 10, 
                             that.cam.pos.y + that.cam.height - 40, 20, 40, "blue", 
                             new Vector(0, 0), new Vector(1,1), 0.1);
    that.imageHandler.addImage(that.map.getImage(0), that.context, that.map.getScale(0), 1);
    that.imageHandler.addImage(that.map.getImage(1), that.context, that.map.getScale(1), 2);
    that.imageHandler.addImage(that.map.getImage(2), that.context, that.map.getScale(2), 1);
    that.colHandler = new CollisionHandler(that.grid, that.map.getColArray(), that.map.tileWidth, that.map.tileHeight);  
  }, 2000);
  
};
