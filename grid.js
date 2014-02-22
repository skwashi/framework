// coordinate system in which objects move
function Grid(width, height, openX, openY) {
  this.width = width;
  this.height = height;
  this.openX = openX;
  this.openY = openY;
  
  this.set = function (width, height, openX, openY) {
    this.width = width;
    this.height = height;
    this.openX = openX;
    this.openY = openY;
  }

  this.projectX = function (x) {
    var gx = (x < 0) ? (x % this.width) + this.width : x % this.width;
    return (gx == this.width) ? 0 : gx;
  }

  this.projectY = function (y) {
    var gy = (y < 0) ? (y % this.height) + this.height : y % this.height;
    return (gy == this.height) ? 0 : gy;
  }
  
  this.project = function (vector) {
    return new Vector(this.projectX(vector.x), this.projectY(vector.y));
  }

  this.projectRect = function (vector, width, height) {
    var x = vector.x;
    var y = vector.y;
    
    if (x < 0) 
      x = (this.openX) ? (x % this.width) + this.width : 0;  
    else if (x > this.width - width)
      x = (this.openX) ? (x % this.width) : this.width - width;

    if (y < 0) 
      y = (this.openY) ? (y % this.height) + this.height : 0;  
    else if (y > this.height - height)
      y = (this.openY) ? (y % this.height) : this.height - height;

    return new Vector(x, y);
  }

  this.isInside = function (vector, width, height) {
    return vector.x >= 0 && vector.x + width <= this.width &&
      vector.y >= 0 && vector.y + height <= this.height;
  }

}


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
  }

  this.reset = function () {
    this.set(this.initialPos, this.initialVel);
  }

  this.getPos = function () {
    return this.grid.project(this.pos);
  }

  this.getVel

  this.getCenter = function () {
    return new Vector(this.pos.x + (this.width-1)/2, this.pos.y + (this.height-1)/2);
  }

  this.move = function () {
    //this.pos.increase(this.vel);
    var x = this.pos.x += this.vel.x
    var y = this.pos.y += this.vel.y

    if (x < 0) 
      x = (this.grid.openX) ? x : 0;  
    else if (x > this.grid.width - this.width)
      x = (this.grid.openX) ? x : this.grid.width - this.width;

    if (y < 0) 
      y = (this.grid.openY) ? y : 0;  
    else if (y > this.grid.height - this.height)
      y = (this.grid.openY) ? y : this.grid.height - this.height;
    
    this.pos.init(x, y);
    //this.pos = this.grid.projectRect(this.pos, this.width, this.height);
  }
  
}
