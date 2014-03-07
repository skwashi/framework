function Drawable(grid, x, y, width, height, color) {
  Rectangle.call(this, x, y, width, height);
  this.grid = grid;
  this.color = color;
  this.hasSprite = false;
  this.sprite = null;
}
Drawable.prototype = Object.create(Rectangle.prototype);

Drawable.prototype.addSprite = function (sprite) {
    this.sprite = sprite;
    this.hasSprite = true;    
};

Drawable.prototype.getSprite = function () {
    return this.sprite;
};
   
Drawable.prototype.clear = function (context, cam) {
  context.clearRect(~~(this.x - cam.x), ~~(this.y - cam.y), ~~this.width, ~~this.height);
};

Drawable.prototype.draw = function (context, cam) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;

  x -= cam.x;
  y -= cam.y;

  if (this.angle != undefined && this.angle != false) {
    context.save();
    context.translate(~~(x + w/2), ~~(y + h/2));
    context.rotate(Math.PI/2 + this.angle);
    if (this.hasSprite)
      context.drawImage(this.getSprite(), ~(-w/2), ~(-h/2));
    else {
      context.fillRect(-w/2, -h/2, w, h);
    }
    context.restore();
  } else if (this.hasSprite)
    context.drawImage(this.getSprite(), ~~x, ~~y);
  else {
    context.fillRect(~~x, ~~y, ~~w, ~~h);
  }

};

function Movable(grid, x, y, width, height, color, speed, vx, vy, fx, fy, drag) {
  Drawable.call(this, grid, x, y, width, height, color);
  this.speed = speed;
  this.vx = vx;
  this.vy = vy;
  this.fx = fx || 0;
  this.fy = fy || 0;
  this.drag = drag || 0;

  this.gridLocked = false;
  this.camLocked = false;
  this.cam = null;

  this.alive = true;
  this.health = 1;
}
Movable.prototype = Object.create(Drawable.prototype);

Movable.prototype.takeDamage = function (damage) {
  this.health -= damage;
  if (this.health <= 0) {
    this.health = 0;
    this.alive = false;
  };
};

Movable.prototype.move = function (dt, dir) {
  
  if (!(dir === undefined)) {
    this.vx += this.fx*dir.x*dt;
    this.vy += this.fy*dir.y*dt;
  }

  if (this.drag != 0) {
    this.vx -= this.vx*Math.min(1, this.drag*dt);
    this.vy -= this.vy*Math.min(1, this.drag*dt);
  };

  this.x += this.vx*dt;
  this.y += this.vy*dt;

  if (this.gridLocked)
    this.adjustToGrid(this.grid);

  if (this.camLocked)
    this.adjustToCam(this.cam);
};

Movable.prototype.gridLock = function () {
  this.gridLocked = true;
};

Movable.prototype.camLock = function (cam) {
  this.camLocked = true;
  this.cam = cam;
  this.basevel = cam.basevel;
};

Movable.prototype.camUnlock = function () {
  this.camLocked = false;
  this.cam = null;
  this.basevel = {x: 0, y: 0};
};

Movable.prototype.deathSpawn = function () {
  var pi = Math.PI;
  var a = this.angle;
  return [this.split(a + 3*pi/4), this.split(a + pi/2), this.split(a + pi/4),
	  this.split(a + pi),                           this.split(a + 0),
	  this.split(a - 3*pi/4), this.split(a - pi/2), this.split(a - pi/4)];
};

Movable.prototype.split = function (angle) {
  var dx = Math.cos(angle);
  var dy = Math.sin(angle);
  var w = this.width/3;
  var h = this.height/3;
  var x = this.x + (dx+1)*w;
  var y = this.y + (dy+1)*w;
  var vx = 600*dx;
  var vy = 600*dy;
  var block = new Projectile(this.grid, x, y, w, h, this.color, this.speed, vx, vy, angle);
  block.alive = false;
  block.timeToDeath = 1;
  return block;
};
