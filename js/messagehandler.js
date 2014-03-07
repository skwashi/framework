function MessageHandler() {
  this.init = function (context, font) {
    this.context = context;
    this.width = context.canvas.width;
    this.height = context.canvas.height;

    this.context.font = font;
    this.fillStyle = "blue";

    this.showing = false;
    this.showingGO = false;
    this.showingNL = false;
    this.showingRS = false;
    this.changed = false;
    this.message = null;
    this.timeRemaining = false;
  };

  this.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
    this.showing = false;
    this.showingGO = false;
    this.showingNL = false;
    this.showingRS = false;
    this.message = null;
    this.changed = false;
  };

  this.setMessage = function (message, time) {
    this.message = message;
    this.timeRemaining = time;
    this.changed = true;    
  };

  this.render = function (dt) {
    if (this.changed && this.message != null) {
      this.showMessage(this.message);
    }
    if (this.timeRemaining) {
      if (this.timeRemaining <= 0) {
        this.clear();
        this.timeRemaining = false;
      } else if (this.timeRemaining > 0) {
        this.timeRemaining -= dt;
      }     
    }
  };

  this.showMessage = function (message) {
    console.log("Drawing Message!");
    this.clear();
    this.context.textAlign="center";
    this.context.fillStyle=this.fillStyle;
    this.context.fillText(message, this.width/2, this.height/3);
    this.showing = true;
    this.changed = false;
  };

  this.gameOver = function () {
    if (!this.showingGO) {
      console.log("Drawing message!");
      this.clear();
      this.context.fillStyle="red";
      this.context.textAlign="center";
      this.context.fillText("Game Over!", this.width/2, this.height/2);
      this.context.fillText("Press space to restart level!", this.width/2, this.height/2 + 80);
      this.showing = true;
      this.showingGO = true;
      this.changed = false;
    }
  };

  this.respawn = function () {
    if (!this.showingRS) {
      console.log("Drawing message!");
      this.clear();
      this.context.fillStyle="red";
      this.context.textAlign="center";
      this.context.fillText("You died!", this.width/2, this.height/2);
      this.context.fillText("Press space to respawn!", this.width/2, this.height/2 + 80);
      this.showing = true;
      this.showingRS = true;
      this.changed = false;
    }
  };
  
  this.nextLevel = function () {
    if (!this.showingNL) {
      this.clear();
      this.context.fillStyle=this.fillStyle;
      this.context.textAlign="center";
      this.context.fillText("Level completed.", this.width/2, this.height/2);  
      this.context.fillText("Press space to continue!", this.width/2, this.height/2 + 80);
      this.showingNL = true;
      this.showing = true;
      this.changed = false;
    }
  };

}
