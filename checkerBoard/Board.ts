import {Piece, IPiece, Point } from "./Piece";

export interface IBoard {
    getMoves(point: Point): Point[];
    movePiece(src: Point, dest: Point):RC;
    whoseTurn(): number;
    nextTurn(): void;
    
}
/*
 * O = 0 -> bottom
 * X = 1 -> top
 * 
 * Take opposite piece if there are chance. YES or NO
 */
export class Board implements IBoard {
    ROWS: number = 8;
    COLUMNS: number = 8;
    private _board: IPiece[][];
    private _pieces: Map<Point, IPiece>[];
    private _mustTake: boolean;
    private _canTakeBackward: boolean;
    private _turn: number;
    constructor(mustTake: boolean, canTakeBackward: boolean) {
        // Initalize rules
        this._mustTake = mustTake;
        this._canTakeBackward = canTakeBackward;
        // User 0 starts
        this._turn = 0;

        // Initialize _pieces that holds pointer to pieces
        this._pieces = new Array(2);
        this._pieces[0] = new Map<Point, IPiece>();
        this._pieces[1] = new Map<Point, IPiece>();

        // Create Board 2d array
        this._board = new Array(8);

        // Populate the arrays
        this.initBoard();

    }

    getMoves(point: Point): Point[] {
        let result: Point[] = []

        // Check if user must take other piece
        for(let [_, piece] of this._pieces[this._turn]){
            let points:Point[] = piece.getTakeMoves();
            if(points.length != 0) {
                console.log(points);
                result = result.concat(points)
            }
        }
        if(result.length != 0) {
            result.push(point);
            return result;
        }

        let piece = this.getPiece(point);
        // if that loc piece does not exist or it is not your piece
        if(piece == null || piece.getType() != this._turn) {
            return [];
        } else {
            let result = piece.getMoves();
            result.push(point);
            return result;
        }
    }

    movePiece(src: Point, dest: Point): RC {
        let rc :RC = new RC();
        // if diff is more than 2 than it is take move
        let diff: Point = dest.subtract(src);
        diff.abs();
        let srcPiece = this.getPiece(src);

        if((diff._y == 1) && (diff._x == 1)) {
            srcPiece.setMove(dest);
        } else {
            // gives pieces that were taken
            rc.removedPieces = srcPiece.setTakeMove(dest);
            for(let p of rc.removedPieces) {
                this._pieces[this.whoseTurnNext()].delete(p);
            }
            this.checkWinner(rc);
        }
        // old position of the src to be removed
        rc.removedPieces.push(src);
        rc.color = srcPiece.getType();
        this.nextTurn();
        return rc;
    }

    /* 
     * -1 - no winner
     *  0 - bottom pieces won
     *  1 - top pieces won
     */
    checkWinner(rc: RC) {
        if(this._pieces[0].size == 0) {
            rc.winner = 1; 
        } else if(this._pieces[1].size == 0) {
            rc.winner = 0;
        }  
        return rc;
    }

    whoseTurn(): number {
        return this._turn;
    }

    whoseTurnNext(): number {
        return (this._turn+1) % 2;
    }

    nextTurn(): void {
        this._turn = this._turn + 1;
        this._turn = this._turn % 2;
    }

    /******************** Private functions *****************************/
    initBoard(): void {
        // Initialize board array
        for(let i = 0; i < this.ROWS; i++) {
            this._board[i] = new Array(8);
            for(let j = 0; j < this.ROWS; j++) {
                this._board[i][j] = null;
            }
        }
        // Assign O pieces in bottom half
        for(let i = 5; i < 8; i++) {
            for(let j = (i+1)%2; j < this.COLUMNS; j+=2) {
                let point: Point = new Point(i, j);
                let temp: IPiece = new Piece(this._board, point, 0);
                this._board[i][j] = temp;
                this._pieces[0].set(point, temp);
            }
        }
        // Assign X pieces in top half
        for(let i = 0; i < 3; i++) {
            for(let j = (i+1)%2; j < this.COLUMNS; j+=2) {
                let point: Point = new Point(i, j);
                let temp: IPiece = new Piece(this._board, point, 1);
                this._board[i][j] = temp;
                this._pieces[1].set(point, temp);
            }
        }
    }

    getPiece(p: Point): IPiece {
        return this._board[p._y][p._x];
    }
}

export class RC {
    winner:number;
    color:number;
    removedPieces: Point[];
    constructor(winner:number  = -1, color = 0, removedPieces:Point[] = []) {
        this.winner = winner;
        this.color = color;
        this.removedPieces = removedPieces;
    }
}

