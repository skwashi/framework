function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.translate = function (x, y) {
    this.x += x;
    this.y += y;
  }

}


function Drawable(x, y, width, height, color) {
  Rectangle.call(this, x, y, width, height);
  this.color = color;

  this.draw = function (context, cam, wrap) {
    var x = this.x;
    var y = this.y;
    var w = this.width;
    var h = this.height;
    
    context.fillStyle = this.color;

    if (wrap == true) {
      var right = context.canvas.width;
      var bottom = context.canvas.height;
      
      x = (x < 0) ? (x % right) + right : x % right;
      y = (y < 0) ? (y % bottom) + bottom : y % bottom;

      if (x == right)
	x = 0;
      if (y == bottom)
	y = 0;
      
      if (y + h > bottom) {
	if (x + w > right) {
	  context.fillRect(x, y, right-x, bottom-y);
	  context.fillRect(0, y, w - (right-x), bottom-y);
	  context.fillRect(x, 0, right-x, h - (bottom-y));
	  context.fillRect(0, 0, w - (right-x), h - (bottom-y));
	} else {
	  context.fillRect(x, y, w, bottom-y);
	  context.fillRect(x, 0, w, h - (bottom-y));
	}
      } else if (x + w > right) {
	context.fillRect(x, y, right-x, h);
	context.fillRect(0, y, w - (right-x), h);
      } else {
	context.fillRect(x, y, w, h);
      }
      
    } else if (wrap == false) {
      x -= cam.pos.x;
      x -= cam.pos.y;
      context.fillRect(x, y, w, h);
    }

  }

}
    
Drawable.prototype = Object.create(Rectangle.prototype, {
  color: {value: "black", writable: true}
});
