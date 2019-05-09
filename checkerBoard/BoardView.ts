import { Point } from "./Piece";
import { Board, RC } from "./Board";

class BoardView {
    _ctx:CanvasRenderingContext2D;
    _canvas: HTMLCanvasElement;
    WIDTH:number;
    HEIGHT:number;
    DELTA:number;
    ROWS:number;
    COLUMNS:number;
    BOARD_COLORS: string[];
    PIECE_COLORS: string[];
    _highlightedPoints: Point[];
    mouseEventListener: {(e:MouseEvent):void;}[];

    _board:Board;

    constructor() {
        this._canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext('2d');
        this.WIDTH = this._canvas.width;
        this.HEIGHT = 600;
        this.DELTA = this.WIDTH / 8;
        this.ROWS = 8;
        this.COLUMNS = 3;
        this.BOARD_COLORS = ['#FFE4C4', '#000000', '#BC8F8F']; // 3rd index used for hightlight
        this.PIECE_COLORS = ['#FFF8DC', '#A9A9A9']; // grey, Cornsilk
        this._highlightedPoints = [];

        // Init board logic
        this._board = new Board(true, true);

        this.drawBoard();
        this.populatePieces();

        // Handle piece click and piece move
        // storing references to those so those can be removed for play again
        this.mouseEventListener = [];
        let that = this;
        let mousedown_ = function(e: MouseEvent) {that.mouseDown(e)}
        this._canvas.addEventListener('mousedown', mousedown_);
        let mouseup_ = function(e: MouseEvent) {that.mouseUp(e)}
        this._canvas.addEventListener('mouseup', mouseup_);
        this.mouseEventListener.push(mousedown_);
        this.mouseEventListener.push(mouseup_);

        this.displayTurn();
    }

    mouseDown(event: MouseEvent) {
        let point = this.parseToCoord(event);
        console.log("Was clicked", point);
        let moves = this._board.getMoves(point);
        for(let i = 0; i < moves.length-1; i++) {
            this.highlightPiece(moves[i]);
        }
        this._highlightedPoints = moves;
    }

    mouseUp(event: MouseEvent) {
        let point = this.parseToCoord(event);
        let len = this._highlightedPoints.length;

        // last index hold src piece
        let src = this._highlightedPoints[len-1]
        for(let i = 0; i < len-1; i++) {
            let dest = this._highlightedPoints[i];
            this.unhighlightPiece(dest);
            
            // if valid dest than tell the logic
            if((point._x == dest._x) && (point._y == dest._y) ){
                let rc:RC = this._board.movePiece(src, dest);
                this.drawPiece(dest, rc.color);
                for(let p of rc.removedPieces) {
                    this.removePiece(p);
                }
                this.display(rc.winner);
            }
        }
        this._highlightedPoints = [];
    }

    parseToCoord(event: MouseEvent): Point {
        let y:number = event.clientY;
        let x:number = event.clientX;
        let canvasXY = this._canvas.getBoundingClientRect();
        y = y - canvasXY.top;
        x = x - canvasXY.left;
        
        y = Math.floor(y / this.DELTA);
        x = Math.floor(x / this.DELTA);
        return new Point(y, x);
    }

    drawBoard() {
        this._ctx.strokeRect(0,0, this.WIDTH, this.HEIGHT);
        let color = 0;
        for(let y = 0; y < this.ROWS; y++) {
            color = y % 2;
            for(let x = 0; x < this.ROWS; x++) {
                this.removePiece(new Point(y, x), color%2);
                color = color + 1;
            }
        }
    }

    populatePieces() {
        for(let y = 0; y < this.COLUMNS; y++) {
            for(let x = (y+1)%2; x < this.ROWS; x+=2) {
                this.drawPiece(new Point(y, x), 1);
            }
        }
        for(let y = this.COLUMNS + 2; y < this.ROWS; y++) {
            for(let x = (y+1)%2; x < this.ROWS; x+=2) {
                this.drawPiece(new Point(y, x), 0);
            }
        }
    }

    removePiece(p: Point, color = 1) {
        let y = p._y, x = p._x;
        y = y * this.DELTA;
        x = x * this.DELTA;
        this._ctx.fillStyle = this.BOARD_COLORS[color];
        this._ctx.fillRect(x, y, this.DELTA, this.DELTA);
    }

    drawPiece(p: Point, color:number) {
        let y = p._y, x = p._x;
        let half = this.DELTA / 2;
        // Center (y,x)
        y = y * this.DELTA + half;
        x = x * this.DELTA + half;
        this._ctx.beginPath();
        this._ctx.fillStyle = this.PIECE_COLORS[color];
        this._ctx.arc(x, y, half - 5, 0, 2 * Math.PI, true);
        this._ctx.fill();
    }

    highlightPiece(p: Point) {
        this.removePiece(p, 2);
    }

    unhighlightPiece(p: Point) {
        this.removePiece(p);
    }

    display(winner:number) {
        if(winner == -1) {
            this.displayTurn()
        } else {
            let winnerDisplay = document.getElementById("winnerDisplay");
            let playBtn = document.getElementById("playBtn");
            if(winner == 1) {
                winnerDisplay.innerText = "Black Won: Play again"
            } else {
                winnerDisplay.innerText = "White Won: Play again"
            }
            playBtn.innerText = "Play again";
            this.removeEventListener();
        }
    }
    
    removeText() {
        let winnerDisplay = document.getElementById("winnerDisplay");
        winnerDisplay.innerText = "";
    }

    displayTurn() {
        let turnElm:HTMLElement = document.getElementById("whoseTurn");
        let turn = "";
        if(this._board.whoseTurn() == 0) {
            turn = "White";
        } else {
            turn = "Black";
        }
        turnElm.innerHTML = turn;
    }

    removeEventListener() {
        this._canvas.removeEventListener('mousedown', this.mouseEventListener[0]);
        this._canvas.removeEventListener('mouseup', this.mouseEventListener[1]);
    }
}
let bw:BoardView = null;
let p = document.getElementById("playBtn");
p.addEventListener("click", function(e) {
    if(bw != null) {
        bw.removeText();
    }
    bw = new BoardView()
});


