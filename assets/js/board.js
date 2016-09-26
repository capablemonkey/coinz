const CONSTANTS = require('./constants.js');
const Coin = require('./coin.js');
const Star = require('./star.js');

class Board {
  constructor(columns, rows, level) {
    this.rows = rows;
    this.columns = columns;
    this.coinColors = _.values(CONSTANTS.COLORS).slice(0, CONSTANTS.LEVEL_COIN_COLORS[level]);

    // 2D array: coins[x][y]
    this.coins = Array(columns).fill(null).map(() => new Array(rows).fill(null));
  }

  initialize(rowsToCreate) {
    const topBoundary = new createjs.Shape();
    topBoundary
      .graphics
      .beginFill('black')
      .drawRect(0, 50, 700, 3);
    window.stage.addChild(topBoundary);

    _(rowsToCreate).times(() => this._addRow());
    this._moveCoins();

    if (window.game.mode === CONSTANTS.MODES.SPEED) {
      // TODO... move this to Game.
      setInterval(() => {
        this._loseOrAddRow();
        this._moveCoins();
      }, 3000);
    }
  }

  _calculateScore(numberOfCoins) {
    return Math.pow(numberOfCoins, 2) - numberOfCoins * 5 + 15;
  }

  toggleHighlightCoinGroup(coin) {
    let coinChain = this._findCoinChain(coin, [], []);

    if (coinChain.length < 3) {
      return;
    }

    coinChain.forEach(c => c.toggleHighlight());
    window.stage.update();
  }

  // Main player action: drives change in the board.
  clickCoin(coin) {
    let coinChain = this._findCoinChain(coin, [], []);
    if (coinChain.length < 3) {
      return false;
    }

    // Pop any stars above:
    let starsCount = coinChain
      .map(c => this._popStarAbove(c))
      .reduce((count, star) => count + (star === true ? 1 : 0));

    let levelIsFinished = window.game.collectStars(starsCount);
    if (levelIsFinished) {
      return;
    }

    // Remove coins:
    coinChain.forEach(c => this.removeCoin(c));

    this._gravity();

    window.game.incrementScore(this._calculateScore(coinChain.length));

    window.game.turn++;

    if (window.game.mode === CONSTANTS.MODES.PUZZLE && window.game.turn % 3 === 0) {
      this._loseOrAddRow();
    }

    if (_.random(0, 100) <= 10) {
      this._addStarToColumn(_.random(0, this.columns - 1));
    }

    this._moveCoins();
  }

  _loseOrAddRow() {
    if (this._anyRowAtPeak()) {
      window.game.gameOver();
    } else {
      this._addRow();
    }
  }

  _addStarToColumn(column) {
    let topOfColumn = this.coins[column].indexOf(null);

    let star = new Star(column, topOfColumn);
    star.drawAndMove(column, this.rows - 1, column, topOfColumn);
    this.coins[column][topOfColumn] = star;
  }

  _randomColor() {
    return _.sample(_.values(this.coinColors));
  }

  // Use depth-first search to find the biggest chain of consecutive coins.
  _findCoinChain(coin, coinsVisitedSoFar, chain) {
    if (_.contains(coinsVisitedSoFar, coin)) {
      return null;
    }

    chain.push(coin);
    coinsVisitedSoFar.push(coin);

    var above = this._getCoinAt(coin.column, coin.row + 1);
    var below = this._getCoinAt(coin.column, coin.row - 1);
    var left = this._getCoinAt(coin.column - 1, coin.row);
    var right = this._getCoinAt(coin.column + 1, coin.row);

    if (this._sameColorCoins(coin, above)) {
      this._findCoinChain(above, coinsVisitedSoFar, chain);
    }
    if (this._sameColorCoins(coin, below)) {
      this._findCoinChain(below, coinsVisitedSoFar, chain);
    }
    if (this._sameColorCoins(coin, left)) {
      this._findCoinChain(left, coinsVisitedSoFar, chain);
    }
    if (this._sameColorCoins(coin, right)) {
      this._findCoinChain(right, coinsVisitedSoFar, chain);
    }

    return chain;
  }

  // Move coins based on their position in the Board's state (this.coins)
  _moveCoins() {
    this.coins.forEach((coinColumn, x) => {
      coinColumn.forEach((coin, y) => {
        // nothing to do if this cell is null or coin has no new position:
        if (_.isNull(coin)) {
          return;
        }
        if (coin.column === x && coin.row === y) {
          return;
        }

        coin.move(x, y);
      });
    });
  }

  // Make coins fall down when there are empty spaces (null elements) in
  // between coins in a column
  _gravity() {
    for (let x = 0; x < this.columns; x++) {
      let columnCondensed = this.coins[x]
        .filter(element => !_.isNull(element));

      // replace nulls:
      columnCondensed = columnCondensed
        .concat(Array(this.rows - columnCondensed.length).fill(null));

      this.coins[x] = columnCondensed;
    }
  }

  // Bounds-safe coin retrieval
  _getCoinAt(column, row) {
    if (row >= this.rows || row < 0 || column >= this.columns || column < 0) {
      return null;
    }
    return this.coins[column][row];
  }

  // Are coinA and coinB the same color?
  _sameColorCoins(coinA, coinB) {
    if (_.isNull(coinA) || _.isNull(coinB)) {
      return false;
    }

    if (coinA.star === true || coinB.star === true) {
      return false;
    }

    return coinA.color === coinB.color;
  }

  // Warning: does not check to see if top coin is non null
  // Add new row from bottom
  _addRow() {
    this.coins.forEach((column, x) => {
      column.pop();
      let newCoin = new Coin(this._randomColor(), x, 0);
      column.unshift(newCoin);
      newCoin.drawAndMove(x, -1, x, 0);
    });
  }

  _anyRowAtPeak() {
    return this.coins.some(
      column => column.filter(
        element => !_.isNull(element)).length === this.rows);
  }

  _popStarAbove(coin) {
    let above = this._getCoinAt(coin.column, coin.row + 1);

    if (_.isNull(above)) {
      return false;
    }

    if (above.star === true) {
      this.removeCoin(above);
      return true;
    }

    return false;
  }

  removeCoin(coin) {
    coin.remove();
    this.coins[coin.column][coin.row] = null;
  }

  destroy() {
    this.coins.forEach((coinColumn, x) => {
      coinColumn.forEach((coin, y) => {
        if (_.isNull(coin)) {
          return;
        }

        window.stage.removeChild(coin.shape);
      });
    });
  }
}

module.exports = Board;