function TileMap (tileCanvas, gids, tileWidth, tileHeight, opacity, scale) {
  this.tileCanvas = tileCanvas;
  this.gids = gids;
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.tileCanvas = tileCanvas;
  this.width = gids[0].length * tileWidth;
  this.height = gids.length * tileHeight;
  this.opacity = opacity;
  this.scale = scale;

  this.propMap = null;
};
TileMap.prototype = Object.create(Picture.prototype);

TileMap.prototype.destroy  = function (tile) {
  this.gids[tile.row][tile.col] = 0;
  this.propMap[tile.row][tile.col] = {};
};

TileMap.prototype.drawPart = function (xO, yO, xT, yT, w, h) {
  var gid, id, tx, ty;
  var tw = this.tileWidth;
  var th = this.tileHeight;

  this.context.globalAlpha = this.opacity;
  
  var firstRow = Math.floor(yO / this.tileHeight);
  var firstCol = Math.floor(xO / this.tileWidth);
  var rowOffset = Math.floor(yO - firstRow*this.tileWidth);
  var colOffset = Math.floor(xO - firstCol*this.tileWidth);
  var lastRow = Math.floor((yO + h-1) / this.tileHeight);
  var lastCol = Math.floor((xO + w-1) / this.tileWidth);
 
  var x = xT;
  var y = yT;

  var that = this;
  
  var f = function (co, ro) {
    id = gid & 0x0FFFFFFF;
    that.context.drawImage(that.tileCanvas, id*tw+co, 0+ro, tw-co, th-ro, 
                      x, y, tw-co, th-ro);
  };

  // Draw first part of first row
  gid = this.gids[firstRow][firstCol];
  if (gid !=0)
    f(colOffset, rowOffset);
  x += this.tileWidth - colOffset;

  for (var col = firstCol+1; col <= lastCol; col++) {
    gid = this.gids[firstRow][col];
    if (gid != 0) {
      f(0, rowOffset);
    }
    x += this.tileHeight;
  }
    
  x = xT;
  y += this.tileHeight - rowOffset;
  
  for (var r = firstRow+1; r <= lastRow; r++) {
    
    gid = this.gids[r][firstCol];
    if (gid != 0)
      f(colOffset, 0);
    x += this.tileWidth - colOffset;

    for (var c = firstCol+1; c <= lastCol; c++) {
      gid = this.gids[r][c];
      if (gid != 0) {
        f(0,0);
      }
      x += this.tileWidth;
    }
    y += this.tileHeight;
    x = xT;
  }

  this.context.globalAlpha = 1;
};
