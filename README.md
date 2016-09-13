# coinz

a html5 canvas game: https://coinz.gordn.org

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
- add timer mode
- game type: race against the clock - total game time limit, rows advance every third turn
- game type: original - rows advance every X seconds
- game over screen with play again button
- make the canvas scale based on viewing resolution
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
