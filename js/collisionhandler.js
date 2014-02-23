function CollisionHandler (colArray, tileWidth, tileHeight) {
  this.colArray = colArray;
  this.numRows = colArray.length;
  this.numCols = colArray[0].length;
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  
  this.buckets = [];

  this.tilesIntersected = function (rectangle) {
    var left = Math.floor(rectangle.x / this.tileWidth);
    var right = Math.floor((rectangle.x + rectangle.width) / this.tileWidth);
    var top = Math.floor(rectangle.y / this.tileHeight);
    var bottom = Math.floor((rectangle.y + rectangle.height) / this.tileHeight);
    
    var tiles = [];
    
    for (var row = top; row <= bottom; row++) {
      for (var col = left; col <= right; col++) {
	tiles.push({row: row, col: col})
      }
    }

    return tiles;
  }

  this.tilesCrossed = function(startRect, endRect) {
    return this.tilesIntersected(startRect.span(endRect));				 
  }

  this.clearBuckets = function () {
    this.buckets = [];
  }

  this.registerObject = function (object) {
    var tiles = this.tilesIntersected(object);
    for (var i = 0; i < tiles.length; i++) {
      if (this.buckets[tiles[i].row] === undefined)
	this.buckets[tiles[i].row] = [];
      if (this.buckets[tiles[i].row][tiles[i].col] === undefined)
	this.buckets[tiles[i].row][tiles[i].col] = [];
      this.buckets[tiles[i].row][tiles[i].col].push(object);
    }
  }

  this.collidingObjects = function (object) {
    var tiles = this.tilesIntersected(object);
    var objects = [];
    
    var row;
    var col;

    for (var i = 0; i < tiles.length; i++) {
      row = tiles[i].row;
      col = tiles[i].col;
      if (!(this.buckets[row] === undefined) && !(this.buckets[row][col] === undefined))
	for (var j = 0; j < this.buckets[row][col].length; j++) {
	  if (object.collides(this.buckets[row][col][j]))
	    objects.push(this.buckets[row][col][j]);
	}
    }
    
    return objects;
  };

}
