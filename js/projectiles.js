function Projectile (grid, x, y, width, height, color, speed, vx, vy, angle, damage) {
  Movable.call(this, grid, x, y, width, height, color, speed, vx, vy);
  this.angle = angle;
  this.damage = damage;
}
Projectile.prototype = Object.create(Movable.prototype);
Projectile.prototype.deathSpawn = function () { return []; };

function Laser (grid, x, y, vx, vy, angle) {
  Projectile.call(this, grid, x, y, 3, 10, "lightgreen", 1000, vx, vy, angle, 1);
}
Laser.prototype = Object.create(Projectile.prototype);
