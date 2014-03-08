function Path (vectors, type, repeats) {
  this.vectors = vectors;
  this.length = vectors.length;
  this.next = 0;
  this.type = type || "once";
  this.repeats = repeats || null;
  this.dir = 1;
};

Path.prototype.remaining = function () {
  return this.length - this.next;
};

Path.prototype.getNext = function () {
  var vector;

  switch(this.type)
  {
  case "cycle":
    if (this.next >= this.length)
      this.next = 0;
    vector = this.vectors[this.next];
    this.next++;
    break;
  case "reverse":
    if (this.dir == 1 && this.next >= this.length) {
      this.dir = -1;
      this.next = this.length - 1;
    } else if (this.dir == -1 && this.next <= 0) {
      this.dir = 1;
      this.next = 0;
    }
    vector = this.vectors[this.next];
    this.next += this.dir;
    break;
  case "default": // once
    if (this.next >= this.length) {
      vector = null;
    } else {
      vector = this.vectors[this.next];
      this.next++;
    }
  }
  return vector;
};
