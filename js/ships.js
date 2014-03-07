function Ship (width, height, health, speed, color, fx, fy, drag, omega, filename) {
  this.width = width;
  this.height = height;
  this.health = health;
  this.speed = speed;
  this.color = color;
  this.fx = fx;
  this.fy = fy;
  this.drag = drag;
  this.filename = filename;
  this.omega = omega;

  this.sprite = null;
  this.sprites = {};
  this.flames = [];
  this.outflames = [];
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

Ship.prototype.loadFlameSprites = function(imageRepo) {
  for (var i = 1; i <= 4; i++)
    this.outflames.push(imageRepo.get("imgs/out" + i + ".png"));
  for (var j = 1; j <= 5; j++)
    this.flames.push(imageRepo.get("imgs/flame" + j + ".png"));
};

function Raptor (color) {
  Ship.call(this, 45, 52, 100, 700, color, 4200, 4200, 6, 2*Math.PI, "raptor"); // 800, (3200,3200), 6 ; (1200,1200), 0.5
  this.rollInc = 5;
  this.rollMax = 45;
};
Raptor.prototype = Object.create(Ship.prototype);
