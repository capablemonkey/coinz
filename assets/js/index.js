(function() {
  'use strict';

  const ROWS = 15;
  const COLUMNS = 14;
  const STARTING_ROWS = 5;

  const COLORS = {
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    YELLOW: 'gold',
    GREY: 'grey',
    BLACK: 'black'
  };

  const COIN_RADIUS = 23;
  const COIN_PIXEL_OFFSET = 50;
  const STAGE = new createjs.Stage('canvas');
  const HEIGHT = 800;
  const WIDTH = 700;

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

      this.texts = {
        score: new createjs.Text(0, "bold 30px Helvetica", "#ff7700"),
        level: new createjs.Text('lvl 1', "30px Helvetica", "#ff7700"),
        stars: new createjs.Text('starz', "30px Helvetica", "#ff7700")
      };

      this.texts.score.x = 10;
      this.texts.score.y = 30;
      this.texts.score.textBaseline = "alphabetic";

      this.texts.level.x = 280;
      this.texts.level.y = 30;
      this.texts.level.textBaseline = "alphabetic";

      this.texts.stars.x = 550;
      this.texts.stars.y = 30;
      this.texts.stars.textBaseline = "alphabetic";

      STAGE.addChild(this.texts.level);
      STAGE.addChild(this.texts.score);
      STAGE.addChild(this.texts.stars);
    }

    collectStar() {
      this.incrementScore(200);

      this.stars++;
      if (this.stars >= LEVEL_THRESHOLD[this.level]) {
        return this.nextLevel();
      }
      this.updateStats();
    }

    nextLevel() {
      this.level++;
      this.stars = 0;

      $board.destroy();
      $board = new Board(COLUMNS, ROWS, this.level);
      $board.initialize(STARTING_ROWS);
      window.board = $board; // todo: debug, remove later
      this.updateStats();
    }

    incrementScore(amount) {
      this.score += amount;
      this.updateStats();
    }

    updateStats() {
      this.texts.score.text = this.score;
      this.texts.level.text = `lvl ${this.level}`;
      this.texts.stars.text = `${this.stars} / ${LEVEL_THRESHOLD[this.level]} stars`;

      STAGE.update();
    }
  }

  const GAME = new Game();

  class Coin {
    constructor(color, column, row) {
      this.color = color;
      this.column = column;
      this.row = row;
      this.shape = new createjs.Shape();
      this.star = false;
      this.highlight = false;
    }

    draw() {
      this._makeShape();

      // This prevents duplicate click events for one click:
      this.shape.removeAllEventListeners();

      this.shape.on('click', event => {
        $board.clickCoin(this);
      });

      this.shape.on('mouseover', event => {
        $board.toggleHighlightCoinGroup(this);
      });

      this.shape.on('mouseout', event => {
        $board.toggleHighlightCoinGroup(this);
      });

      this._addToStage();
    }

    toggleHighlight() {
      this.highlight = !this.highlight;

      this.shape.graphics.clear();

      if (this.highlight) {
        this.shape.graphics
          .setStrokeStyle(3, "round")
          .beginStroke('orange');
      }

      this._makeShape();
    }

    _makeShape() {
      this.shape.graphics
        .beginFill(this.color)
        .drawCircle(25, 25, COIN_RADIUS);
    }

    drawAndMove(columnBegin, rowBegin, columnEnd, rowEnd) {
      this.column = columnBegin;
      this.row = rowBegin;
      this.draw();

      this.move(columnEnd, rowEnd);
    }

    move(column, row) {
      this.column = column;
      this.row = row;

      createjs.Tween.get(this.shape, {override:true})
        .to({x: this.pixelX(), y: this.pixelY()}, 200);
    }

    remove() {
      if (_.isNull(this.shape)) {
        return;
      }
      this.shape.removeAllEventListeners();

      createjs.Tween.get(this.shape, {override: true})
        .to({x: WIDTH + COIN_PIXEL_OFFSET, y: this.pixelY() - 100, alpha: .2}, 100)
        .call(() => {
          STAGE.removeChild(this.shape);
        });
    }

    _addToStage() {
      this.shape.x = this.pixelX();
      this.shape.y = this.pixelY();

      // TODO: update the stage only once all the new coin positions are realized.
      STAGE.addChild(this.shape);
      STAGE.update();
    }

    pixelX() {
      return this.column * COIN_PIXEL_OFFSET;
    }

    pixelY() {
      return HEIGHT - (this.row + 1) * COIN_PIXEL_OFFSET;
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
    constructor(columns, rows, level) {
      this.rows = rows;
      this.columns = columns;
      this.turn = 0;
      this.coinColors = _.values(COLORS).slice(0, LEVEL_COIN_COLORS[level]);

      // 2D array: coins[x][y]
      this.coins = Array(columns).fill(null).map(() => new Array(rows).fill(null));

      const topBoundary = new createjs.Shape();
      topBoundary
        .graphics
        .beginFill('black')
        .drawRect(0, 50, 700, 3);
      STAGE.addChild(topBoundary);
    }

    initialize(rowsToCreate) {
      _(rowsToCreate).times(() => this._addRow());
      this._moveCoins();

      // setInterval(() => {
      //   this._loseOrAddRow();
      //   this._moveCoins();
      // }, 3000);
    }

    toggleHighlightCoinGroup(coin) {
      let coinChain = this._findCoinChain(coin, [], []);

      if (coinChain.length < 3) {
        return;
      }

      coinChain.forEach(c => c.toggleHighlight());
      STAGE.update();
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
        this._loseOrAddRow();
      }

      if (_.random(0, 100) <= 10) {
        this._addStarToColumn(_.random(0, this.columns - 1));
      }

      this._moveCoins();

    _loseOrAddRow() {
      if (this._anyRowAtPeak()) {
        alert('GAME OVER');
        console.log('GAME OVER');
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
        return;
      }

      if (above.star === true) {
        GAME.collectStar();
        this.removeCoin(above);
      }
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

          STAGE.removeChild(coin.shape);
        });
      });
    }
  }

  var $board = new Board(COLUMNS, ROWS, 1);

  window.board = $board; // debugging
  window.game = GAME; // debugging
  window.stage = STAGE;

  function init() {
    createjs.Touch.enable(STAGE); // so we can detect touch from mobile devices as clicks
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", STAGE);
    STAGE.enableMouseOver(20);

    $board.initialize(STARTING_ROWS);
    GAME.updateStats();
  }

  init();
})();
