/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.stage = new createjs.Stage('canvas');

	const Game = __webpack_require__(1);

	window.game = new Game();

	function init() {
	  createjs.Touch.enable(window.stage); // so we can detect touch from mobile devices as clicks
	  createjs.Ticker.setFPS(60);
	  createjs.Ticker.addEventListener("tick", window.stage);
	  window.stage.enableMouseOver(20);

	  resize();

	  window.addEventListener('resize', () => {
	    resize();
	  });

	  window.game.initializeBoard();
	}

	function resize() {
	  let ratioX = (window.innerWidth * .8) / 700;
	  let ratioY = (window.innerHeight * .8) / 800;
	  let scale = _.min([ratioX, ratioY, 1.0]);
	  window.stage.scaleX = scale;
	  window.stage.scaleY = scale;
	  document.getElementById('container').style.width = `${scale * 700}px`;
	  document.getElementById('container').style.height = `${scale * 800}px`;
	}

	init();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const CONSTANTS = __webpack_require__(2);
	const Board = __webpack_require__(3);

	class Game {
	  constructor() {
	    this.level = 1;
	    this.score = 0;
	    this.stars = 0;
	    this.turn = 0;
	    this.timeLeft = CONSTANTS.TIME_LIMIT;

	    setInterval(() => {
	      this.timeLeft -= 1;
	      this.updateStats();
	      if (this.timeLeft <= 0) {
	        this.gameOver();
	      }
	    }, 1000);

	    this.mode = 'puzzle';

	    this.texts = {
	      score: new createjs.Text(0, "bold 30px Helvetica", "#ff7700"),
	      level: new createjs.Text('lvl 1', "30px Helvetica", "#ff7700"),
	      timer: new createjs.Text('starz', "30px Helvetica", "#ff7700"),
	      stars: new createjs.Text('starz', "30px Helvetica", "#ff7700")
	    };

	    this.texts.score.x = 10;
	    this.texts.score.y = 30;
	    this.texts.score.textBaseline = "alphabetic";

	    this.texts.level.x = 180;
	    this.texts.level.y = 30;
	    this.texts.level.textBaseline = "alphabetic";

	    this.texts.timer.x = 300;
	    this.texts.timer.y = 30;
	    this.texts.timer.textBaseline = "alphabetic";

	    this.texts.stars.x = 550;
	    this.texts.stars.y = 30;
	    this.texts.stars.textBaseline = "alphabetic";

	    window.stage.addChild(this.texts.score);
	    window.stage.addChild(this.texts.level);
	    window.stage.addChild(this.texts.timer);
	    window.stage.addChild(this.texts.stars);

	    this.board = new Board(CONSTANTS.COLUMNS, CONSTANTS.ROWS, 1);
	  }

	  initializeBoard() {
	    this.board.initialize(CONSTANTS.STARTING_ROWS);
	    this.updateStats();
	  }

	  collectStar() {
	    this.incrementScore(200);

	    this.stars++;
	    if (this.stars >= CONSTANTS.LEVEL_THRESHOLD[this.level]) {
	      return this.nextLevel();
	    }
	    this.updateStats();
	  }

	  nextLevel() {
	    this.level++;
	    this.stars = 0;
	    this.turn = 0;

	    this.board.destroy();
	    this.board = new Board(CONSTANTS.COLUMNS, CONSTANTS.ROWS, this.level);
	    this.initializeBoard();
	  }

	  incrementScore(amount) {
	    this.score += amount;
	    this.updateStats();
	  }

	  updateStats() {
	    this.texts.score.text = this.score;
	    this.texts.level.text = `lvl ${this.level}`;
	    this.texts.timer.text = this._formattedTime();
	    this.texts.stars.text = `${this.stars} / ${CONSTANTS.LEVEL_THRESHOLD[this.level]} stars`;

	    window.stage.update();
	  }

	  gameOver() {
	    alert('GAME OVER');
	  }

	  _formattedTime() {
	    const seconds = this.timeLeft % 60;
	    const minutes = (this.timeLeft - seconds) / 60;
	    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	  }
	}

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  ROWS: 15,
	  COLUMNS: 14,
	  STARTING_ROWS: 5,

	  COLORS: {
	    RED: 'red',
	    BLUE: 'blue',
	    GREEN: 'green',
	    YELLOW: 'gold',
	    GREY: 'grey',
	    BLACK: 'black'
	  },

	  COIN_RADIUS: 23,
	  COIN_PIXEL_OFFSET: 50,
	  HEIGHT: 800,
	  WIDTH: 700,

	  LEVEL_THRESHOLD: {
	    1: 3,
	    2: 4,
	    3: 4,
	    4: 5
	  },

	  LEVEL_COIN_COLORS: {
	    1: 3,
	    2: 4,
	    3: 5,
	    4: 5
	  },

	  TIME_LIMIT: 180,

	  MODES: {
	    PUZZLE: 'puzzle',
	    SPEED: 'speed'
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const CONSTANTS = __webpack_require__(2);
	const Coin = __webpack_require__(4);
	const Star = __webpack_require__(5);

	class Board {
	  constructor(columns, rows, level) {
	    this.rows = rows;
	    this.columns = columns;
	    this.coinColors = _.values(CONSTANTS.COLORS).slice(0, CONSTANTS.LEVEL_COIN_COLORS[level]);

	    // 2D array: coins[x][y]
	    this.coins = Array(columns).fill(null).map(() => new Array(rows).fill(null));

	    const topBoundary = new createjs.Shape();
	    topBoundary
	      .graphics
	      .beginFill('black')
	      .drawRect(0, 50, 700, 3);
	    window.stage.addChild(topBoundary);
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
	    window.stage.update();
	  }

	  // Main player action: drives change in the board.
	  clickCoin(coin) {
	    let coinChain = this._findCoinChain(coin, [], []);
	    if (coinChain.length < 3) {
	      return false;
	    }

	    // Pop any stars above:
	    // TODO: fix bug here: if coin group has n stars and m stars are needed to
	    // advance to the next level, n-m stars carry over to the next level
	    coinChain.forEach(c => this._popStarAbove(c));

	    // Remove coins:
	    coinChain.forEach(c => this.removeCoin(c));

	    // TODO: fix bug -- we should return here if the level has progressed
	    // otherwise, we'll increment the next level's turn; or add a new phantom row
	    // to the next level...

	    this._gravity();

	    window.game.incrementScore(coinChain.length * 10);

	    window.game.turn++;

	    if (window.game.turn % 3 === 0) {
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
	      return;
	    }

	    if (above.star === true) {
	      window.game.collectStar();
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

	        window.stage.removeChild(coin.shape);
	      });
	    });
	  }
	}

	module.exports = Board;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var CONSTANTS = __webpack_require__(2);

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
	      window.game.board.clickCoin(this);
	    });

	    this.shape.on('mouseover', event => {
	      window.game.board.toggleHighlightCoinGroup(this);
	    });

	    this.shape.on('mouseout', event => {
	      window.game.board.toggleHighlightCoinGroup(this);
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
	      .drawCircle(25, 25, CONSTANTS.COIN_RADIUS);
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

	    createjs.Tween.get(this.shape, {override: true})
	      .to({x: this.pixelX(), y: this.pixelY()}, 200);
	  }

	  remove() {
	    if (_.isNull(this.shape)) {
	      return;
	    }
	    this.shape.removeAllEventListeners();

	    createjs.Tween.get(this.shape, {override: true})
	      .to({x: CONSTANTS.WIDTH + CONSTANTS.COIN_PIXEL_OFFSET, y: this.pixelY() - 100, alpha: .2}, 100)
	      .call(() => {
	        window.stage.removeChild(this.shape);
	      });
	  }

	  _addToStage() {
	    this.shape.x = this.pixelX();
	    this.shape.y = this.pixelY();

	    // TODO: update the stage only once all the new coin positions are realized.
	    window.stage.addChild(this.shape);
	    window.stage.update();
	  }

	  pixelX() {
	    return this.column * CONSTANTS.COIN_PIXEL_OFFSET;
	  }

	  pixelY() {
	    return CONSTANTS.HEIGHT - (this.row + 1) * CONSTANTS.COIN_PIXEL_OFFSET;
	  }
	}

	module.exports = Coin;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Coin = __webpack_require__(4);

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

	module.exports = Star;

/***/ }
/******/ ]);