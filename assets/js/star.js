const Coin = require('./coin.js');

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