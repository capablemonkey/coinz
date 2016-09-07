// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('canvas');

function Coin(row, column) {
  var self = this;
  self.canvasObject = null;

  this.draw = function() {
    self.canvasObject = new fabric.Circle({
      left: row * 50,
      top: column * 50,
      fill: 'red',
      radius: 20
    });

    canvas.add(self.canvasObject);
  }
}

a = new Coin(1, 1);
b = new Coin(1, 2);
c = new Coin(1, 3);
a.draw();
b.draw();
c.draw();