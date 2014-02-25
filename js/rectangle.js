function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.translate = function (x, y) {
    this.x += x;
    this.y += y;
  };
    
}

Rectangle.prototype.wrap = function (right, bottom) {
  var x = this.x;
  var y = this.y;
  var w = this.width;
  var h = this.height;

  x = (x < 0) ? (x % right) + right : x % right;
  y = (y < 0) ? (y % bottom) + bottom : y % bottom;

  if (x == right)
    x = 0;
  if (y == bottom)
    y = 0;
  
  var rectangles = [];
  
  if (y + h > bottom) {
    if (x + w > right) {
      rectangles.push(new Rectangle(x, y, right-x, bottom-y));
      rectangles.push(new Rectangle(0, y, w - (right-x), bottom-y));
      rectangles.push(new Rectangle(x, 0, right-x, h - (bottom-y)));
      rectangles.push(new Rectangle(0, 0, w - (right-x), h - (bottom-y)));
    } else {
      rectangles.push(new Rectangle(x, y, w, bottom-y));
      rectangles.push(new Rectangle(x, 0, w, h - (bottom-y)));
    }
  } else if (x + w > right) {
    rectangles.push(new Rectangle(x, y, right-x, h));
    rectangles.push(new Rectangle(0, y, w - (right-x), h));
  } else {
    rectangles.push(new Rectangle(x, y, w, h));
  }
  
  return rectangles;
};

Rectangle.prototype.span = function (rectangle) {
  var x = Math.min(this.x, rectangle.x);
  var y = Math.min(this.y, rectangle.y);
  var w = Math.max(this.x + this.width - x, rectangle.x + rectangle.width - x);
  var h = Math.max(this.y + this.height - y, rectangle.y + rectangle.height - y);
  return new Rectangle(x, y, w, h);
};

Rectangle.prototype.collides = function (rectangle) {
  var x = this.x; var y = this.y;
  var w = this.width; var h = this.height;
  var rx = rectangle.x; var ry = rectangle.y;
  var rw = rectangle.width; var rh = rectangle.height;
  
  return (rx <= x + w && x <= rx + rw &&
	  ry <= y + h && y <= ry + rh);
};
