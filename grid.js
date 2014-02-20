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

  this.project = function (vector) {
    var gx = vector.x % this.width;
    var gy = vector.y % this.height;
    return new Vector((gx < 0) ? gx+this.width : gx, (gy < 0) ? gy+this.height : gy); 
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
  this.intialVel = vel.copy();
  
  this.set = function(pos, vel) {
    this.pos.set(pos);
    this.v.set(vel);
  }

  this.reset = function() {
    this.set(this.initialPos, this.initialVel);
  }

  this.move = function () {
    this.pos.increase(this.vel);
    this.pos = this.grid.projectRect(this.pos, this.width, this.height);
  }
  
}
