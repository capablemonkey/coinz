'use strict';

// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('canvas');

class Coin {
  constructor(row, column) {
    this.canvasObject = null;
    this.row = row;
    this.column = column;
  }

  draw() {
    this.canvasObject = new fabric.Circle({
      left: this.row * 50,
      top: this.column * 50,
      fill: 'red',
      radius: 20
    });

    canvas.add(this.canvasObject);
  }
}

var a = new Coin(1, 1);
var b = new Coin(1, 2);
var c = new Coin(1, 3);
a.draw();
b.draw();
c.draw();