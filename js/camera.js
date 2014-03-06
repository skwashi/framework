function Camera(grid, x, y, width, height, vx, vy) {
  Rectangle.call(this, x, y, width, height);
  this.grid = grid;
  this.vx = vx;
  this.vy = vy;
  this.initial = {x: x, y: y, vx: vx, vy: vy};
  this.base = {vx: vx, vy: vy};

  this.followObject = null;
  this.folX = false;
  this.folY = false;
  this.folLimit = 0;
  this.pan = 1;

  this.set = function(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  };

  this.setBaseVel = function () {
    this.vx = this.base.vx;
    this.vy = this.base.vy;
  };

  this.reset = function () {
    this.set(this.initial.x, this.initial.y,
             this.initial.vx, this.initial.vy);
  };

  this.getPos = function () {
    return this.grid.project(x, y);
  };
  
}
Camera.prototype = Object.create(Rectangle.prototype);

Camera.prototype.follow = function (object, folX, folY, limit, pan) {
  this.followObject = object;
  this.folX = folX;
  this.folY = folY;
  this.folLimit = limit;
  this.pan = pan;
};

Camera.prototype.unFollow = function () {
  this.followObject = null;
  this.folX = false;
  this.folY = false;
  this.pan = 1;
};

Camera.prototype.centerOn = function (object, dt) {
  var t = 5*dt;
  this.vx = (object.getCenter().x - this.getCenter().x) / t;
  this.vy = (object.getCenter().y - this.getCenter().y) / t;
};

Camera.prototype.findObject = function (object) {
  this.x += object.getCenter().x - this.getCenter().x;
  this.y += object.getCenter().y - this.getCenter().y;
};

Camera.prototype.move = function (dt) {

  if (!(this.followObject == null)) {
    if (this.folX) {
      if ((this.followObject.x < this.x + this.width * this.folLimit
           && this.followObject.vx < 0)
          || (this.followObject.x > this.x + (1-this.folLimit) * this.width
              && this.followObject.vx > 0))
        this.vx = this.followObject.vx;
      else
        this.vx = this.pan * this.followObject.vx;
    }
    if (this.folY) {
      if ((this.followObject.y < this.y + this.height * this.folLimit
           && this.followObject.vy < 0)
          || (this.followObject.y + this.followObject.height > this.y + (1-this.folLimit) * this.height
              && this.followObject.vy > 0))
        this.vy = this.followObject.vy;
      else
        this.vy = this.pan * this.followObject.vy;
    }
  }
  
  this.x += this.vx*dt;
  this.y += this.vy*dt;

  this.adjustToGrid(this.grid);
};

Camera.prototype.canSee = function (rect) {
  return !(rect.x + rect.width < this.x ||
	  rect.x > this.x + this.width ||
	  rect.y + rect.height < this.y ||
	  rect.y > this.y + this.height);
};

Camera.prototype.outOfRange = function (rect, n) {
  return (rect.x + rect.width < this.x - n*this.width ||
          rect.x > this.x + (n+1)*this.width ||
          rect.y + rect.height < this.y - n*this.height ||
          rect.y > this.y + (n+1)*this.height);
};
