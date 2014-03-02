function Player(ship, type, grid, x, y, vel) {
  Movable.call(this, grid, x, y, ship.width, ship.height, ship.color, ship.speed, vel, ship.force, ship.drag);
  this.ship = ship;
  this.hasSprite = true;

  this.type = type; // "free" or "up"
  
  this.angle = 0;
  this.rollAngle = 0;
  this.rollInc = this.ship.rollInc;
  this.rollMax = this.ship.rollMax;

  this.gridLocked = true;
  this.camLocked = false;

  this.cooldown = 0.1;
  this.cooldowns = {laser: 0};
}
Player.prototype = Object.create(Movable.prototype);

Player.prototype.lowerCooldowns = function (dt) {
  for (key in this.cooldowns) {
    this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
  }
};

Player.prototype.toggleType = function () {
  this.angle = 0;
  this.rollAngle = 0;
  this.type = (this.type == "free") ? "up" : "free";
};


Player.prototype.getSprite = function () {
  var angle = Math.floor(this.rollAngle/this.rollInc) * this.rollInc;
  var sprite = this.ship.sprites[angle];
  if (typeof(sprite) === "undefined") {
    return this.ship.sprite;
  }
  else {
    return sprite;
  }
};


Player.prototype.move = function (motionHandler, dt, dir) {
  
  if (this.type == "up") {
    var sign = (this.rollAngle == 0) ? 0 : ((this.rollAngle > 0) ? 1 : -1);
    var inc = this.rollInc - 1;

    if (sign*this.rollAngle < inc)
      this.rollAngle = 0;
    else
      this.rollAngle -= inc*sign * dt * 60;
    
    this.rollAngle += (this.rollInc+inc)*dir.x * dt * 60;

    if (this.rollAngle*sign > this.rollMax)
      this.rollAngle = sign*this.rollMax;
    
  } else if (this.type == "free") {
    this.angle += dir.x * this.ship.omega * dt;
    var angle = this.angle + Math.PI/2;
    dir.x = dir.y * Math.cos(angle);
    dir.y = dir.y * Math.sin(angle);
  }
  
  if (this.camLocked) {
    if (!this.cam.folX)
      this.x += this.cam.vel.x * dt;
    if (!this.cam.folY)
      this.y += this.cam.vel.y * dt;
  }

  motionHandler.move(this, dt, dir);

  if (this.gridLocked)
    this.adjustToGrid();
  if (this.camLocked) {
    this.adjustToCam(this.cam);
  }
};


Player.prototype.draw = function (context, cam) {
  var x = this.x - cam.pos.x;
  var y = this.y - cam.pos.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;  

  if (this.hasSprite) {
    if (this.type == "free")
      drawRotatedImage(context, this.getSprite(), Math.floor(x+w/2), Math.floor(y+h/2), this.angle);
    else
      context.drawImage(this.getSprite(), Math.round(x), Math.round(y));
  }
  else
    context.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};


Player.prototype.fire = function(type) {
  var projectiles;
  var dir = new Vector(Math.cos(-this.angle + Math.PI/2), -Math.sin(-this.angle + Math.PI/2));
  var vel = dir.multiply(600);
  var orth = new Vector(Math.cos(-this.angle), -Math.sin(-this.angle));

  
  projectiles = [new Laser(this.grid, this.getCenter().x-22*orth.x, this.getCenter().y-22*orth.y, vel, this.angle),
                 new Laser(this.grid, this.getCenter().x-8*orth.x + 20*dir.x, this.getCenter().y-8*orth.y + 20*dir.y, vel, this.angle),
                 new Laser(this.grid, this.getCenter().x+6*orth.x + 20*dir.x, this.getCenter().y+6*orth.y + 20*dir.y, vel, this.angle),
                 new Laser(this.grid, this.getCenter().x+19*orth.x, this.getCenter().y+19*orth.y, vel, this.angle)];
  return projectiles;
};
