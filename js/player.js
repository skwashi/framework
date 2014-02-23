function Player(grid, x, y, width, height, color, vel, accel, friction) {
  Movable.call(this, x, y, width, height, color, vel, accel, friction);
}
Player.prototype = Object.create(Movable.prototype);
