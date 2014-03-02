function Drawable(grid, x, y, width, height, color) {
  Rectangle.call(this, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  this.grid = grid;
  this.color = color;
  this.hasSprite = false;
  this.sprite = null;

  this.angle = 0;

  this.setGrid = function (grid) {
    this.grid = grid;
  };

  this.getCenter = function () {
    return new Vector (this.x + this.width/2, this.y + this.width/2);
  };
}

Drawable.prototype.reset = function (x, y, width, height, color) {
  this.x = x || this.x;
  this.y = y || this.y;
  this.width = width || this.width;
  this.height = height || this.height;
  this.color = color || this.color;
};

Drawable.prototype.addSprite = function (sprite) {
    this.sprite = sprite;
    this.hasSprite = true;    
};

Drawable.prototype.getSprite = function () {
    return this.sprite;
};

    
Drawable.prototype = Object.create(Rectangle.prototype, {
  color: {value: "black", writable: true}
});

Drawable.prototype.clear = function (context, cam) {
  context.clearRect(this.x - cam.pos.x, this.y - cam.pos.y, this.width, this.height);
};

Drawable.prototype.draw = function (context, cam, wrap) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;

  if (wrap === undefined || wrap == false) {
    x -= cam.pos.x;
    y -= cam.pos.y;

    if (this.angle != undefined && this.angle != 0) {
      context.save();
      context.translate(x + Math.floor(w/2), y + Math.floor(h/2));
      context.rotate(this.angle);
      if (this.hasSprite)
        context.drawImage(this.getSprite(), -w/2, -h/2);
      else
        context.fillRect(-w/2, -h/2, w, h);
      context.restore();
    } else if (this.hasSprite)
      context.drawImage(this.getSprite(), x, y);
    else
      context.fillRect(x, y, w, h);
  } else if (wrap == true) {
    var right = context.canvas.width;
    var bottom = context.canvas.height;
    var px = this.grid.projectX(this.x);
    var py = this.grid.projectY(this,y);
    
    var rectangles = this.wrap(right, bottom);
    var rect;
    for (var i = 0; i < rectangles.length; i++) {
      rect = rectangles[i];
      if (this.hasSprite) 
	context.drawImage(this.getSprite(), Math.round(this.grid.projectX(rect.x - px)),
			  Math.round(this.grid.projectY(rect.y - py)),
			  Math.round(rect.width), Math.round(rect.height),
			  Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height));
      else
	context.fillRect(Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height));
    }
  }
};

function Movable(grid, x, y, width, height, color, speed, vel, force, drag) {
  Drawable.call(this, grid, x, y, width, height, color);
  this.speed = speed;
  this.vel = vel;

  this.x = Math.round(x);
  this.y = Math.round(y);
  this.posfloat = new Vector(x - this.x, y - this.y);

  this.gridLocked = false;
  this.camLocked = false;
  this.cam = null;

  if (!(force === undefined))
    this.force = force;

  if (!(drag === undefined))
    this.drag = drag;
}

Movable.prototype = Object.create(Drawable.prototype, {
  speed: {vakue: 0, writable: true},
  vel: {value: new Vector(0, 0), writable: true}
});

Movable.prototype.move = function (motionHandler, dt, dir) {
  if (!(this.force === undefined || this.drag === undefined)) {
    if (!(dir === undefined)) {
      this.vel.x += this.force.x*dir.x*dt;
      this.vel.y += this.force.y*dir.y*dt;
    }
    this.vel.x -= this.drag*this.vel.x*dt;
    this.vel.y -= this.drag*this.vel.y*dt;
  }

  var deltaX = this.posfloat.x + this.vel.x*dt;
  var deltaY = this.posfloat.y + this.vel.y*dt;

  this.x += Math.round(deltaX);
  this.y += Math.round(deltaY);

  this.posfloat.x = deltaX - Math.round(deltaX);
  this.posfloat.y = deltaY - Math.round(deltaY);

  if (this.gridLocked)
    this.adjustToGrid();

  if (this.camLocked)
    this.adjustToCam(this.cam);
};

Movable.prototype.gridLock = function () {
  this.gridLocked = true;
};

Movable.prototype.camLock = function (cam) {
  this.camLocked = true;
  this.cam = cam;
};

Movable.prototype.adjustToRectangle = function (rect) {
  if (this.x < rect.x)
    this.x = rect.x;
  else if (this.x + this.width > rect.x + rect.width)
    this.x = rect.x + rect.width - this.width;
  
  if (this.y < rect.y)
    this.y = rect.y;
  else if (this.y + this.height > rect.y + rect.height)
    this.y = rect.y + rect.height - this.height;  
};

Movable.prototype.adjustToGrid = function () {
  if (this.x < 0 && !this.grid.openX) {
    this.x = 0;
    this.vel.x = 0;
    this.posfloat.x = 0;
  } else if (this.x + this.width > this.grid.width && !this.grid.openX) {
    this.x = this.grid.width - this.width;
    this.vel.x = 0;
    this.posfloat.x = 0;
  }
  
  if (this.y < 0 && !this.grid.openY) {
    this.y = 0;  
    this.vel.y = 0;
    this.posfloat.y = 0;
  } else if (this.y + this.height > this.grid.height && ! this.grid.openY) {
    this.y = this.grid.height - this.height;
    this.vel.y = 0;
    this.posfloat.y = 0;
  }
};

Movable.prototype.adjustToCam = function (cam) {
  this.adjustToRectangle({x: cam.pos.x, y: cam.pos.y, width: cam.width, height: cam.height});
};

