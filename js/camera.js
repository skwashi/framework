function Camera(grid, pos, width, height, vel) {
  this.grid = grid;
  this.width = width;
  this.height = height;
  this.pos = pos.copy();
  this.initialPos = pos.copy();
  this.vel = vel.copy();
  this.initialVel = vel.copy();
  
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
    return new Vector(this.pos.x + (this.width-1)/2, this.pos.y + (this.height-1)/2);
  };
  
}

Camera.prototype.move = function () {
  //this.pos.increase(this.vel);
  //this.pos = this.grid.projectRect(this.pos, this.width, this.height);

  var x = this.pos.x += this.vel.x;
  var y = this.pos.y += this.vel.y;

  if (x < 0) 
    x = (this.grid.openX) ? x : 0;  
  else if (x > this.grid.width - this.width)
    x = (this.grid.openX) ? x : this.grid.width - this.width;

  if (y < 0) 
    y = (this.grid.openY) ? y : 0;  
  else if (y > this.grid.height - this.height)
    y = (this.grid.openY) ? y : this.grid.height - this.height;
  
  this.pos.init(x, y);
};

Camera.prototype.canSee = function (rect) {
  return (rect.x + rect.width <= this.pos.x ||
	  rect.x <= this.pos.x + this.width ||
	  rect.y + rect.height <= this.pos.y ||
	  rect.y <= this.pos.y + this.height);
};
