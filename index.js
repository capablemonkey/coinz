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
    var coinChain = this._findCoinChain(coin, [], []);

    if (coinChain.length < 3) { return false; }

    console.log(coinChain)
    coinChain.forEach( (c) => c.remove() );
  }

  _randomColor() {
    return _.sample(_.values(COLORS));
  }

  // Use depth-first search to find the biggest chain of consecutive coins.
  _findCoinChain(coin, coinsVisitedSoFar, chain) {
    if (_.contains(coinsVisitedSoFar, coin)) { return null; }

    chain.push(coin);
    coinsVisitedSoFar.push(coin);

    var above = this._getCoinAt(coin.row, coin.column - 1);
    var below = this._getCoinAt(coin.row, coin.column + 1);
    var left = this._getCoinAt(coin.row - 1, coin.column);
    var right = this._getCoinAt(coin.row + 1, coin.column);

    if (this._sameColorCoins(coin, above)) { this._findCoinChain(above, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, below)) { this._findCoinChain(below, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, left)) { this._findCoinChain(left, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, right)) { this._findCoinChain(right, coinsVisitedSoFar, chain); }

    return chain;
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