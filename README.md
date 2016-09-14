# coinz

a html5 canvas game: https://coinz.gordn.org

### How to play

0. click groups of adjacent similar color coins of size > 3
1. bigger groups give you bigger bonuses (TODO)
2. collect stars by clicking on the coin group underneath them
3. stars give bonuses
4. collect enough stars to progress to the next level
5. new levels introduce more colors to the board and require more stars to pass

## Development

Install dev dependencies:

```
npm install
```

Build javascript:

```
webpack
```

Then open `index.html` in your web browser.

## TODO:

- exponential bonus score for big groups
- game over screen with play again button
- add coin assets
- add score assets
- add animation for score increase

done:


- add animations for coin movement
- transition from fabric.js to easel.js
- refactor coordinate system to use bottom left origin = (0,0)
- stars are used to track level progression
- levels
- harder levels have more colors
- reset board on new level
- stars give bonuses
- add animation for coin click
- highlight coin groups on mouse over
- break out monolithic index.js into modules
- make the canvas scale based on viewing resolution
- add timer mode to both game types
- game type: speed - rows advance every X seconds
- game type: puzzle - rows advance every third turn
- add start screen