(function() {
  'use strict';

  const COLORS = {
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    YELLOW: 'gold'
  };

  const COIN_PIXEL_OFFSET = 50;
  const STAGE = new createjs.Stage('canvas');

  const LEVEL_THRESHOLD = {
    1: 3,
    2: 4,
    3: 4,
    4: 5
  };

  const LEVEL_COIN_COLORS = {
    1: 3,
    2: 4,
    3: 5,
    4: 5
  };

  class Game {
    constructor() {
      this.level = 1;
      this.score = 0;
      this.stars = 0;
    }

    collectStar() {
      this.stars++;
      if (this.stars >= LEVEL_THRESHOLD[this.level]) {
        return this.nextLevel();
      }
      this._updateStats();
    }

    nextLevel() {
      this.level++;
      this.stars = 0;
      alert('new level!  ${this.level}');
      this._updateStats();
    }

    incrementScore(amount) {
      this.score += amount;
      this._updateStats();
    }

    _updateStats() {
      document.getElementById('score').innerHTML = this.score;
      document.getElementById('level').innerHTML = this.level;
      document.getElementById('stars').innerHTML = this.stars;
    }
  }

  const GAME = new Game();

  class Coin {
    constructor(color, column, row) {
      // TODO: maybe board should be global instead of referring to it over and over again.
      this.color = color;
      this.column = column;
      this.row = row;
      this.shape = new createjs.Shape();
      this.star = false;
    }

    draw() {
      this.shape
        .graphics
        .beginFill(this.color)
        .drawCircle(25, 25, 20);

      this.shape.addEventListener('mousedown', event => {
        BOARD.clickCoin(this);
      });

      this._addToStage();
    }

    move(column, row) {
      this.column = column;
      this.row = row;

      createjs.Tween.get(this.shape)
        .to({x: column * COIN_PIXEL_OFFSET, y: row * COIN_PIXEL_OFFSET}, 100);
    }

    remove() {
      if (_.isNull(this.shape)) {
        return;
      }
      STAGE.removeChild(this.shape);
    }

    _addToStage() {
      this.shape.x = this.column * COIN_PIXEL_OFFSET;
      this.shape.y = this.row * COIN_PIXEL_OFFSET;

      // TODO: update the stage only once all the new coin positions are realized.
      STAGE.addChild(this.shape);
      STAGE.update();
    }
  }

  class Star extends Coin {
    constructor(column, row) {
      super('purple', column, row);
      this.star = true;
    }

    draw() {
      this.shape
        .graphics
        .beginFill(this.color)
        .drawPolyStar(25, 25, 20, 5, 0.5, 0.5);

      this._addToStage();
    }
  }

  class Board {
    constructor(columns, rows) {
      this.rows = rows;
      this.columns = columns;
      this.turn = 0;

      // 2D array: coins[x][y]
      this.coins = Array(columns).fill(null).map(() => new Array(rows).fill(null));
    }

    initialize(rowsToCreate) {
      _(rowsToCreate).times(() => this._addRow());
      this._drawCoins();
    }

    // Main player action: drives change in the board.
    clickCoin(coin) {
      let coinChain = this._findCoinChain(coin, [], []);
      if (coinChain.length < 3) {
        return false;
      }

      // Pop any stars above:
      coinChain.forEach(c => this._popStarAbove(c));

      // Remove coins:
      coinChain.forEach(c => this.removeCoin(c));

      this._gravity();

      GAME.incrementScore(coinChain.length * 10);

      this.turn++;

      if (this.turn % 3 === 0) {
        if (this._anyRowAtPeak()) {
          alert('GAME OVER');
        } else {
          this._addRow();
        }
      }

      this._addStarToColumn(_.random(0, this.columns - 1));

      this._moveCoins();
    }

    _addStarToColumn(column) {
      let topOfColumn = this.coins[column].lastIndexOf(null);

      let star = new Star(column, 0);
      star.draw();
      this.coins[column][topOfColumn] = star;
    }

    _randomColor() {
      return _.sample(_.values(COLORS));
    }

    // Use depth-first search to find the biggest chain of consecutive coins.
    _findCoinChain(coin, coinsVisitedSoFar, chain) {
      if (_.contains(coinsVisitedSoFar, coin)) {
        return null;
      }

      chain.push(coin);
      coinsVisitedSoFar.push(coin);

      var above = this._getCoinAt(coin.column - 1, coin.row);
      var below = this._getCoinAt(coin.column + 1, coin.row);
      var left = this._getCoinAt(coin.column, coin.row - 1);
      var right = this._getCoinAt(coin.column, coin.row + 1);

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

    _drawCoins() {
      this.coins.forEach((coinColumn, x) => {
        coinColumn.forEach((coin, y) => {
          // nothing to do if this cell is null or coin has no new position:
          if (_.isNull(coin)) {
            return;
          }
          coin.column = x;
          coin.row = y;
          coin.draw();
        });
      });
    }

    // Make coins fall down when there are empty spaces (null elements) in
    // between coins in a column
    _gravity() {
      for (let x = 0; x < this.columns; x++) {
        let columnCondensed = this.coins[x]
          .reverse()
          .filter(element => !_.isNull(element));

        // replace nulls:
        columnCondensed = columnCondensed
          .concat(Array(this.columns - columnCondensed.length + 1)
          .fill(null));

        this.coins[x] = columnCondensed.reverse();
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
        column.shift();
        let newCoin = new Coin(
          this._randomColor(), x, (this.rows + 1) * COIN_PIXEL_OFFSET);
        column.push(newCoin);
        newCoin.draw();
      });
    }

    _anyRowAtPeak() {
      return this.coins.some(
        column => column.filter(
          element => !_.isNull(element)).length === this.rows);
    }

    _popStarAbove(coin) {
      let above = this._getCoinAt(coin.column, coin.row - 1);

      if (_.isNull(above)) {
        return;
      }

      console.log(above);

      if (above.star === true) {
        GAME.collectStar();
        this.removeCoin(above);
      }
    }

    removeCoin(coin) {
      coin.remove();
      this.coins[coin.column][coin.row] = null;
    }
  }

  const BOARD = new Board(14, 15);
  window.board = BOARD; // debugging

  function init() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", STAGE);

    BOARD.initialize(5);
  }

  init();
})();
