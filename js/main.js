var game = new Game();

function init() {
  var backgrounds = ["imgs/background2.png", "imgs/stars.png"];
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var mCanvas = document.getElementById("messages");
  var mContext = mCanvas.getContext("2d");
  var openX = true;
  var openY = true;

  game.init(context, true, true);
  game.messageHandler.init(mContext, "30px Verdana");
  game.initBackgrounds(backgrounds);

  //game.loadMap("maps/rocks2.json");
  game.loadMap("maps/platforms.json");
  //game.loadMap("maps/world.json");

  setTimeout(render, 2000);
}

function render() {
  requestAnimationFrame(render);
  game.update();
  game.draw();
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
