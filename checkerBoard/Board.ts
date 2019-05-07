import {Piece, IPiece, Point } from "./Piece";

export interface IBoard {
    getMoves(point: Point): Point[];
    whoseTurn(): number;
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
        this.generateMovesForAllPieces();

    }

    getMoves(point: Point): Point[] {
        let piece = this.getPiece(point);
        // if that loc piece does not exist or it is not your piece
        if(piece == undefined || piece.getType() != this._turn) {
            return [];
        } else {
            return piece.getMoves();
        }
    }

    getPiece(p: Point): IPiece {
        return this._board[p._y][p._x];
    }

    whoseTurn(): number {
        return this._turn;
    }



    /******************** Private functions *****************************/
    initBoard(): void {
        // Initialize board array
        for(let i = 0; i < this.ROWS; i++) {
            this._board[i] = new Array(8);
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
            for(let j = (i%2); j < this.COLUMNS; j+=2) {
                let point: Point = new Point(i, j);
                let temp: IPiece = new Piece(this._board, point, 1);
                this._board[i][j] = temp;
                this._pieces[1].set(point, temp);
            }
        }
    }
    generateMovesForAllPieces(): void {
        // Generating moves for each pieces
        for(let i = 0; i < 2; i++) {
            for(let [_, piece] of this._pieces[i]) {
                piece.generateMoves();
            }
        }
    }
}

