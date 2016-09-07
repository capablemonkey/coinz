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

  _findAdjacentCoins(coin, coinsSoFar) {
    var adjacentCoins = [];

    var above = this._getCoinAt(coin.row, coin.column - 1);
    var below = this._getCoinAt(coin.row, coin.column + 1);
    var left = this._getCoinAt(coin.row - 1, coin.column);
    var right = this._getCoinAt(coin.row + 1, coin.column);

    if (this._sameColorCoins(coin, above)) { adjacentCoins.push(above); }
    if (this._sameColorCoins(coin, below)) { adjacentCoins.push(below); }
    if (this._sameColorCoins(coin, left)) { adjacentCoins.push(left); }
    if (this._sameColorCoins(coin, right)) { adjacentCoins.push(right); }

    return adjacentCoins;
  }

  _getCoinAt(row, column) {
    if (row >= this.rows || row < 0 || column >= this.columns || column < 0) {
      return null;
    };
    return this.coins[row][column];
  }

  _sameColorCoins(coinA, coinB) {
    if (_.isNull(coinA) || _.isNull(coinB)) { return false; };
    return coinA.color === coinB.color;
  }
}

var board = new Board(8, 8);
board.initialize();