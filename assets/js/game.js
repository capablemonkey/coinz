const CONSTANTS = require('./constants.js');
const Board = require('./board.js');

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
      score: this._createText("bold 30px Helvetica", "#ff7700", 10, 30),
      level: this._createText("30px Helvetica", "#ff7700", 140, 30),
      timer: this._createText("30px Helvetica", "#ff7700", 320, 30),
      stars: this._createText("30px Helvetica", "#ff7700", 550, 30)
    };

    this.board = new Board(CONSTANTS.COLUMNS, CONSTANTS.ROWS, 1);
  }

  initializeStartScreen() {

  }

  _createText(style, color, x, y) {
    const control = new createjs.Text('', style, color);
    control.x = x;
    control.y = y;
    control.textBaseline = 'alphabetic';

    window.stage.addChild(control);
    return control;
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