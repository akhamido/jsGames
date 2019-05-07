import Board from './board.mjs';
import Display from './display.mjs';
var board = new Board();
var display = new Display();

document.getElementById("myCanvas").addEventListener("mousedown", function() {
    var rc;
    rc = board.put();
    rc = display.drawSelection(rc);
    rc = board.checkWinner(rc);
    rc = display.winner(rc);
})