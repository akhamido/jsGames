import { Point } from "./Piece";
import { Board } from "./Board";

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

    _board:Board;

    constructor() {
        this._canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        this._ctx = <CanvasRenderingContext2D>this._canvas.getContext('2d');
        this.WIDTH = 600;
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
        let that = this;
        this._canvas.addEventListener('mousedown', function(e) {that.mouseClick(e)});
        this._canvas.addEventListener('mouseup', function(e) {that.mouseClick(e)});
    }

    mouseClick(event: MouseEvent) {
        let point = this.parseToCoord(event);
        let moves = this._board.getMoves(point);
        if(event.type == "mousedown") {
            for(let move of moves) {
                this.highlightPiece(move);
            }
            this._highlightedPoints = moves;
        } else if(event.type == "mouseup") {
            for(let move of this._highlightedPoints) {
                this.unhighlightPiece(move);
            }
            this._highlightedPoints = [];
        }
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
                this.drawPiece(new Point(y, x), 0);
            }
        }
        for(let y = this.COLUMNS + 2; y < this.ROWS; y++) {
            for(let x = (y+1)%2; x < this.ROWS; x+=2) {
                this.drawPiece(new Point(y, x), 1);
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
}

let bw = new BoardView();
