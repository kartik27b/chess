/* eslint-disable no-unused-vars */
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

const TILE_SIZE = 50;
const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
export const WHITE = 0;
export const BLACK = 1;

export const EMPTY = -1;
export const PAWN = 0;
export const KNIGHT = 1;
export const BISHOP = 2;
export const ROOK = 3;
export const QUEEN = 4;
export const KING = 5;

export const INVALID = 0;
export const VALID = 1;
export const VALID_CAPTURE = 2;

const piecesCharacters = {
  0: "♙",
  1: "♘",
  2: "♗",
  3: "♖",
  4: "♕",
  5: "♔",
};

class Game {
  constructor() {
    this.tiles = [];

    this.tiles.push([
      new Tile(ROOK, BLACK),
      new Tile(KNIGHT, BLACK),
      new Tile(BISHOP, BLACK),
      new Tile(QUEEN, BLACK),
      new Tile(KING, BLACK),
      new Tile(BISHOP, BLACK),
      new Tile(KNIGHT, BLACK),
      new Tile(ROOK, BLACK),
    ]);

    this.tiles.push([
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
      new Tile(PAWN, BLACK),
    ]);

    for (let i = 0; i < 4; i++) {
      this.tiles.push([
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
        new Tile(EMPTY, EMPTY),
      ]);
    }

    this.tiles.push([
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
    ]);

    this.tiles.push([
      new Tile(ROOK, WHITE),
      new Tile(KNIGHT, WHITE),
      new Tile(BISHOP, WHITE),
      new Tile(QUEEN, WHITE),
      new Tile(KING, WHITE),
      new Tile(BISHOP, WHITE),
      new Tile(KNIGHT, WHITE),
      new Tile(ROOK, WHITE),
    ]);

    this.validMoves = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.validMoves.push([
        INVALID,
        INVALID,
        INVALID,
        INVALID,
        INVALID,
        INVALID,
        INVALID,
        INVALID,
      ]);
    }

    this.currentTeam = WHITE;

    this.whiteCasualities = [0, 0, 0, 0, 0];
    this.blackCasualities = [0, 0, 0, 0, 0];
  }

  board() {
    return this.tiles;
  }

  resetValidMoves() {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        this.validMoves[i][j] = INVALID;
      }
    }
  }
}

class Tile {
  constructor(pieceType, team) {
    this.pieceType = pieceType;
    this.team = team;
  }
}

export { Game, Tile };
