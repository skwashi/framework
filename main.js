function Test () {
  this.init = function () {
  }
}

Test.prototype.handleInput = function () {
  // player movement
  
  var xMove = 0;
  var yMove = 0;

  if (keys["left"]) {
    cam.vel.x -= 5;
  }
  if (keys["up"]) {
    cam.vel.y -= 5;
  }
  if (keys["right"]) {
    cam.vel.x += 5;
  }  
  if (keys["down"]) {
    cam.vel.y += 5;
  }
  
}

Test.prototype.frameReset = function () {
  cam.vel.init(0, 0);
}

Test.prototype.update = function () {
  this.frameReset();
  this.handleInput();
  cam.move();
}


function render() {
  requestAnimationFrame(render);
  if (map.ready == true) {
    grid = map.makeGrid(false, true);
    cam = new Camera(grid, new Vector(0, 0), cwidth, cheight, new Vector(0, 0));
    map.ready = false;
    go = true;
  }
  if (go == true) {
    map.drawLayers(context, cam.pos, cam.width, cam.height);
    test.update();
  }
}

var map = new Map("maps/world.json");
var cam;
var test = new Test();
var go = false;

function init() {
  map.load();
  render();
}

window.onload = function() {
  init();
}
