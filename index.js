'use strict';

const COLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow'
};

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

class Board {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.coins = Array(rows); // 2D array: coins[x][y]
  }

  initialize() {
    // TODO: consider using map here?
    for (var x = 0; x < this.rows; x++) {
      this.coins[x] = [];

      for (var y = 0; y < this.columns; y++) {
        var coin = new Coin(this._randomColor(), x, y);
        this.coins[x].push(coin);
        coin.draw();
      }
    }
  }

  _randomColor() {
    return _.sample(_.values(COLORS));
  }
}

var board = new Board(8, 8);
board.initialize();