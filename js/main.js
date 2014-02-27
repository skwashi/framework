function initImages (repo, imageHandler, backgrounds, context) {
  repo.loadArray(backgrounds);
  imageHandler.addImage(repo.get(backgrounds[0]), context, 1/9, 0);
  imageHandler.addImage(repo.get(backgrounds[1]), context, 1/6, 0);
}

var game = new Game();

function init() {
  var imageHandler = new ImageHandler();
  var repo = new ImageRepo();
  var backgrounds = ["imgs/background2.png", "imgs/stars.png"];
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var mCanvas = document.getElementById("messages");
  var mContext = mCanvas.getContext("2d");
  var messageLayer = new MessageLayer();
  messageLayer.init(mContext, "30px Verdana");

  initImages(repo, imageHandler, backgrounds, context);
  game.init(context, imageHandler, messageLayer, repo, false, false);
  game.loadMap("maps/rocks2.json");
  
  render();
}

function render() {
  requestAnimationFrame(render);
  // draw starry backgrounds
  game.imageHandler.drawLayer(0, game.cam.pos.x, game.cam.pos.y, game.cam.width, game.cam.height);
  // draw map background
  game.imageHandler.drawLayer(1, game.cam.pos.x, game.cam.pos.y, game.cam.width, game.cam.height);
  // update and draw objects
  game.update();
  // draw map top layer
  game.imageHandler.drawLayer(2, game.cam.pos.x, game.cam.pos.y, game.cam.width, game.cam.height);
  // show messages
  game.messageLayer.render();
}

/**
 * requestAnimationFrame shim by Paul Irish
 */
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000/60);
    };
})();

window.onload = function() {
  init();
};
