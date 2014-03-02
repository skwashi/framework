function Ship (width, height, speed, color, force, drag, omega, filename) {
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.color = color;
  this.force = force;
  this.drag = drag;
  this.filename = filename;
  this.omega = omega;

  this.sprite = null;
  this.sprites = {};
}

Ship.prototype.loadSprites = function (imageRepo, inc, max) {
  this.sprite = imageRepo.get("imgs/" + this.filename + ".png");
  this.sprites[0] = this.sprite;
  var filename;
  for (var i = inc; i <= max; i += inc) {
    filename = "imgs/" + this.filename + "r" + i + ".png";
    this.sprites[i] = imageRepo.get(filename);
    filename = "imgs/" + this.filename + "l" + i + ".png";
    this.sprites[-i] = imageRepo.get(filename);
  }
  
  this.rollInc = inc;
  this.rollMax = max;
};


function Raptor (color) {
  Ship.call(this, 45, 52, 800, color, new Vector(3200, 3200), 6, 2*Math.PI, "raptor");
  this.rollInc = 5;
  this.rollMax = 45;
};
Raptor.prototype = Object.create(Ship.prototype);
