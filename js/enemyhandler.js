function EnemyHandler () {
  this.types = ["Downer", "Slider", "EvilHomer"];
};

EnemyHandler.prototype.randomType = function () {
  return this.types[Math.floor(Math.random()*this.types.length)];
};

EnemyHandler.prototype.newEnemy = function (type) {
  var enemy;
  switch(type)
  {
  case "Downer":
    enemy = new Downer(arguments[1], arguments[2], arguments[3]);
    break;
  case "Slider":
    enemy = new Slider(arguments[1], arguments[2], arguments[3], arguments[4]);
    break;
  case "EvilHomer":
    enemy = new EvilHomer(arguments[1], arguments[2], arguments[3], arguments[4]);
    break;
  default:
    enemy = new Downer(arguments[1], arguments[2], arguments[3]);
  }
  return enemy;
};
