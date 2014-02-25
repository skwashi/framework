function Drawable(grid, x, y, width, height, color) {
  Rectangle.call(this, x, y, width, height);
  this.grid = grid;
  this.color = color;
  this.hasSprite = false;
  this.sprite = null;

  this.setGrid = function (grid) {
    this.grid = grid;
  };
  
  this.addSprite = function (sprite) {
    this.sprite = sprite;
    this.hasSprite = true;    
  };

}
    
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
    if (this.hasSprite)
      context.drawImage(this.sprite, x, y);
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
	context.drawImage(this.sprite, this.grid.projectX(rect.x - px),
			  this.grid.projectY(rect.y - py),
			  rect.width, rect.height,
			  rect.x, rect.y, rect.width, rect.height);
      else
	context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
};

function Movable(grid, x, y, width, height, color, vel, force, friction) {
  Drawable.call(this, grid, x, y, width, height, color);
  this.vel = vel;

  if (!(force === undefined))
    this.force = force;

  if (!(friction === undefined))
    this.friction = friction;
}

Movable.prototype = Object.create(Drawable.prototype, {
  vel: {value: new Vector(0, 0), writable: true}
});

Movable.prototype.move = function (dt, dir) {
  if (!(this.force === undefined || this.friction === undefined)) {
    if (!(dir === undefined)) {
      this.vel.x += this.force.x*dir.x*dt;
      this.vel.y += this.force.y*dir.y*dt;
    }
    this.vel.x -= this.friction*this.vel.x*dt;
    this.vel.y -= this.friction*this.vel.y*dt;
  }

  this.x += this.vel.x*dt;
  this.y += this.vel.y*dt;

};
