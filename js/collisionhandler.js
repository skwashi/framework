function CollisionHandler () {
  this.init = function (grid, propMap, tileWidth, tileHeight) {
    this.grid = grid;
    this.propMap = propMap;
    this.numRows = propMap.length;
    this.numCols = propMap[0].length;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  };
   
  this.buckets = {solids: [], enemies: [], projectiles: []};

  this.clearBuckets = function (type) {
    if (type === undefined)
      this.buckets = {solids: [], enemies: [], projectiles: []};
    else
      this.buckets[type] = [];
  };

}

CollisionHandler.prototype.inSolid = function (rectangle) {
  var tiles = this.grid.tilesIntersected(rectangle);
  return _.some(tiles, function (tile) {
    var mt = this.grid.mapTile(tile);
    return (this.propMap[mt.row][mt.col].solid != undefined);
  }, this);

};

CollisionHandler.prototype.onGround = function (rectangle) {
  return this.inSolid({x: rectangle.x, y: rectangle.y + rectangle.height, width: rectangle.width, height: 2});
};


CollisionHandler.prototype.registerObject = function (type, object) {
  var tiles = this.grid.tilesIntersected(object);
  for (var i = 0; i < tiles.length; i++) {
    if (this.buckets[type][tiles[i].row] === undefined)
      this.buckets[type][tiles[i].row] = [];
    if (this.buckets[type][tiles[i].row][tiles[i].col] === undefined)
      this.buckets[type][tiles[i].row][tiles[i].col] = [];
    this.buckets[type][tiles[i].row][tiles[i].col].push(object);
  }
};

CollisionHandler.prototype.collidingObjects = function (type, object) {

  var tiles = this.grid.tilesIntersected(object);
  var objects = [];
  
  var row;
  var col;

  for (var i = 0; i < tiles.length; i++) {
    row = tiles[i].row;
    col = tiles[i].col;
    if (!(this.buckets[type][row] === undefined) && 
        !(this.buckets[type][row][col] === undefined))
      for (var j = 0; j < this.buckets[type][row][col].length; j++) {
	if (object.collides(this.buckets[type][row][col][j]))
	  objects.push(this.buckets[type][row][col][j]);
      }
  }
  
  return objects;
};
