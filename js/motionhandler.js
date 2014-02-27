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
  var oldpos = new Vector(object.x, object.y);
  var newpos;
  var d;
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


  newpos = new Vector (oldpos.x + vx * dt, oldpos.y + vy * dt);

  // check for collision with solid tiles

  d = newpos.subtract(oldpos);

  if (this.colHandler.collidesWithTile({x: oldpos.x + d.x, y: oldpos.y, width: object.width, height: object.height})) {
    newpos.x = oldpos.x;
    vx = 0;
  }

  if (this.colHandler.collidesWithTile({x: oldpos.x, y: oldpos.y + d.y, width: object.width, height: object.height})) {
    newpos.y = oldpos.y;
    vy = 0;
  }

  // check for grid borders

  var x = newpos.x; 
  var y = newpos.y;
  
  if (x < 0 && ! this.grid.openX) {
    x = 0;
    vx = 0;
  }
  else if (x > this.grid.width - object.width && !this.grid.openX) {
    x = this.grid.width - object.width;
    vx = 0;
  }
  
  if (y < 0 && !this.grid.openY) {
    y = 0;  
    vy = 0;
  }
  else if (y > this.grid.height - object.height && ! this.grid.openY) {
    vy = 0;
    y = this.grid.height - object.height;
  }

  object.vel.x = vx;
  object.vel.y = vy;
  object.x = x;
  object.y = y;

};


MotionHandler.prototype.jump = function (object) {
  if (this.colHandler.onGround(object))
    object.vel.y = -object.boost;
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
        if (!(this.colHandler.collidesWithTile({x: x, y: y, width: object.width, height: object.height}))) {
          object.x = x;
          object.y = y;
          return;
        }
      }
    range += 5;
  }

};
