function initBackgrounds (repo, imageHandler, backgrounds, context) {
  repo.loadArray(backgrounds);
  imageHandler.addImage(repo.get(backgrounds[0]), context, 1/9, -1);
  imageHandler.addImage(repo.get(backgrounds[1]), context, 1/6, -1);
}

var game = new Game();


function init() {
  var imageHandler = new ImageHandler();
  var repo = new ImageRepo();
  var backgrounds = ["imgs/background2.png", "imgs/stars.png"];
 // var bgCanvas = document.getElementById("background");
 // var bgContext = bgCanvas.getContext("2d");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

//  var overCanvas = document.getElementById("over");
//  var overContext = overCanvas.getContext("2d"); 
  var mCanvas = document.getElementById("messages");
  var mContext = mCanvas.getContext("2d");
  var messageHandler = new MessageHandler();
  messageHandler.init(mContext, "30px Verdana");
  
  initBackgrounds(repo, imageHandler, backgrounds, context);
  game.init(context, imageHandler, messageHandler, repo, true, true);
  
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
