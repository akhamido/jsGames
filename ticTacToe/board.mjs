import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

/*

 * 0 = O
 * 1 = X
 * 
*/
export default class Board {
    constructor() {
        this.turn = 0;
        this.board = [[-1,-1,-1], [-1,-1,-1], [-1,-1,-1]];
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.delta = this.canvas.width / 3
    }
    
    put() {
        var canvasPos = this.canvas.getBoundingClientRect();
        var x = event.clientX - canvasPos.left;
        var y = event.clientY - canvasPos.top;
        if(x < this.canvas.width+canvasPos.left && y < this.canvas.height+canvasPos.top) {
            for(var i = 0; i < 3; i++) {
                for(var j = 0; j < 3; j++) {
                    if(j*this.delta < x && x < (j+1)*this.delta && i*this.delta < y && y < (i+1)*this.delta) {
                        if(this.board[i][j] == -1) {
                            this.board[i][j] = this.turn;
                            var status = {y:i, x:j, turn: this.turn};
                            this.nextTurn();
                            return status;
                        }
                    }
                }
           }
        }
        return -1;
    }

    nextTurn() {
        this.turn++;
        this.turn%=2;
    }

    checkWinner() {
        var matches = 0;
        var NOTFINISHED = {a:{y:-1, x: -1}, b:{y:0, x:0}, winner:0};
        var result = {a:{y:-2, x:-2}, b:{y:0, x:0}, winner:0}; // 2 = tie
        var ignore = false;
        for(var i = 0; i < this.board.length; i++) {
            for(var j = 0; j < this.board.length; j++) {
                if(this.board[i][j] == -1) {
                    result = NOTFINISHED;
                    ignore = true;
                    break;
                }
                matches += this.board[i][j];
            }
            if(!ignore && (matches == 0 || matches == 3)) {
                return {a:{y:i, x: 0}, b:{y:i, x:2}, winner:this.board[i][0]};
            }
            matches = 0;
            ignore = false;
        }

        for(var j = 0; j < this.board.length; j++) {
            for(var i = 0; i < this.board.length; i++) {
                if(this.board[i][j] == -1) {
                    result = NOTFINISHED;
                    ignore = true;
                    break;
                }
                matches += this.board[i][j];
            }
            if(!ignore && (matches == 0 || matches == 3)) {
                return {a:{y:0, x: j}, b:{y:2, x:j}, winner:this.board[0][j]};
            }
            matches = 0;
            ignore = false;
        }
        if(this.board[1][1] != -1) {
            if(this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
                return {a:{y:0, x: 0}, b:{y:2, x:2}, winner:this.board[1][1]};
            } else if(this.board[0][2] == this.board[1][1] && this.board[1][1] == this.board[2][0]) {
                return {a:{y:2, x: 0}, b:{y:0, x:2}, winner:this.board[1][1]};
            }
        }
        return result;
    }
}