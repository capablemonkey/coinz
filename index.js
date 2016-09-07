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
  constructor(board, color, row, column) {
    this.board = board;
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

    this.canvasObject.on('mousedown', (options) => {
      this.board.clickCoin(this);
    })
  }

  remove() {
    this.canvasObject.remove();
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
        var coin = new Coin(this, this._randomColor(), x, y);
        this.coins[x].push(coin);
        coin.draw();
      }
    }
  }

  clickCoin(coin) {
    console.log(coin);
    var adjacentCoins = this._findAdjacentCoins(coin);

    coin.remove();
    adjacentCoins.forEach( (c) => c.remove() );
  }

  _randomColor() {
    return _.sample(_.values(COLORS));
  }

  _findAdjacentCoins(coin) {
    var adjacentCoins = [];

    if ((coin.row + 1 < this.rows) && this.coins[coin.row + 1][coin.column].color === coin.color) {
      adjacentCoins.push(this.coins[coin.row + 1][coin.column]);
    }

    if ((coin.row - 1 >= 0) && this.coins[coin.row - 1][coin.column].color === coin.color) {
      adjacentCoins.push(this.coins[coin.row - 1][coin.column]);
    }

    if ((coin.column + 1 < this.columns) && this.coins[coin.row][coin.column + 1].color === coin.color) {
      adjacentCoins.push(this.coins[coin.row][coin.column + 1]);
    }

    if ((coin.column - 1 >= 0) && this.coins[coin.row][coin.column - 1].color === coin.color) {
      adjacentCoins.push(this.coins[coin.row][coin.column - 1]);
    }

    return adjacentCoins;
  }
}

var board = new Board(8, 8);
board.initialize();