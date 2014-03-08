function Circle(cx, cy, r, color) {
  this.center = new Vector(cx, cy);
  this.r = r;
  this.color = color;
}

Circle.prototype.getBox = function (box) {
  box.x = this.center.x - this.r;
  box.y = this.center.y - this.r;
  box.width = 2*this.r;
  box.height = 2*this.r;
};

Circle.prototype.contains = function (vector) {
  return (this.center.distance(vector) <= this.r);
};

Circle.prototype.draw = function (context, cam) {
  context.fillStyle = this.color;
  context.beginPath();
  context.arc(this.center.x - cam.x, this.center.y - cam.y, this.r, 0, 2*Math.PI);
  context.fill();
};

Circle.prototype.collides = function (shape) {
  if (shape instanceof Circle) {
    return this.center.distance(shape.center) < this.r + shape.r;
  }
  else if (shape instanceof Rectangle) {
    var rx = (this.center.x < shape.x + shape.width) ? 
          Math.max(this.center.x, shape.x) :
          Math.min(this.center.x, shape.x + shape.width);
    var ry = (this.center.y < shape.y + shape.height) ?
          Math.max(this.center.y, shape.y) :
          Math.min(this.center.y, shape.y + shape.height);
    return this.contains({x: rx, y: ry});
  }
  else
    return false;
};

Circle.prototype.outOfRange = function (rect, range) {
  return (this.center.x + this.r < rect.x - range ||
          this.center.x - this.r > rect.x + rect.width + range ||
          this.center.y + this.r < rect.y - range ||
          this.center.y - this.r > rect.y + rect.height + range);
};

Circle.prototype.isSeen = function (cam) {
  return this.outOfRange(cam, 0) == false;
};
