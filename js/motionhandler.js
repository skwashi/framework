function MotionHandler(grid, colHandler, type) {
  this.grid = grid;
  this.colHandler = colHandler;
  this.type = type;

  this.setGravity = function (gravity) {
    this.gravity = gravity;
  };

  this.setFriction = function (friction) {
    this.friction = friction;
  };
}

MotionHandler.prototype.types = ["space", "air", "side", "over"];

MotionHandler.prototype.move = function (object, dt, dir) {

  var vx = object.vel.x;
  var vy = object.vel.y;

  if (this.type == "air") {
    
    if (!(object.drag === undefined)) {
      vx -= vx * Math.min(1, object.drag * dt);
      vy -= vy * Math.min(1, object.drag * dt);
    }
  
    if (!(object.force === undefined || dir === undefined)) {
      if (vx * dir.x / (Math.abs(dir.x) || 1) <= object.speed)
        vx += object.force.x * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
      if (vy * dir.y / (Math.abs(dir.y) || 1) <= object.speed)
        vy += object.force.y * dir.y * dt;
      else
        vy = (vy > 0) ? object.speed : -object.speed;
    }
    
  } 

  else if (this.type == "side") {
    
    vy += this.gravity * dt;

    if (this.colHandler.onGround(object)) {
      vx -= vx * Math.min(1, this.friction * dt);
    } else
      vx -= vx * Math.min(1, object.drag*dt);

        
    if (!(object.force === undefined || dir === undefined)) {
      if (vx * dir.x / (Math.abs(dir.x) || 1) <= object.speed)
        vx += object.force.x * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
    }
    
  }
  
  else if (this.type == "space") {

    if (!(object.force === undefined || dir === undefined)) {
      if (dir.x == 0)
        vx = 0;
      else if (vx * dir.x / Math.abs(dir.x) <= object.speed)
        vx += object.force.x * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
        
      if (dir.y == 0)
        vy = 0;
      else if (vy * dir.y / Math.abs(dir.y) <= object.speed)
        vy += object.force.y * dir.y * dt;
      else
        vy = (vy > 0) ? object.speed : - object.speed;

    }
    
  }

  var deltax = object.posfloat.x + vx * dt;
  var deltay = object.posfloat.y + vy * dt;
  
  var dx = Math.round(deltax);
  var dy = Math.round(deltay);
  var remx = deltax - dx;
  var remy = deltay - dy;
 
  var oldx = object.x;
  var oldy = object.y;
  var tw = this.grid.tileWidth;
  var th = this.grid.tileHeight;

  // check for collision with solid tiles

  var incx = 0; 
  var incy = 0;

  if (dx > 0) {
    incx = this.grid.nextTileBorder(object, "right") - (oldx + object.width) - 1; 
    while(incx <= dx && !(this.colHandler.inSolid({x: oldx + incx + tw, y: oldy, width: object.width, height: object.height}))) {
      incx += tw;
    }
    incx = Math.min(dx, incx);
  } else if (dx < 0) {
    incx = this.grid.nextTileBorder(object, "left") - oldx + 1; 
    while(incx >= dx && !(this.colHandler.inSolid({x: oldx + incx - tw, y: oldy, width: object.width, height: object.height}))) {
      incx -= tw;
    }
    incx = Math.max(dx, incx);    
  }
  
  if (dy > 0) {
    incy = this.grid.nextTileBorder(object, "down") - (oldy + object.height) - 1; 
    while(incy <= dy && !(this.colHandler.inSolid({x: oldx + incx, y: oldy + incy + th, width: object.width, height: object.height}))) {
      incy += th;
    }
    incy = Math.min(dy, incy);
  } else if (dy < 0) {
    incy = this.grid.nextTileBorder(object, "up") - oldy + 1; 
    while(incy >= dy && !(this.colHandler.inSolid({x: oldx + incx, y: oldy + incy - th, width: object.width, height: object.height}))) {
      incy -= th;
    }
    incy = Math.max(dy, incy);    
  } 

 
  object.x = oldx + incx;
  object.y = oldy + incy;
  object.vel.x = vx;
  object.vel.y = vy;
  object.posfloat.x = remx;
  object.posfloat.y = remy;
 
};


MotionHandler.prototype.jump = function (object, dir) {
  if (this.colHandler.onGround(object)) {
    object.vel.y = -object.boost;
    //object.vel.x = object.boost*dir.x;
  }
};


MotionHandler.prototype.unstuck = function (object) {
  var range = 5;
  var max = Math.max(this.grid.width, this.grid.height); 
  var x, y;

  while(range <= 500) {
    for (var dx = -range; dx <= range; dx += range)
      for (var dy = -range; dy <= range; dy += range) {
        x = Math.min(Math.max(object.x + dx, 0), this.grid.width - object.width);
        y = Math.min(Math.max(object.y + dy, 0), this.grid.height - object.height);
        if (!(this.colHandler.inSolid({x: x, y: y, width: object.width, height: object.height}))) {
          object.x = x;
          object.y = y;
          return;
        }
      }
    range += 5;
  }

};
