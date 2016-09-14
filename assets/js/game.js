const CONSTANTS = require('./constants.js');
const Board = require('./board.js');

class Game {
  constructor() {
    this.level = 1;
    this.score = 0;
    this.stars = 0;
    this.turn = 0;


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

    window.stage.addChild(this.texts.level);
    window.stage.addChild(this.texts.score);
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
    this.texts.stars.text = `${this.stars} / ${CONSTANTS.LEVEL_THRESHOLD[this.level]} stars`;

    window.stage.update();
  }
}

module.exports = Game;