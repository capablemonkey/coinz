'use strict';

window.stage = new createjs.Stage('canvas');

const Game = require('./game.js');

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

  window.game.initializeStartScreen();
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
