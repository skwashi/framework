function Player(grid, x, y, width, height, color, speed, vel, force, drag, boost) {
  Movable.call(this, grid, x, y, width, height, color, speed, vel, force, drag);
  this.boost = boost;
  this.sprites = {};
  
  this.gridLocked = true;

  this.angle = 0;
  this.angleInc = 5;
  this.angleMax = 45;
  
}
Player.prototype = Object.create(Movable.prototype, {
  boost: {value: 0, writable: true}
});


Player.prototype.addSprite = function (sprite, angle) {
  this.hasSprite = true;
  if (angle == 0) {
    this.sprite = sprite;
    var shadow = document.createElement("canvas");
    shadow.width = sprite.width;
    shadow.height = sprite.height;
    this.shadowContext = shadow.getContext("2d");    
  }
  this.sprites[angle] = sprite;
};

Player.prototype.getSprite = function () {
  var angle = Math.floor(this.angle/this.angleInc) * this.angleInc;
  var sprite = this.sprites[angle];
  if (typeof(sprite) === "undefined") {
    return this.sprite;
  }
  else {
    return sprite;
  }
};

Player.prototype.move = function (motionHandler, dt, dir) {
  var sign = (this.angle == 0) ? 0 : ((this.angle > 0) ? 1 : -1);
  var inc = 4;
  
  if (sign*this.angle < inc)
    this.angle = 0;
  else
    this.angle -= inc*sign;

  this.angle += (5+inc)*dir.x;

  if (this.angle*sign > this.angleMax)
    this.angle = sign*this.angleMax;
  
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



function FreePlayer(grid, x, y, width, height, color, speed, vel, force, drag, boost) {
  Player.call(this, grid, x, y, width, height, color, speed, vel, force, drag, boost);
  this.angle = 0;
}
FreePlayer.prototype = Object.create(Player.prototype);

FreePlayer.prototype.move = function (motionHandler, dt, dir) {
  var omega = 2*Math.PI;

  this.angle += dir.x * omega * dt;
  
  if (this.camLocked) {
    if (!this.cam.folX)
      this.x += this.cam.vel.x * dt;
    if (!this.cam.folY)
      this.y += this.cam.vel.y * dt;
  }

  var ang = this.angle + Math.PI/2;
  dir.x = dir.y * Math.cos(ang);
  dir.y = dir.y * Math.sin(ang);

  motionHandler.move(this, dt, dir);

  if (this.gridLocked)
    this.adjustToGrid();

  if (this.camLocked) {
    this.adjustToCam(this.cam);
  }
};


FreePlayer.prototype.draw = function (context, cam) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;
  
  x -= cam.pos.x;
  y -= cam.pos.y;
  if (this.hasSprite) {
    drawRotatedImage(context, this.getSprite(), Math.round(x+this.width/2), Math.round(y+this.height/2), this.angle);
  }
  else
    context.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  
};
