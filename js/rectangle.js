function Rectangle(x, y, width, height, color, angle) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color || "black";
  this.angle = angle || 0;

  this.set = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w || this.width;
    this.height = h || this.height;
  };

  this.translate = function (x, y) {
    this.x += x;
    this.y += y;
  };
    
  this.getCenter = function () {
    return {x:this.x + this.width/2, y: this.y + this.width/2};
  };
};

Rectangle.prototype.contains = function (vector) {
  return (vector.x >= this.x && vector.x < this.x + this.width &&
          vector.y >= this.y && vector.y < this.y + this.height);
};

Rectangle.prototype.adjustToRectangle = function (rect) {
  if (this.x < rect.x)
    this.x = rect.x;
  else if (this.x + this.width > rect.x + rect.width)
    this.x = rect.x + rect.width - this.width;
  
  if (this.y < rect.y)
    this.y = rect.y;
  else if (this.y + this.height > rect.y + rect.height)
    this.y = rect.y + rect.height - this.height;  
};

Rectangle.prototype.adjustToGrid = function (grid) {
  if (this.x < 0 && !grid.openX) {
    this.x = 0;
    this.vx = 0;
  } else if (this.x + this.width > grid.width && !grid.openX) {
    this.x = grid.width - this.width;
    this.vx = 0;
  }
  
  if (this.y < 0 && !grid.openY) {
    this.y = 0;  
    this.vy = 0;
  } else if (this.y + this.height > grid.height && ! grid.openY) {
    this.y = grid.height - this.height;
    this.vy = 0;
  }
};

Rectangle.prototype.adjustToCam = function (cam) {
  this.adjustToRectangle(cam);
};


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

Rectangle.prototype.collides = function (shape) {
  if (shape instanceof Rectangle) {
    var x = this.x; var y = this.y;
    var w = this.width; var h = this.height;
    var rx = shape.x; var ry = shape.y;
    var rw = shape.width; var rh = shape.height;
    
    return (rx < x + w && x < rx + rw &&
	    ry < y + h && y < ry + rh);
  } else if (shape instanceof Circle)
    return shape.collides(this);
  else
    return false;
};

Rectangle.prototype.isSeen = function (cam) {
  return !(this.x + this.width < cam.x ||
	  this.x > cam.x + cam.width ||
	  this.y + this.height < cam.y ||
	  this.y > cam.y + cam.height);
};

Rectangle.prototype.outOfRange = function (rect, range) {
  return (this.x + this.width < rect.x - range ||
          this.x > rect.x + rect.width + range ||
          this.y + this.height < rect.y - range||
          this.y > rect.y + rect.height + range);
};
