function Player(ship, type, grid, x, y, vx, vy) {
  Movable.call(this, grid, x, y, ship.width, ship.height, ship.color, ship.speed, vx, vy, ship.fx, ship.fy, ship.drag);
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

  this.dt = 0;
  this.flame = 0;
  this.flameCurrent = 0;

  this.angleArchive = [0,0,0,0,0,0];
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
  for (var i = 0; i < this.angleArchive.length; i++)
    this.angleArchive[i] = 0;
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
  
  this.dt = dt;

  this.flame -= 10*dt + 20*dir.y * dt;
  if (this.flame <= 0)
    this.flame = 0;
  else if (this.flame > 6)
    this.flame = 6;

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
    var vs = (this.vx*this.vx + this.vy*this.vy)/(this.ship.speed*this.ship.speed);
    this.angle += (Math.max(0.3, 1 - vs))*dir.x * this.ship.omega * dt;
    for (var i = 0; i < this.angleArchive.length-1; i++) {
      this.angleArchive[i] = this.angleArchive[i+1];
    }
    this.angleArchive[this.angleArchive.length-1] = this.angle;
    var angle = this.angle + Math.PI/2;
    dir.x = dir.y * Math.cos(angle);
    dir.y = dir.y * Math.sin(angle);
  }
  
  if (this.camLocked) {
    if (!this.cam.folX) {
      this.x += this.cam.vx * dt;
    }
    if (!this.cam.folY) {
      this.y += this.cam.vy * dt;
    }
  }
  
  //Movable.prototype.move.call(this, motionHandler, dt, dir);
  motionHandler.move(this, dt, dir);

  if (this.gridLocked)
    this.adjustToGrid(this.grid);
  if (this.camLocked) {
    this.adjustToCam(this.cam);
  }

};


Player.prototype.draw = function (context, cam) {
  var x = this.x - cam.x;
  var y = this.y - cam.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;  
  
  // draw flames
  if (this.flame != 0) {
    var dir = this.getDirection();
    var orth = this.getOrthogonal();
    drawRotatedImage(context, this.getFlameSprite(this.dt), 
                     ~~(x+w/2 - 40*dir.x), ~~(y+h/2 - 40*dir.y), this.angleArchive[0]);
  }
  
  if (this.hasSprite) {
    if (this.type == "free")
      drawRotatedImage(context, this.getSprite(), ~~(x+w/2), ~~(y+h/2), this.angle);
    else
      context.drawImage(this.getSprite(), ~~x, ~~y);
  }
  else
    context.fillRect(~~x, ~~y, ~~w, ~~h);

};

Player.prototype.getFlameSprite = function (dt) {
  if (this.flame <= 4) {
    this.flameCurrent = 0;
    return this.ship.outflames[Math.floor(this.flame % 4)];
  } else {
    this.flameCurrent += 8*dt;
    if (this.flameCurrent >= 5)
      this.flameCurrent = 0;
    return this.ship.flames[Math.floor(this.flameCurrent)];
  }
};

Player.prototype.getDirection = function () {
  return new Vector(Math.cos(-this.angle + Math.PI/2), -Math.sin(-this.angle + Math.PI/2));
};

Player.prototype.getOrthogonal = function () {
  return new Vector(Math.cos(-this.angle), -Math.sin(-this.angle));
};

Player.prototype.fire = function (type) {
  var projectiles;
  var dir = this.getDirection();
  var vel = dir.multiply(600);
  vel.x += (this.camLocked && !this.cam.folX) ? this.cam.vx : 0;
  vel.y += (this.camLocked && !this.cam.folY) ? this.cam.vy : 0;
  var orth = this.getOrthogonal();

  
  projectiles = [new Laser(this.grid, this.getCenter().x-22*orth.x, this.getCenter().y-22*orth.y, vel.x, vel.y, this.angle),
                 new Laser(this.grid, this.getCenter().x-8*orth.x + 20*dir.x, this.getCenter().y-8*orth.y + 20*dir.y, vel.x, vel.y, this.angle),
                 new Laser(this.grid, this.getCenter().x+6*orth.x + 20*dir.x, this.getCenter().y+6*orth.y + 20*dir.y, vel.x, vel.y, this.angle),
                 new Laser(this.grid, this.getCenter().x+19*orth.x, this.getCenter().y+19*orth.y, vel.x, vel.y, this.angle)];
  return projectiles;
};
