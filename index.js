'use strict';

const COLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow'
}

// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('canvas');

class Coin {
  constructor(color, row, column) {
    this.color = color;
    this.row = row;
    this.column = column;
    this.canvasObject = null;
  }

  draw() {
    this.canvasObject = new fabric.Circle({
      left: this.row * 50,
      top: this.column * 50,
      fill: this.color,
      radius: 20
    });

    canvas.add(this.canvasObject);
  }
}

var a = new Coin(COLORS.RED, 1, 1);
var b = new Coin(COLORS.BLUE, 1, 2);
var c = new Coin(COLORS.GREEN, 1, 3);

var circles = [a, b, c]
circles.forEach((c) => c.draw())