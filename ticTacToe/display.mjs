export default class Display {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.delta = this.canvas.width / 3
        this.initBoard();
    }

    initBoard() {
        this.ctx.beginPath();
        this.ctx.rect(this.delta, 0, 1, this.canvas.height);
        this.ctx.rect(2*this.delta, 0, 1, this.canvas.height);
        this.ctx.rect(0, this.delta, this.canvas.width, 1);
        this.ctx.rect(0, 2*this.delta, this.canvas.width, 1);
        this.ctx.rect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawSelection({y,x,turn}) {
        if(y == -1) {
            return -1;
        }
        this.ctx.beginPath();
        if(turn == 0) {
            var center = {x: x * this.delta + this.delta/2, y: y*this.delta + this.delta/2};
            this.ctx.fillStyle = "#bbcc8a";
            this.ctx.arc(center.x, center.y, this.delta/2*0.8, 0, 2*Math.PI);
            this.ctx.fill();
        } else {
            var hypotenuse = Math.sqrt(2*this.delta*this.delta);
            var width = this.delta * 0.1;
            this.ctx.fillStyle = "#61684c";
            this.ctx.translate(this.delta*x, this.delta*y);
            this.ctx.rotate( 45 * Math.PI / 180);
            this.ctx.fillRect(hypotenuse * 0.2, -this.delta*0.05, hypotenuse * 0.6, width);
            this.ctx.fillRect(hypotenuse/2 -this.delta*0.05 , -hypotenuse * 0.3, width, hypotenuse * 0.6);
            this.ctx.rotate( -45 * Math.PI / 180);
            this.ctx.translate(-this.delta*x, -this.delta*y);
        }
        this.ctx.closePath();
        this.changeTurn(turn);
        return 1;
    }

    changeTurn(turn) {
        var turnId = document.getElementById("turnId");
        if(turn == 0) {
            turnId.textContent = "X";
        } else {
            turnId.textContent = "O";
        }
    }

    winner(result={a:{y,x}, b:{y, x}, winner}) {
        console.log(result);
        if(result.a.y == -2) {
            alert("TIE");
        } else if (result.a.y == -1) {
            //ignore
        } else {
            alert("Winner is: " + this.toString(result.winner));
        }

    }

    toString(winner) {
        if(winner == 0) {
            return "O";
        }
        return "X";
    }
}