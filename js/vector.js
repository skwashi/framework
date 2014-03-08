function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.init = function (x, y) {
    this.x = x;
    this.y = y;
  };

  this.set = function (v) {
    this.x = v.x;
    this.y = v.y;
  };
  
  this.increase = function (v) {
    this.x += v.x;
    this.y += v.y;
  };

  this.decrease = function (v) {
    this.x -= v.x;
    this.y -= v.y;
  };

  this.scale = function (a) {
    this.x *= a;
    this.y *= a;
  };

  this.normalize = function () {
    var l = this.length();
    if (l != 0) {
      this.x /= l;
      this.y /= l;
    }
  };

  this.isZero = function () {
    return (this.x == 0 && this.y == 0);
  };

}

Vector.prototype.distance = function (v) {
  var x = v.x - this.x;
  var y = v.y - this.y;
  return Math.sqrt(x*x + y*y);
};

Vector.prototype.equals = function (v) {
  return this.x == v.x && this.y == v.y;
};

Vector.prototype.copy = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.add = function (v) {
  return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function (v) {
  return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.multiply = function (a) {
  return new Vector(this.x * a, this.y * a);
};

Vector.prototype.length = function () {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};
