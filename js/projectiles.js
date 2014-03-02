function Projectile (grid, x, y, width, height, color, speed, vel, angle) {
  Movable.call(this, grid, x, y, width, height, color, speed, vel);
  this.angle = angle;
}
Projectile.prototype = Object.create(Movable.prototype);

function Laser (grid, x, y, vel, angle) {
  Projectile.call(this, grid, x, y, 3, 10, "lightgreen", 1000, vel, angle);
}
Laser.prototype = Object.create(Projectile.prototype);
