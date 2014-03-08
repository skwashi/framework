function Circle(cx, cy, r, rt, color) {
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.rt = rt;
  this.color = color;
}

Circle.prototype.contains = function (vector) {
  return (vector.distance({x:this.cx, y: this.cy}));
};

Circle.prototype.draw = function (context, cam) {
  context.fillStyle = this.color;
  context.beginPath();
  context.arc(this.cx - cam.x, this.cy - cam.y, this.r, 0, 2*Math.PI);
  context.fill();
};

Circle.prototype.move = function (dt) {
  this.r += this.rt * dt;  
};

Circle.prototype.collides = function (rect) {
  var rx = (this.cx < rect.x + rect.width) ? 
        Math.max(this.cx, rect.x) :
        Math.min(this.cx, rect.x + rect.width);
  var ry = (this.cy < rect.y + rect.height) ?
        Math.max(this.cy, rect.y) :
        Math.min(this.cy, rect.y + rect.height);

  return this.contains(new Vector(rx, ry));
};

Circle.prototype.outOfRange = function (rect, range) {
  return (this.cx + this.r < rect.x - range ||
          this.cx - this.r > rect.x + rect.width + range ||
          this.cy + this.r < rect.y - range ||
          this.cy - this.r > rect.y + rect.height + range);
};

Circle.prototype.isSeen = function (cam) {
  return this.outOfRange(cam, 0) == false;
};
