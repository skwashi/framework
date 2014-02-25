function Test () {
  this.init = function () {
  };
}

Test.prototype.handleInput = function () {
  var move = 5;
  var dir = new Vector(0,0);


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

  if (keys["a"]) {
    dir.x -= 1;
  }
  if (keys["w"]) {
    dir.y -= 1;
  }
  if (keys["s"]) {
    dir.y += 1;
  }  
  if (keys["d"]) {
    dir.x += 1;
  }
  
  if (keys["x"]) {
    var vector = new Vector(grid.projectX(player.x), grid.projectY(player.y));
    console.log(colHandler.collidesWithTile(player));
  }
  
  player.move(1, dir, colHandler);
};

Test.prototype.frameReset = function () {
  cam.vel.init(0, 0);
};

Test.prototype.drawCrosshair = function () {
  var w = 21;
  var h = 21;
  var x = grid.projectX(cam.getCenter().x - w/2 - cam.pos.x);
  var y = grid.projectY(cam.getCenter().y - h/2 - cam.pos.y);
  context.strokeStyle = "red";
  context.strokeRect(x,y,w,h);
};

Test.prototype.makeBlot = function () {
  var w = 21;
  var h = 21;
  var x = cam.getCenter().x - w/2;
  var y = cam.getCenter().y - h/2;
  var rect = new Drawable(x, y, w, h, "yellow");
  rect.draw(context, cam);
};

Test.prototype.update = function () {
  this.frameReset();
  this.handleInput();
  cam.move();
  if (cam.canSee(player))
    player.draw(context, cam);
  this.drawCrosshair();
};


function setup() {
  grid = map.makeGrid(false, true);
  cam = new Camera(grid, new Vector(0, grid.height - cheight), cwidth, cheight, new Vector(0, 0));
  player = new Player(grid, cam.pos.x + cam.width/2 - 10, cam.pos.y + cam.height - 40, 20, 40, "blue", new Vector(0, 0), new Vector(1,1), 0.1);
  map.ready = false;
  imageHandler.addImage(repo.get(backgrounds[0]), context, 1/9, 0);
  imageHandler.addImage(repo.get(backgrounds[1]), context, 1/6, 0);
  imageHandler.addImage(map.getImage(0), context, map.getScale(0), 1);
  imageHandler.addImage(map.getImage(1), context, map.getScale(1), 2);
  imageHandler.addImage(map.getImage(2), context, map.getScale(2), 1);
  colArray = map.getColArray();
  colHandler = new CollisionHandler(grid, colArray, map.tileWidth, map.tileHeight);
  r1 = new Rectangle(0,0,60,60);
  r2 = new Rectangle(40,40,50,50);
  r3 = new Rectangle(61,61, 30,30);
  r4 = new Rectangle(70,70,40,40);
  colHandler.registerObject(r1);
  colHandler.registerObject(r2);
  colHandler.registerObject(r3);
  colHandler.registerObject(r4);
}

function render() {
  requestAnimationFrame(render);
  if (map.ready == true) {
    setup();
    go = true;
  }
  if (go == true) {
    imageHandler.drawLayer(0, cam.pos.x, cam.pos.y, cam.width, cam.height);
    imageHandler.drawLayer(1, cam.pos.x, cam.pos.y, cam.width, cam.height);
    test.update();
    imageHandler.drawLayer(2, cam.pos.x, cam.pos.y, cam.width, cam.height);
  }
}

function initImages () {
  repo.loadArray(backgrounds);
}

var bgCanvas = document.getElementById("canvas");
var bgContext = bgCanvas.getContext("2d");
var backgrounds = ["imgs/background2.png", "imgs/stars.png"];
var map = new Map("maps/rocks2.json");
var repo = new ImageRepo();
var cam;
var test = new Test();
var imageHandler = new ImageHandler();
var go = false;
var colHandler;
var colArray;
var player;


function init() {
  map.load();
  initImages();
  render();
}

window.onload = function() {
  init();
};
