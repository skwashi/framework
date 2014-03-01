function Camera(grid, pos, width, height, vel) {
  this.grid = grid;
  this.width = Math.round(width);
  this.height = Math.round(height);
  this.pos = pos.copy();
  this.initialPos = pos.copy();
  this.vel = vel.copy();
  this.initialVel = vel.copy();
  
  this.baseVel = vel.copy();

  this.followObject = null;
  this.folX = false;
  this.folY = false;
  this.folLimit = 0;
  this.pan = 1;

  this.set = function(pos, vel) {
    this.pos.set(pos);
    this.vel.set(vel);
  };

  this.reset = function () {
    this.set(this.initialPos, this.initialVel);
  };

  this.getPos = function () {
    return this.grid.project(this.pos);
  };

  this.getCenter = function () {
    return new Vector(Math.ceil(this.pos.x + (this.width-1)/2), Math.ceil(this.pos.y + (this.height-1)/2));
  };
  
}

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
  this.vel.x = (object.getCenter().x - this.getCenter().x) / t;
  this.vel.y = (object.getCenter().y - this.getCenter().y) / t;
};

Camera.prototype.move = function (dt) {

  if (!(this.followObject == null)) {
    if (this.folX) {
      if ((this.followObject.x < this.pos.x + this.width * this.folLimit
           && this.followObject.vel.x < 0)
          || (this.followObject.x > this.pos.x + (1-this.folLimit) * this.width
              && this.followObject.vel.x > 0))
        this.vel.x = this.followObject.vel.x;
      else
        this.vel.x = this.pan * this.followObject.vel.x;
    }
    if (this.folY) {
      if ((this.followObject.y < this.pos.y + this.height * this.folLimit
           && this.followObject.vel.y < 0)
          || (this.followObject.y + this.followObject.height > this.pos.y + (1-this.folLimit) * this.height
              && this.followObject.vel.y > 0))
        this.vel.y = this.followObject.vel.y;
      else
        this.vel.y = this.pan * this.followObject.vel.y;
    }
  }
  
  var x = this.pos.x += this.vel.x*dt;
  var y = this.pos.y += this.vel.y*dt;

  if (x < 0) {
    x = (this.grid.openX) ? x : 0;
  }
  else if (x > this.grid.width - this.width) {
    x = (this.grid.openX) ? x : this.grid.width - this.width;
  }

  if (y < 0) {
    y = (this.grid.openY) ? y : 0;
  }
  else if (y > this.grid.height - this.height) {
    y = (this.grid.openY) ? y : this.grid.height - this.height;
  }

  this.pos.init(x, y);
};

Camera.prototype.canSee = function (rect) {
  return !(rect.x + rect.width < this.pos.x ||
	  rect.x > this.pos.x + this.width ||
	  rect.y + rect.height < this.pos.y ||
	  rect.y > this.pos.y + this.height);
};
