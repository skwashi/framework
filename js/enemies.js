// General enemy classes

function Mover(grid, x, y, width, height, color, speed, vx, vy) {
  Movable.call(this, grid, x, y, width, height, color, speed, vx, vy);
};
Mover.prototype = Object.create(Movable.prototype);

function Targeter(grid, x, y, width, height, color, speed, target) {
  Movable.call(this, grid, x, y, width, height, color, speed, 0, 0);
  var dir;
  if (target == undefined || target.alive == false)
    dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1);
  else
    dir = new Vector(target.getCenter().x - this.getCenter().x,
                     target.getCenter().y - this.getCenter().y);
  this.angle = Math.atan2(dir.y, dir.x);
  this.target = target;
  this.vx = speed*Math.cos(this.angle);
  this.vy = speed*Math.sin(this.angle);
};
Targeter.prototype = Object.create(Movable.prototype);

function Homer(grid, x, y, width, height, color, speed, vx, vy, fx, fy, drag, target) {
  Movable.call(this, grid, x, y, width, height, color, speed, vx, vy, fx, fy, drag);
  this.target = target;
  this.angle = 0;
};
Homer.prototype = Object.create(Movable.prototype);

Homer.prototype.move = function (dt) {
  var dir;
  if (this.target == undefined || this.target == null || this.target.alive == false)
    dir = new Vector(Math.random()*2 - 1, Math.random()*2 - 1);
  else 
    dir = new Vector(this.target.getCenter().x - this.getCenter().x, 
                     this.target.getCenter().y - this.getCenter().y);
  this.angle = Math.atan2(dir.y, dir.x);
  dir.normalize();
  Movable.prototype.move.call(this, dt, dir);
};



// Particular enemy classes

function Downer(grid, x, y) {
  Movable.call(this, grid, x, y, 24, 51, "orange", 500, 0, 500);
  this.health = 2;
  this.addSprite(game.imageRepo.get("imgs/hemskeld.png"));
};
Downer.prototype = Object.create(Movable.prototype);

function Slider(grid, x, y, target) {
  Targeter.call(this, grid, x, y, 24, 51, "yellow", 1000, target);
  this.health = 2;
  this.addSprite(game.imageRepo.get("imgs/hemskeld2.png"));
  //this.addSprite(game.imageRepo.get("imgs/shuriken50.gif"));
};
Slider.prototype = Object.create(Targeter.prototype);

function EvilHomer(grid, x, y, target) {
  Homer.call(this, grid, x, y, 40, 80, "darkgrey", 1000, 0, 0, 2000, 2000, 6, target);
  this.health = 2;
  this.addSprite(game.imageRepo.get("imgs/shark1a.png"));
};
EvilHomer.prototype = Object.create(Homer.prototype);

function Exp(x, y, r, rt, color) {
  Circle.call(this, x, y, r, color);
  this.rt = rt;
  this.damage = r;
  this.alive = true;
  this.health = 40000;
  this.time = 0;
};
Exp.prototype = Object.create(Circle.prototype);

Exp.prototype.move = function (dt) {
  // r = r0 + rt0*t - k/2*t^2 (k = 10);
  this.time += dt;
  this.rt -= 30*dt;
  this.r += this.rt*dt;
  this.r = Math.max(this.r, 0);
  if (this.r <= 0) {
    this.alive = false;
    this.timeToDeath = 0;
  }
  this.damage = this.r;
};

Exp.prototype.deathSpawn = function () { return []; };
