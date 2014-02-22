function ImageRepo () {
  this.repo = {};
  
  this.load = function (filename) {
    var image = new Image();
    image.src = filename;
    this.repo[filename] = image;
  }

  this.loadArray = function (array) {
    for (var i = 0; i < array.length; i++)
      this.load(array[i]);
  }

  this.get = function (filename) {
      return this.repo[filename];
  }
  
  this.getArray = function (array) {
    var images = [];
    for (var i = 0; i < array.length; i++)
      images.push(this.get(array[i]));
    return images;
  }

}


function Picture (image, context, scale) {
  this.image = image;
  this.context = context;
  this.scale = scale;
}


function ImageHandler () {
  this.images = [];

  this.addImage = function (image, context, scale) {
    this.images.push(new Picture(image, context, scale));
  };

  this.addImages = function(images, context, scale) {
    for (var i = 0; i < images.length; i++)
      this.addImage(images[i], context, scale);
  }

  this.addPicture = function(picture) {
    this.images.push(picture);
  }

  this.addPictures = function(pictures) {
    this.images = this.images.concat(pictures);
  }

  this.drawImage = function(picture, xOrigin, yOrigin, width, height) {
    var image = picture.image;
    var context = picture.context;
    var scale = picture.scale;
    var bottom = image.height;
    var right = image.width;

    var x = (xOrigin < 0) ? 
	  ((scale*xOrigin) % right) + right : (scale*xOrigin) % right;
    var y = (yOrigin < 0) ? 
	  ((scale*yOrigin) % bottom) + bottom : (scale*yOrigin) % bottom;
    
    if (x == right)
      x = 0;
    if (y == bottom)
      y = 0;

    if (y + height > bottom) {
      if (x + width > right) {
	context.drawImage(image, 
			  x, y, right - x, bottom - y, 
			  0, 0, right - x, bottom - y);
	context.drawImage(image, 
			  0, y, width - (right - x), bottom - y, 
			  right - x, 0, width - (right - x), bottom - y);
	context.drawImage(image, 
			  x, 0, right - x, width - (bottom-y), 
			  0, bottom-y, right - x, width - (bottom-y));
	context.drawImage(image,
			  0, 0, width - (right - x), width - (bottom-y),
			  right-x, bottom-y, width-(right-x), width-(bottom-y));
      } else {
	context.drawImage(image, 
			  x, y, width, bottom - y, 
			  0, 0, width, bottom-y);
	context.drawImage(image, 
			  x, 0, width, height - (bottom-y), 
			  0, bottom-y, width, height - (bottom-y));
      }
    } else if (x + width > right) {

      context.drawImage(image, 
			x, y, right - x, height, 
			0, 0, right - x, height);
      context.drawImage(image, 
			0, y, width - (right - x), height, 
			right - x, 0, width - (right - x), height);
    } else {
      context.drawImage(image, 
			x, y, width, height, 
			0, 0, width, height);
    }
  }

  this.drawImages = function (xOrigin, yOrigin, width, height) {
    for (var i = 0, len = this.images.length; i < len; i++)
      this.drawImage(this.images[i], xOrigin, yOrigin, width, height);
  };
  
}


