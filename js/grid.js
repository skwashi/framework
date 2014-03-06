// coordinate system in which objects move
function Grid (width, height, tileWidth, tileHeight, openX, openY) {
  this.init = function (width, height, tileWidth, tileHeight, openX, openY) {
    this.width = width;
    this.height = height;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.numRows = Math.floor(height / tileHeight);
    this.numCols = Math.floor(width / tileWidth);
    this.openX = openX;
    this.openY = openY;
  };
  
  this.init(width, height, tileWidth, tileHeight, openX, openY);

}

Grid.prototype.projectX = function (x) {
  var gx = (x < 0) ? (x % this.width) + this.width : x % this.width;
  return (gx == this.width) ? 0 : gx;
};

Grid.prototype.projectY = function (y) {
  var gy = (y < 0) ? (y % this.height) + this.height : y % this.height;
  return (gy == this.height) ? 0 : gy;
};

Grid.prototype.project = function (x, y) {
  return {x: this.projectX(x), y: this.projectY(y)};
};

Grid.prototype.projectRectangle = function (rectangle) {
  var x = rectangle.x;
  var y = rectangle.y;
  var width = rectangle.width;
  var height = rectangle.height;

  return new Rectangle(this.projectX(rectangle.x), this.projectY(rectangle.y), rectangle.width, rectangle.height);
};

Grid.prototype.isInside = function (rectangle) {
  return rectangle.x >= 0 && rectangle.x + rectangle.width <= this.width &&
    rectangle.y >= 0 && rectangle.y + rectangle.height <= this.height;
};

Grid.prototype.tilesIntersected = function (rectangle) {
  var left = Math.floor(rectangle.x / this.tileWidth);
  var right = Math.floor((rectangle.x + rectangle.width-1) / this.tileWidth);
  var top = Math.floor(rectangle.y / this.tileHeight);
  var bottom = Math.floor((rectangle.y + rectangle.height-1) / this.tileHeight);
  
  var tiles = [];
  
  for (var row = top; row <= bottom; row++) {
    for (var col = left; col <= right; col++) {
      tiles.push({row: row, col: col});
    }
  }

  return tiles;
};

Grid.prototype.tilesCrossed = function(startRect, endRect) {
  return this.tilesIntersected(startRect.span(endRect));				 
};

Grid.prototype.tileCoords = function (x, y) {
  return {row: Math.floor(y / this.tileHeight), 
	  col: Math.floor(x / this.tileWidth)};
};

Grid.prototype.nextTileBorder = function (rectangle, direction) {
  switch(direction) 
  {
  case "left": 
    return Math.floor(rectangle.x / this.tileWidth) * this.tileWidth;
  case "right":
    return (Math.floor((rectangle.x + rectangle.width - 1) / this.tileWidth) + 1)*this.tileWidth;
  case "up":
    return Math.floor(rectangle.y / this.tileHeight) * this.tileHeight;
  case "down":
    return (Math.floor((rectangle.y + rectangle.height - 1) / this.tileHeight) + 1)*this.tileHeight;
  default:
    return 0;
  }
};

Grid.prototype.mapTile = function (tile) {
  var row = tile.row;
  var col = tile.col;

  if (row < 0 || row >= this.numRows) {
    row = (row < 0) ? (row % this.numRows) + this.numRows : row % this.numRows;
    row = (row == this.numRows) ? 0 : row;
  }
  if (col < 0 || col >= this.numCols) {
    col = (col < 0) ? (col% this.numCols) + this.numCols : col % this.numCols;
    col = (col == this.numCols) ? 0 : col;
  }

  return {row: row, col: col};
};
