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
  constructor(board, color, column, row) {
    this.board = board;
    this.color = color;
    this.column = column;
    this.row = row;
    this.canvasObject = null;
  }

  draw() {
    this.canvasObject = new fabric.Circle({
      left: this.column * 50,
      top: this.row * 50,
      fill: this.color,
      radius: 20,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
      lockRotation: true
    });

    canvas.add(this.canvasObject);

    this.canvasObject.on('mousedown', (options) => {
      this.board.clickCoin(this);
    })
  }

  remove() {
    if (_.isNull(this.canvasObject)) { return; }
    this.canvasObject.remove();
  }
}

class Board {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    // 2D array: coins[x][y]
    this.coins = Array(rows).fill(null).map(() => new Array(columns).fill(null)); 
  }

  initialize() {
    this._addRow();
    this._addRow();
    this._addRow();
    this._reDrawCoins();
  }

  // Main player action: drives change in the board.
  clickCoin(coin) {
    var coinChain = this._findCoinChain(coin, [], []);

    if (coinChain.length < 3) { return false; }

    coinChain.forEach( (c) => this.removeCoin(c) );

    console.dir(this.coins)

    this._gravity();
    this._reDrawCoins();
  }

  _randomColor() {
    return _.sample(_.values(COLORS));
  }

  // Use depth-first search to find the biggest chain of consecutive coins.
  _findCoinChain(coin, coinsVisitedSoFar, chain) {
    if (_.contains(coinsVisitedSoFar, coin)) { return null; }

    chain.push(coin);
    coinsVisitedSoFar.push(coin);

    var above = this._getCoinAt(coin.column - 1, coin.row);
    var below = this._getCoinAt(coin.column + 1, coin.row);
    var left = this._getCoinAt(coin.column, coin.row - 1);
    var right = this._getCoinAt(coin.column, coin.row + 1);

    if (this._sameColorCoins(coin, above)) { this._findCoinChain(above, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, below)) { this._findCoinChain(below, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, left)) { this._findCoinChain(left, coinsVisitedSoFar, chain); }
    if (this._sameColorCoins(coin, right)) { this._findCoinChain(right, coinsVisitedSoFar, chain); }

    return chain;
  }

  // Draw coins based on their position in the Board's state (this.coins)
  _reDrawCoins() {
    this.coins.forEach((coinColumn, x) => {
      coinColumn.forEach((coin, y) => {
        if (_.isNull(coin)) { return; }
        coin.column = x;
        coin.row = y;
        coin.remove();
        coin.draw();
      })
    });
  }

  // Make coins fall down when there are empty spaces (null elements) in in between coins in a column
  _gravity() {
    for (var x = 0; x < this.rows; x++) {
      var columnCondensed = this.coins[x].reverse().filter((element) => !_.isNull(element));
      // replace nulls:
      columnCondensed = columnCondensed.concat(Array(this.columns - columnCondensed.length).fill(null))
      this.coins[x] = columnCondensed.reverse();
    }
  }

  // Bounds-safe coin retrieval
  _getCoinAt(column, row) {
    if (row >= this.rows || row < 0 || column >= this.columns || column < 0) {
      return null;
    };
    return this.coins[column][row];
  }

  // Are coinA and coinB the same color?
  _sameColorCoins(coinA, coinB) {
    if (_.isNull(coinA) || _.isNull(coinB)) { return false; };
    return coinA.color === coinB.color;
  }

  // Warning: does not check to see if top coin is non null
  _addRow() {
    this.coins.forEach((column, x) => {
      column.shift();
      column.push(new Coin(this, this._randomColor(), x, 0));
    });
  }

  removeCoin(coin) {
    coin.remove();
    this.coins[coin.column][coin.row] = null;
  }
}

var board = new Board(8, 8);
board.initialize();