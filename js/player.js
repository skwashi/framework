function Player(grid, x, y, width, height, color, vel, force, friction) {
  Movable.call(this, grid, x, y, width, height, color, vel, force, friction);
}
Player.prototype = Object.create(Movable.prototype);

Player.prototype.move = function (dt, dir, ch) {
  var oldpos = new Vector(this.x, this.y);
  
  Movable.prototype.move.call(this, dt, dir);

  var newpos = new Vector(this.x, this.y);
  var d = newpos.subtract(oldpos);

  if (ch.collidesWithTile({x: oldpos.x + d.x, y: oldpos.y, width: this.width, height: this.height})) {
    newpos.x = oldpos.x;
    this.vel.x = 0;//- this.vel.x;
  }

  if (ch.collidesWithTile({x: oldpos.x, y: oldpos.y + d.y, width: this.width, height: this.height})) {
    newpos.y = oldpos.y;
    this.vel.y = 0;//- this.vel.y;
  }

  var x = newpos.x; 
  var y = newpos.y;
  
  if (x < 0 && ! this.grid.openX) {
    this.vel.x = 0;
    x : 0;
  }
  else if (x > this.grid.width - this.width && !this.grid.openX) {
    x = this.grid.width - this.width;
    this.vel.x = 0;
  }
  
  if (y < 0 && !this.grid.openY) {
    y = 0;  
    this.vel.y = 0;
  }
  else if (y > this.grid.height - this.height && ! this.grid.openY) {
    this.vel.y = 0;
    y = this.grid.height - this.height;
  }

  this.x = x;
  this.y = y;

};
