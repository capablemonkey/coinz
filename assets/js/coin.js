var CONSTANTS = require('./constants.js');

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