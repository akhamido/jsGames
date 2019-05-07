export interface IPiece {
    getType(): number;
    getCurrPos(): Point;
    getMoves(): Point[];
    setMove(): Point;
    getTakeMoves(): Point[];
    setTakeMove(): Point[];
    generateMoves(): void;
}

export class Piece implements IPiece {

    private _board: IPiece[][];
    private _moves: Point[];
    private _takeMoves: Point[];
    private _currPos: Point;
    private _type: number
    constructor(board: IPiece[][], point: Point, type: number) {
        this._board = board;
        this._moves = [];
        this._takeMoves = [];
        this._currPos = point;
        this._type = type;
    }

    getType(): number {
        return this._type;
    }

    getCurrPos(): Point {
        return this._currPos;
    }

    getMoves(): Point[] {
        return this._moves;
    }

    setMove(): Point {
        throw new Error("Method not implemented.");
    }

    getTakeMoves(): Point[] {
        return this._takeMoves;
    }

    setTakeMove(): Point[] {
        throw new Error("Method not implemented.");
    }

    generateMoves(): void {
        for(let move of this.getRawMoves() ) {
            if(this._board[move._y][move._x] == undefined) {
                this._moves.push(move);
            }
        }
    }

    // boundry checking
    getRawMoves(position = this._currPos): Point[] {
        let result = [];
        let valid: boolean = false;
        let y: number = position._y;
        let x: number = position._x;
        // if O type else X type
        if(this._type == 1) {
            // Check bottom
            y = y + 1;
            if(y < 8) {
                valid = true;
            }
        } else {
            // Check Top
            y = y - 1;
            if(0 <= y) {
                valid = true;
            }
        }
        if(valid) {
            // Check right
            if(x + 1 < 8) {
                result.push(new Point(y, x+1))
            }
            // Check left
            if(0 <= x - 1) {
                result.push(new Point(y, x-1))
            }
        }
        return result;
    }

    generateTakeMoves(): void {
        
    }
}


export class Point {
    _y: number;
    _x: number;
    constructor(y: number, x: number) {
        this._y = y;
        this._x = x;
    }

    toString(): string {
        return "[" + this._y + " "  + this._x + "] ";
    }
}