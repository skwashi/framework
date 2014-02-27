function Drawable(grid, x, y, width, height, color) {
  Rectangle.call(this, x, y, width, height);
  this.grid = grid;
  this.color = color;
  this.hasSprite = false;
  this.sprite = null;

  this.setGrid = function (grid) {
    this.grid = grid;
  };

  this.getCenter = function () {
    return new Vector (this.x + (this.width-1)/2, this.y + (this.width-1)/2);
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

Drawable.prototype.draw = function (context, cam, wrap) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;

  if (wrap === undefined || wrap == false) {
    x -= cam.pos.x;
    y -= cam.pos.y;
    if (this.hasSprite) {
      context.drawImage(this.getSprite(), x, y);
    }
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
	context.drawImage(this.getSprite(), this.grid.projectX(rect.x - px),
			  this.grid.projectY(rect.y - py),
			  rect.width, rect.height,
			  rect.x, rect.y, rect.width, rect.height);
      else
	context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
};

function Movable(grid, x, y, width, height, color, speed, vel, force, drag) {
  Drawable.call(this, grid, x, y, width, height, color);
  this.speed = speed;
  this.vel = vel;

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

  this.x += this.vel.x*dt;
  this.y += this.vel.y*dt;

};
