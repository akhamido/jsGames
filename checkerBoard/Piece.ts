export interface IPiece {
    getType(): number;
    getCurrPos(): Point;
    getMoves(): Point[];
    setMove(dest: Point): void;
    getTakeMoves(): Point[];
    setTakeMove(dest: Point):Point[];
}

export class Piece implements IPiece {

    private _board: IPiece[][];
    private _takeMoves: Point[];
    private _currPos: Point;
    private _type: number
    constructor(board: IPiece[][], point: Point, type: number) {
        this._board = board;
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
        let result = [];
        for(let move of this.generateMoves()) {
            let piece = this.getPiece(move);
            if(piece === null) {
                result.push(move)
            }
        }
        return result;
    }

    setMove(dest: Point): void {
        this._board[this._currPos._y][ this._currPos._x] = null;
        this._board[dest._y][dest._x] = this;
        this._currPos.updatePoint(dest);
    }

    // One take a time. No backward taking is supported
    getTakeMoves(): Point[] {
        let result:Point[] = [];
        for(let move of this.generateMoves()) {
            let piece = this.getPiece(move);
            if(piece !== null && piece.getType() !== this.getType()) {
                let det = new Point(move._y - this.getCurrPos()._y, move._x - this.getCurrPos()._x);
                let fp = new Point(move._y+det._y, move._x+det._x);
                if(this.boundryChecking(fp)) {
                    if(this._board[fp._y][fp._x] === null) {
                        result.push(fp);
                    }
                }
            }
        }
        return result;
    }

    setTakeMove(dest: Point):Point[] {
        let result: Point[] = []
        let diff:Point = dest.subtract(this.getCurrPos());
        diff.divide(2);
        diff = this.getCurrPos().add(diff);
        this._board[this._currPos._y][ this._currPos._x] = null;
        this._board[dest._y][dest._x] = this;
        result.push(this._board[diff._y][diff._x].getCurrPos());
        this._board[diff._y][diff._x] = null;
        this._currPos.updatePoint(dest);
        return result;
    }

    /* ---------------- Private Functions ---------------- */
    getPiece(p: Point): IPiece {
        return this._board[p._y][p._x];
    }
    // Checking if that point is within boundry
    boundryChecking(p: Point): boolean {
        let valid = false;
        let result = false;
        let y = p._y;
        let x = p._x;
        if(this._type == 1) {
            // Check bottom
            if(y < 8) {
                valid = true;
            }
        } else {
            // Check Top
            if(0 <= y) {
                valid = true;
            }
        }
        if(valid) {
            // Check right
            if(x < 8) {
                result = true;
            } else if(0 <= x ) {
                result = true;
            }
        }
        return result;
    }

    generateMoves(): Point[] {
        let moves = [];
        for(let move of this.getRawMoves() ) {
            let piece = this.getPiece(move);
            if( piece === null || piece.getType() !== this.getType()) {
                moves.push(move);
            }
        }
        return moves;
    }

    // boundry checking and push to moves if valid moves
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

    subtract(p: Point): Point {
        return new Point(this._y-p._y, this._x-p._x);
    }

    divide(n: number) {
        this._y = this._y / 2;
        this._x = this._x / 2;
    }

    add(p: Point):Point {
        return new Point(this._y+p._y, this._x+p._x);
    }

    abs():void {
        this._x = Math.abs(this._x);
        this._y = Math.abs(this._y);
    }

    updatePoint(p: Point):void {
        this._x = p._x;
        this._y = p._y;
    }
}