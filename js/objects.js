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

Drawable.prototype.draw = function (context, cam, wrap) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;
  
  context.fillStyle = this.color;

  if (wrap === undefined || wrap == false) {
    x -= cam.x;
    y -= cam.y;

    if (this.angle != undefined && this.angle != 0) {
      context.save();
      context.translate(~~(x + w/2), ~~(y + h/2));
      context.rotate(this.angle);
      if (this.hasSprite)
        context.drawImage(this.getSprite(), ~(-w/2), ~(-h/2));
      else
        context.fillRect(-w/2, -h/2, w, h);
      context.restore();
    } else if (this.hasSprite)
      context.drawImage(this.getSprite(), ~~x, ~~y);
    else {
      context.fillRect(~~x, ~~y, ~~w, ~~h);
    }
  } else if (wrap == true) {
    var right = context.canvas.width;
    var bottom = context.canvas.height;
    var px = this.grid.projectX(this.x);
    var py = this.grid.projectY(this.y);
    
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
}

Movable.prototype = Object.create(Drawable.prototype);

Movable.prototype.move = function (motionHandler, dt, dir) {
  
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
};




