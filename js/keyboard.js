KEY_CODES = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  32: "space",
  49: "1",
  50: "2",
  65: "a",
  68: "d",
  69: "e",
  70: "f",
  81: "q",
  82: "r",
  83: "s",
  87: "w",
  88: "x",
  90: "z" 
};

var keys = {};
for (var code in KEY_CODES) {
  keys[KEY_CODES[code]] = false;
}

document.onkeydown = function(e) {
  var keyCode = e.keyCode || e.charKode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    keys[KEY_CODES[keyCode]] = true;
  }
};

document.onkeyup = function(e) {
  var keyCode = e.keyCode || e.charKode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    keys[KEY_CODES[keyCode]] = false;
  }
};
