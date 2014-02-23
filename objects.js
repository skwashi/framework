
function Drawable(x, y, width, height, color) {
  Rectangle.call(this, x, y, width, height);
  this.color = color;

  this.draw = function (context, cam, wrap) {
    var x = this.x;
    var y = this.y;
    var w = this.width;
    var h = this.height;
    
    context.fillStyle = this.color;

    if (wrap === undefined || wrap == false) {
      x -= cam.pos.x;
      y -= cam.pos.y;
      context.fillRect(x, y, w, h);
    } else if (wrap == true) {
      var right = context.canvas.width;
      var bottom = context.canvas.height;
      
      var rectangles = this.wrap(right, bottom);
      var rect;
      for (var i = 0; i < rectangles.length; i++) {
	rect = rectangles[i];
	context.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  };

}
    
Drawable.prototype = Object.create(Rectangle.prototype, {
  color: {value: "black", writable: true}
});


function Movable(x, y, width, height, color, vel) {
  Drawable.call(this, x, y, width, height, color)
  this.vel = vel;

  this.move = function () {
    this.x += this.vel.x;
    this.y += this.vel.y;
  }

}
Movable.prototype = Object.create(Drawable.prototype, {
  vel: {value: new Vector(0, 0), writable: true}
});
