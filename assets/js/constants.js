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

  STATES: {
    START_SCREEN: 'intro',
    IN_GAME: 'in_game',
    GAME_OVER: 'game_over'
  },

  MODES: {
    PUZZLE: 'puzzle',
    SPEED: 'speed'
  }
};
