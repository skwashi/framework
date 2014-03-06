function ImageRepo () {
  this.repo = {};
  
  this.load = function (filename) {
    if (this.repo[filename] === undefined) {
      var image = new Image();
      image.src = filename;
      this.repo[filename] = image;
    }
    return this.repo[filename];
  };

  this.loadArray = function (array) {
    for (var i = 0; i < array.length; i++)
      this.load(array[i]);
  };
  
  this.get = function (filename) {
    if (this.repo[filename] === undefined)
      return this.load(filename);
    else
      return this.repo[filename];
  };
  
  this.getArray = function (array) {
    return _.map(array, this.get);
  };

}


function Picture (image, context, scale) {
  this.image = image;
  this.context = context;
  this.scale = scale;
  this.width = image.width;
  this.height = image.height;
}

Picture.prototype.drawPart = function (xO, yO, xT, yT, w, h) {
  this.context.drawImage(this.image, xO, yO, w, h, xT, yT, w, h);
};

Picture.prototype.draw = function (xO, yO, width, height) {
  var image = this.image || this;
  var scale = this.scale;
  var bottom = image.height;
  var right = image.width;

  var x = Math.round((xO < 0) ? 
	((scale*xO) % right) + right : (scale*xO) % right);
  var y = Math.round((yO < 0) ? 
	((scale*yO) % bottom) + bottom : (scale*yO) % bottom);
  
  if (x == right)
    x = 0;
  if (y == bottom)
    y = 0;

  /*
  if (this.oldx != undefined && x == this.oldx && y == this.oldy) {
    this.oldx = x;
    this.oldy = y;
    return;
  }
  
  this.oldx = x;
  this.oldy = y;
   */
  
  if (y + height > bottom) {
    if (x + width > right) {
      this.drawPart(x, y, 
                    0, 0, 
                    right-x, bottom-y);
      this.drawPart(0, y, 
                    right-x, 0, 
                    width - (right-x), bottom-y);
      this.drawPart(x, 0,
                    0, bottom-y,
                    right-x, height - (bottom-y));
      this.drawPart(0, 0,
                    right-x, bottom-y,
                    width - (right-x), height - (bottom - y));
    } else {
      this.drawPart(x, y,
                    0, 0,
                    width, bottom-y);
      this.drawPart(x, 0,
                    0, bottom-y,
                    width, height - (bottom-y));
    }
  } else if (x + width > right) {
    this.drawPart(x, y,
                  0, 0,
                  right-x, height);
    this.drawPart(0, y,
                  right-x, 0,
                  width - (right-x), height);
  } else {
    this.drawPart(x, y,
                  0, 0,
                  width, height);
  }

};

function PictureLayer (layer, context, scale, map) {
  this.image = layer;
  this.context = context;
  this.scale = scale;
  this.map = map;
  this.width = this.image.width;
  this.height = this.image.height;
}
PictureLayer.prototype = Object.create(Picture.prototype);

PictureLayer.prototype.drawPart = function (xO, yO, xT, yT, w, h) {
  this.map.drawLayer(this.context, this.image, xO, yO, xT, yT, w, h);
};

function ImageHandler () {
  this.images = [];

  this.addImage = function (image, context, scale, level) {
    var pic = new Picture(image, context, scale);
    if (! (level === undefined))
      pic.level = level;
    this.images.push(pic);
  };

  this.addPictureLayer = function (layer, context, scale, map, level) {
    var pl = new PictureLayer(layer, context, scale, map);
    if (! (level === undefined))
      pl.level = level;
    this.images.push(pl);
  };

  this.addTileMap = function (tileMap, level) {
    if (! (level === undefined))
      tileMap.level = level;
    this.images.push(tileMap);
  };
  
  this.addImages = function(images, context, scale, level) {
    for (var i = 0; i < images.length; i++)
      this.addImage(images[i], context, scale, level);
  };

  this.addPicture = function(picture) {
    this.images.push(picture);
  };

  this.addPictures = function(pictures) {
    this.images = this.images.concat(pictures);
  };
  
}

ImageHandler.prototype.drawImage = function(picture, xOrigin, yOrigin, width, height) {
  picture.draw(xOrigin, yOrigin, width, height);
};

ImageHandler.prototype.drawImages = function (xOrigin, yOrigin, width, height) {
  for (var i = 0, len = this.images.length; i < len; i++)
    this.drawImage(this.images[i], xOrigin, yOrigin, width, height);
};

ImageHandler.prototype.drawLevel = function (level, xOrigin, yOrigin, width, height) {
  for (var i = 0, len = this.images.length; i < len; i++)
    if (this.images[i].level == level)
      this.drawImage(this.images[i], xOrigin, yOrigin, width, height);
};

function drawRotatedImage(context, image, x, y, angle) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.drawImage(image, -image.width/2, -image.height/2);
  context.restore();
}
