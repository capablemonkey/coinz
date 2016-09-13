'use strict';

window.stage = new createjs.Stage('canvas');

var Game = require('./game.js');

window.game = new Game();

function init() {
  createjs.Touch.enable(window.stage); // so we can detect touch from mobile devices as clicks
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", window.stage);
  window.stage.enableMouseOver(20);

  window.game.initializeBoard();
}

init();
