function CollisionHandler (grid, colArray, tileWidth, tileHeight) {
  this.grid = grid;
  this.colArray = colArray;
  this.numRows = colArray.length;
  this.numCols = colArray[0].length;
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  
  this.buckets = [];

  this.clearBuckets = function () {
    this.buckets = [];
  };

}


CollisionHandler.prototype.collidesWithTile = function (rectangle) {
  var tiles = this.grid.tilesIntersected(rectangle);
  return _.some(tiles, function (tile) {
    var mt = this.grid.mapTile(tile);
    return (this.colArray[mt.row][mt.col] == 1);
  }, this);

};

CollisionHandler.prototype.onGround = function (rectangle) {
  return this.collidesWithTile({x: rectangle.x, y: rectangle.y + rectangle.height, width: rectangle.width, height: 2});
};


CollisionHandler.prototype.registerObject = function (object) {
  var tiles = this.grid.tilesIntersected(object);
  for (var i = 0; i < tiles.length; i++) {
    if (this.buckets[tiles[i].row] === undefined)
      this.buckets[tiles[i].row] = [];
    if (this.buckets[tiles[i].row][tiles[i].col] === undefined)
      this.buckets[tiles[i].row][tiles[i].col] = [];
    this.buckets[tiles[i].row][tiles[i].col].push(object);
  }
};

CollisionHandler.prototype.collidingObjects = function (object) {
  var tiles = this.grid.tilesIntersected(object);
  var objects = [];
  
  var row;
  var col;

  for (var i = 0; i < tiles.length; i++) {
    row = tiles[i].row;
    col = tiles[i].col;
    if (!(this.buckets[row] === undefined) && 
        !(this.buckets[row][col] === undefined))
      for (var j = 0; j < this.buckets[row][col].length; j++) {
	if (object.collides(this.buckets[row][col][j]))
	  objects.push(this.buckets[row][col][j]);
      }
  }
  
  return objects;
};
