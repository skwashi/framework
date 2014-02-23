function Test () {
  this.init = function () {
  }
}

Test.prototype.handleInput = function () {
  var move = 5;
  
  if (keys["e"])
    move *= 2;

  if (keys["f"])
    move /= 2;

  if (keys["left"]) {
    cam.vel.x -= move;
  }
  if (keys["up"]) {
    cam.vel.y -= move;
  }
  if (keys["right"]) {
    cam.vel.x += move;
  }  
  if (keys["down"]) {
    cam.vel.y += move;
  }

  if (keys["x"]) {
    this.makeBlot();
  }
  
}

Test.prototype.frameReset = function () {
  cam.vel.init(0, 0);
}

Test.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = grid.projectX(cam.getCenter().x - w/2 - cam.pos.x);
  var y = grid.projectY(cam.getCenter().y - h/2 - cam.pos.y);
  context.strokeStyle = "red";
  context.strokeRect(x,y,w,h);
}

Test.prototype.makeBlot = function () {
  var w = 21;
  var h = 21;
  var x = cam.getCenter().x - w/2;
  var y = cam.getCenter().y - h/2;
  var rect = new Drawable(x, y, w, h, "yellow");
  rect.draw(context, cam);
}

Test.prototype.update = function () {
  this.frameReset();
  this.handleInput();
  cam.move();
  this.drawCrosshair();
}


function render() {
  requestAnimationFrame(render);
  if (map.ready == true) {
    grid = map.makeGrid(false, true);
    cam = new Camera(grid, new Vector(0, 0), cwidth, cheight, new Vector(0, 0));
    map.ready = false;
    imageHandler.addImage(repo.get(backgrounds[0]), context, 1/9);
    imageHandler.addImage(repo.get(backgrounds[1]), context, 1/6);
    imageHandler.addImage(map.getImage(0), context, map.getScale(0));
    imageHandler.addImage(map.getImage(1), context, map.getScale(1));
    colArray = map.getColArray();
    colHandler = new CollisionHandler(colArray, map.tileWidth, map.tileHeight);
    go = true;
    r1 = new Rectangle(0,0,60,60);
    r2 = new Rectangle(40,40,50,50);
    r3 = new Rectangle(61,61, 30,30);
    r4 = new Rectangle(70,70,40,40);
    colHandler.registerObject(r1);
    colHandler.registerObject(r2);
    colHandler.registerObject(r3);
    colHandler.registerObject(r4);
  }
  if (go == true) {
    imageHandler.drawImages(cam.pos.x, cam.pos.y, cam.width, cam.height);
    test.update();
  }
}

function initImages () {
  repo.loadArray(backgrounds);
}

var backgrounds = ["imgs/background2.png", "imgs/stars.png"];
var map = new Map("maps/rocks2.json");
var repo = new ImageRepo();
var cam;
var test = new Test();
var imageHandler = new ImageHandler();
var go = false;
var colHandler;
var colArray;

function init() {
  map.load();
  initImages();
  render();
}

window.onload = function() {
  init();
}
