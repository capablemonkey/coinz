const CONSTANTS = require('./constants.js');
const Board = require('./board.js');

class Game {
  constructor() {
    this.level = 1;
    this.score = 0;
    this.stars = 0;
    this.turn = 0;
    this.timeLeft = CONSTANTS.TIME_LIMIT;
    this.state = CONSTANTS.STATES.START_SCREEN;

    this.mode = 'puzzle';

    this.texts = {};

    this.board = new Board(CONSTANTS.COLUMNS, CONSTANTS.ROWS, 1);
  }

  initializeStartScreen() {
    this.texts = {
      puzzle: this._createText('puzzle mode', 'bold 30px Helvetica', '#ff7700', 250, 300),
      speed: this._createText('speed mode', 'bold 30px Helvetica', '#ff7700', 250, 500)
    };

    this.texts.puzzle.on('click', event => {
      this.mode = 'puzzle';
      this.startGame();
    });

    this.texts.speed.on('click', event => {
      this.mode = 'speed';
      this.startGame();
    });

    this.state = CONSTANTS.STATES.START_SCREEN;
  }

  _createText(text, style, color, x, y) {
    const control = new createjs.Text(text, style, color);
    control.x = x;
    control.y = y;
    control.textBaseline = 'alphabetic';

    window.stage.addChild(control);
    return control;
  }

  startGame() {
    this.state = CONSTANTS.STATES.IN_GAME;

    this.ticker = setInterval(() => {
      this.timeLeft -= 1;
      this.updateStats();
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);

    this.initializeBoard();
  }

  initializeBoard() {
    window.stage.removeAllChildren();
    this.board.initialize(CONSTANTS.STARTING_ROWS);

    this.texts = {
      score: this._createText('', 'bold 30px Helvetica', '#ff7700', 10, 30),
      level: this._createText('', '30px Helvetica', '#ff7700', 140, 30),
      timer: this._createText('', '30px Helvetica', '#ff7700', 320, 30),
      stars: this._createText('', '30px Helvetica', '#ff7700', 550, 30)
    };

    this.updateStats();
  }

  collectStars(starsCount) {
    this.incrementScore(starsCount * 200);

    this.stars += starsCount;
    if (this.stars >= CONSTANTS.LEVEL_THRESHOLD[this.level]) {
      this.nextLevel();
      return true;
    }
    this.updateStats();

    return false;
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
    clearInterval(this.ticker);
    window.stage.removeAllEventListeners();  // TODO: this isn't the right method...
    this.state = CONSTANTS.STATES.GAME_OVER;
    alert('GAME OVER');

  }

  _formattedTime() {
    const seconds = this.timeLeft % 60;
    const minutes = (this.timeLeft - seconds) / 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

module.exports = Game;