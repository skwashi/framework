function MotionHandler() {
  this.init = function (grid, type) {
    this.grid = grid;
    this.type = type;
  };
  
  this.setGravity = function (gravity) {
    this.gravity = gravity;
  };

  this.setFriction = function (friction) {
    this.friction = friction;
  };
}

MotionHandler.prototype.types = ["space", "air", "side", "over"];

MotionHandler.prototype.move = function (object, dt, dir) {

  var vx = object.vx;
  var vy = object.vy;

  if (this.type == "air") {
    
    if (!(object.drag === undefined)) {
      vx -= vx * Math.min(1, object.drag * dt);
      vy -= vy * Math.min(1, object.drag * dt);
    }
  
    if (!(dir === undefined)) {
      if (vx * dir.x / (Math.abs(dir.x) || 1) <= object.speed)
        vx += object.fx * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
      if (vy * dir.y / (Math.abs(dir.y) || 1) <= object.speed)
        vy += object.fy * dir.y * dt;
      else
        vy = (vy > 0) ? object.speed : -object.speed;
    }
    
  } 

  else if (this.type == "side") {
    
    vy += this.gravity * dt;
    if (game.colHandler.onGround(object)) {
      vx -= vx * Math.min(1, this.friction * dt);
    } else
      vx -= vx * Math.min(1, object.drag*dt);
        
    if (!(dir === undefined)) {
      if (vx * dir.x / (Math.abs(dir.x) || 1) <= object.speed)
        vx += object.fx * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
    }
    
  }
  
  else if (this.type == "space") {

    if (!(dir === undefined)) {
      if (dir.x == 0)
        vx = 0;
      else if (vx * dir.x / Math.abs(dir.x) <= object.speed)
        vx += object.fx * dir.x * dt;
      else
        vx = (vx > 0) ? object.speed : -object.speed;
        
      if (dir.y == 0)
        vy = 0;
      else if (vy * dir.y / Math.abs(dir.y) <= object.speed)
        vy += object.fy * dir.y * dt;
      else
        vy = (vy > 0) ? object.speed : - object.speed;

    }
    
  }
  
  var dx = vx*dt;
  var dy = vy*dt;

  if (object.camLocked) {
    if (!object.cam.folX)
      dx += object.base.vx * dt;
    if (!object.cam.folY)
      dy += object.base.vy * dt;
  }

  var oldx = object.x;
  var oldy = object.y;
  var tw = this.grid.tileWidth;
  var th = this.grid.tileHeight;

  // check for collision with solid tiles
  
  var incx = 0; 
  var incy = 0;

  if (dx > 0) {
    incx = this.grid.nextTileBorder(object, "right") - (oldx + object.width);
    while(incx <= dx && !(game.colHandler.inSolid({x: oldx + incx + tw, y: oldy, width: object.width, height: object.height}))) {
      incx += tw;
    }
    incx = Math.min(dx, incx);
    if (incx < dx)
      vx = 0;
  } else if (dx < 0) {
    incx = this.grid.nextTileBorder(object, "left") - oldx; 
    while(incx >= dx && !(game.colHandler.inSolid({x: oldx + incx - tw, y: oldy, width: object.width, height: object.height}))) {
      incx -= tw;
    }
    incx = Math.max(dx, incx);
    if (incx > dx)
      vx = 0;
  }
  
  if (dy > 0) {
    incy = this.grid.nextTileBorder(object, "down") - (oldy + object.height); 
    while(incy <= dy && !(game.colHandler.inSolid({x: oldx + incx, y: oldy + incy + th, width: object.width, height: object.height}))) {
      incy += th;
    }
    incy = Math.min(dy, incy);
    if (incy < dy)
      vy = 0;
  } else if (dy < 0) {
    incy = this.grid.nextTileBorder(object, "up") - oldy; 
    while(incy >= dy && !(game.colHandler.inSolid({x: oldx + incx, y: oldy + incy - th, width: object.width, height: object.height}))) {
      incy -= th;
    }
    incy = Math.max(dy, incy);
    if (incy > dy)
      vy = 0;
  } 

  object.x = oldx + incx;
  object.y = oldy + incy;
  object.vx = vx;
  object.vy = vy;
  
  
  // check for collision with solid objects
  
  var colObjects = game.colHandler.collidingObjects("solids", object);
  
  _.forEach(colObjects, function (co) {
    if (oldx + object.width <= co.x) {
      object.x = co.x - object.width;
      object.vx = 0;
    }
    else if (oldx >= co.x + co.width) {
      object.x = co.x+co.width;
      object.vx = 0;
    }
    else if (oldy + object.height <= co.y) {
      object.y = co.y - object.height;
      object.vy = 0;
    }
    else if (oldy >= co.y + co.height) {
      object.y = co.y + co.height;
      object.vy = 0;
    }
  }, this);
 
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
        if (!(game.colHandler.inSolid({x: x, y: y, width: object.width, height: object.height}))) {
          object.x = x;
          object.y = y;
          return;
        }
      }
    range += 5;
  }

};
