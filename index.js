'use strict';

// TODO: wrap this in a IIFE

const COLORS = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'gold'
};

const COIN_PIXEL_OFFSET = 50;

const STAGE = new createjs.Stage('canvas');
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", STAGE);

class Coin {
  constructor(board, color, column, row) {
    // TODO: maybe board should be global instead of referring to it over and over again.
    this.board = board;
    this.color = color;
    this.column = column;
    this.row = row;
    this.canvasObject = null;
  }

  draw() {
    let circle = new createjs.Shape();

    circle.
      graphics.
      beginFill(this.color).
      drawCircle(25, 25, 20);

    circle.x = this.column * COIN_PIXEL_OFFSET;
    circle.y = this.row * COIN_PIXEL_OFFSET;

    STAGE.addChild(circle);

    circle.addEventListener('mousedown', (event) => {
      this.board.clickCoin(this);
    })

    this.canvasObject = circle;

    // TODO: update the stage only once all the new coin positions are realized.
    STAGE.update();
  }

  move(column, row) {
    this.column = column;
    this.row = row;

    createjs.Tween.get(this.canvasObject)
      .to({ x: column * COIN_PIXEL_OFFSET, y: row * COIN_PIXEL_OFFSET }, 100);
  }

  remove() {
    if (_.isNull(this.canvasObject)) { return; }
    STAGE.removeChild(this.canvasObject);
  }
}

class Board {
  constructor(columns, rows) {
    this.rows = rows;
    this.columns = columns;
    this.turn = 0;
    this.score = 0;

    // 2D array: coins[x][y]
    this.coins = Array(columns).fill(null).map(() => new Array(rows).fill(null));
  }

  initialize(rowsToCreate) {
    _(rowsToCreate).times( () => this._addRow() )
    this._drawCoins();
    this._updateScore();
  }

  // Main player action: drives change in the board.
  clickCoin(coin) {
    let coinChain = this._findCoinChain(coin, [], []);
    if (coinChain.length < 3) { return false; }

    // Remove coins:
    coinChain.forEach( (c) => this.removeCoin(c) );
    this._gravity();

    this.score += coinChain.length * 10
    this._updateScore();

    this.turn++;
    if (this.turn % 3 == 0) { 
      if (this._anyRowAtPeak()) {
        alert('GAME OVER');
      } else {
        this._addRow();
      }
    }

    this._moveCoins();
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

  // Move coins based on their position in the Board's state (this.coins)
  _moveCoins() {
    this.coins.forEach((coinColumn, x) => {
      coinColumn.forEach((coin, y) => {
        // nothing to do if this cell is null or coin has no new position:
        if (_.isNull(coin)) { return; }
        // if (_.isNull(coin.canvasObject)) { return coin.draw(); }
        if (coin.column == x && coin.row == y) { return; }
        coin.move(x, y);
      })
    });
  }

  _drawCoins() {
    this.coins.forEach((coinColumn, x) => {
      coinColumn.forEach((coin, y) => {
        // nothing to do if this cell is null or coin has no new position:
        if (_.isNull(coin)) { return; }
        coin.column = x;
        coin.row = y;
        coin.draw();
      })
    });
  }

  // Make coins fall down when there are empty spaces (null elements) in in between coins in a column
  _gravity() {
    for (let x = 0; x < this.columns; x++) {
      let columnCondensed = this.coins[x].reverse().filter((element) => !_.isNull(element));
      // replace nulls:
      columnCondensed = columnCondensed.concat(Array(this.columns - columnCondensed.length + 1).fill(null))
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
  // Add new row from bottom
  _addRow() {
    this.coins.forEach((column, x) => {
      column.shift();
      let newCoin = new Coin(this, this._randomColor(), x, (this.rows + 1) * COIN_PIXEL_OFFSET);
      column.push(newCoin);
      newCoin.draw();
    });
  }

  _anyRowAtPeak() {
    return this.coins.some((column) => column.filter((element) => !_.isNull(element)).length == this.rows);
  }

  _updateScore() {
    document.getElementById('score').innerHTML = this.score;
  }

  removeCoin(coin) {
    coin.remove();
    this.coins[coin.column][coin.row] = null;
  }
}

function init() {
  let board = new Board(14, 15);
  board.initialize(5);
}

