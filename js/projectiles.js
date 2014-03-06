function Projectile (grid, x, y, width, height, color, speed, vx, vy, angle) {
  Movable.call(this, grid, x, y, width, height, color, speed, vx, vy);
  this.angle = angle;
}
Projectile.prototype = Object.create(Movable.prototype);

function Laser (grid, x, y, vx, vy, angle) {
  Projectile.call(this, grid, x, y, 3, 10, "lightgreen", 1000, vx, vy, angle);
}
Laser.prototype = Object.create(Projectile.prototype);
