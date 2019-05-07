package main

import (
	"fmt"
	"strconv"
	"strings"
)

type Vector2d struct {
	x int
	y int
}

type Piece struct {
	pieceType string // O = white X = black
	Vector2d
}

func (p *Piece) possibleMoves() []Vector2d {
	if p == nil {
		return []Vector2d{}
	}

	result := make([]Vector2d, 0)
	if p.pieceType == "O" && p.y < 7 {
		if 0 < p.x {
			result = append(result, Vector2d{p.x - 1, p.y + 1})
		}
		if p.x < 7 {
			result = append(result, Vector2d{p.x + 1, p.y + 1})
		}
	}
	if p.pieceType == "X" && 0 < p.y {
		if 0 < p.x {
			result = append(result, Vector2d{p.x - 1, p.y - 1})
		}
		if p.x < 7 {
			result = append(result, Vector2d{p.x + 1, p.y - 1})
		}
	}
	return result
}

func (p *Piece) isPosMove(posMove *Vector2d) bool {
	for _, move := range p.possibleMoves() {
		if move == *posMove {
			return true
		}
	}
	return false
}

func (p *Piece) canTake(posMove *Piece) *Vector2d {
	if p.pieceType == "O" && posMove.y < 7 {
		if posMove.x < 7 && p.x < posMove.x {
			return &Vector2d{posMove.x + 1, posMove.y + 1}
		} else if 0 < posMove.x {
			return &Vector2d{posMove.x - 1, posMove.y + 1}
		}
	}
	if p.pieceType == "X" && 0 < posMove.y {
		if posMove.x < 7 && p.x < posMove.x {
			return &Vector2d{posMove.x + 1, posMove.y - 1}
		} else if 0 < posMove.x {
			return &Vector2d{posMove.x - 1, posMove.y - 1}
		}
	}
	return nil
}

type Board struct {
	board [][]*Piece
}

func newBoard() Board {
	nb := Board{}
	nb.board = make([][]*Piece, 8)
	for i := 0; i < 8; i++ {
		nb.board[i] = make([]*Piece, 8)
	}
	for j := 0; j < 3; j++ {
		for i := (j + 1) % 2; i < 8; i += 2 {
			nb.board[j][i] = &Piece{"O", Vector2d{i, j}}
		}
	}
	for j := 5; j < 8; j++ {
		for i := (j + 1) % 2; i < 8; i += 2 {
			nb.board[j][i] = &Piece{"X", Vector2d{i, j}}
		}
	}
	return nb
}

func (nb Board) String() string {
	var sb strings.Builder
	sb.WriteString("  01234567\n")
	for i, row := range nb.board {
		sb.WriteString(strconv.Itoa(i) + "|")
		for _, piece := range row {
			if piece != nil {
				sb.WriteString(piece.pieceType)
			} else {
				sb.WriteString(".")
			}
		}
		sb.WriteString("\n")
	}
	return sb.String()
}

func (nb *Board) printValidMoves(moveFrom Vector2d) {
	fmt.Print("ValidMoves: ")
	for _, moveTo := range nb.board[moveFrom.y][moveFrom.x].possibleMoves() {
		if validMove := nb.validMove(moveFrom, moveTo); validMove != nil {
			fmt.Printf("(%d, %d) ", moveTo.x, moveTo.y)
		}
	}
	fmt.Println()
}

// -1 = invalid 0 = valid 1 = canTake
func (nb *Board) validMove(from, to Vector2d) *Vector2d {
	pieceFrom, pieceTo := nb.board[from.y][from.x], nb.board[to.y][to.x]
	if pieceTo == nil {
		return &to
	} else {
		posMove := pieceFrom.canTake(pieceTo)
		if posMove != nil && nb.board[posMove.y][posMove.x] == nil {
			return posMove
		}
	}
	return nil
}

func (nb *Board) move(from, to Vector2d) {
	result := nb.validMove(from, to)
	if nb.board[from.y][from.x].isPosMove(&to) && result != nil {
		rootPiece := nb.board[from.y][from.x]
		rootPiece.x, rootPiece.y = result.x, result.y
		nb.board[result.y][result.x] = rootPiece
		nb.board[from.y][from.x] = nil
		if *result != to {
			nb.board[to.y][to.x] = nil
		}
	} else {
		fmt.Println("Invalid Move: Try again")
	}
}

func main() {
	b := newBoard()
	b.board[3][6] = &Piece{"X", Vector2d{6, 3}}
	b.move(Vector2d{7, 2}, Vector2d{6, 3})
	b.printValidMoves(Vector2d{6, 5})
	b.move(Vector2d{6, 5}, Vector2d{5, 4})
	fmt.Println(b)
}
