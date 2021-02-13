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
    this.tiles = this.createBoard();

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
    this.curX = -1;
    this.curY = -1;
    this.whiteVictories = 0;
    this.blackVictories = 0;
    this.currentTeamText = "";

    this.whiteCasualitiesText = "";
    this.blackCasualitiesText = "";

    this.totalVictoriesText = "";
  }

  createBoard() {
    const localBoard = [];

    localBoard.push([
      new Tile(ROOK, BLACK),
      new Tile(KNIGHT, BLACK),
      new Tile(BISHOP, BLACK),
      new Tile(QUEEN, BLACK),
      new Tile(KING, BLACK),
      new Tile(BISHOP, BLACK),
      new Tile(KNIGHT, BLACK),
      new Tile(ROOK, BLACK),
    ]);

    localBoard.push([
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
      localBoard.push([
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

    localBoard.push([
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
      new Tile(PAWN, WHITE),
    ]);

    localBoard.push([
      new Tile(ROOK, WHITE),
      new Tile(KNIGHT, WHITE),
      new Tile(BISHOP, WHITE),
      new Tile(QUEEN, WHITE),
      new Tile(KING, WHITE),
      new Tile(BISHOP, WHITE),
      new Tile(KNIGHT, WHITE),
      new Tile(ROOK, WHITE),
    ]);

    return localBoard;
  }

  checkPossiblePlays() {
    if (this.curX < 0 || this.curY < 0) return;

    let tile = this.tiles[this.curY][this.curX];
    if (tile.team === EMPTY || tile.team !== this.currentTeam) return;

    // drawTile(curX, curY, HIGHLIGHT_COLOR);
    this.tiles[(this.curX, this.curY)].highlighted = true;
    this.resetValidMoves();
    // board.resetValidMoves();

    if (tile.pieceType === PAWN)
      this.checkPossiblePlaysPawn(this.curX, this.curY);
    else if (tile.pieceType === KNIGHT)
      this.checkPossiblePlaysKnight(this.curX, this.curY);
    else if (tile.pieceType === BISHOP)
      this.checkPossiblePlaysBishop(this.curX, this.curY);
    else if (tile.pieceType === ROOK)
      this.checkPossiblePlaysRook(this.curX, this.curY);
    else if (tile.pieceType === QUEEN)
      this.checkPossiblePlaysQueen(this.curX, this.curY);
    else if (tile.pieceType === KING)
      this.checkPossiblePlaysKing(this.curX, this.curY);
  }

  checkPossiblePlaysPawn(curX, curY) {
    let direction;

    if (this.currentTeam === WHITE) direction = -1;
    else direction = 1;

    if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

    // Advance one tile
    this.checkPossibleMove(curX, curY + direction);

    // First double move
    if (curY === 1 || curY === 6) {
      this.checkPossibleMove(curX, curY + 2 * direction);
    }

    // Check diagonal left capture
    if (curX - 1 >= 0) this.checkPossibleCapture(curX - 1, curY + direction);

    // Check diagonal right capture
    if (curX + 1 <= BOARD_WIDTH - 1)
      this.checkPossibleCapture(curX + 1, curY + direction);
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

  checkPossiblePlaysKnight(curX, curY) {
    // Far left moves
    if (curX - 2 >= 0) {
      // Upper move
      if (curY - 1 >= 0) this.checkPossiblePlay(curX - 2, curY - 1);

      // Lower move
      if (curY + 1 <= BOARD_HEIGHT - 1)
        this.checkPossiblePlay(curX - 2, curY + 1);
    }

    // Near left moves
    if (curX - 1 >= 0) {
      // Upper move
      if (curY - 2 >= 0) this.checkPossiblePlay(curX - 1, curY - 2);

      // Lower move
      if (curY + 2 <= BOARD_HEIGHT - 1)
        this.checkPossiblePlay(curX - 1, curY + 2);
    }

    // Near right moves
    if (curX + 1 <= BOARD_WIDTH - 1) {
      // Upper move
      if (curY - 2 >= 0) this.checkPossiblePlay(curX + 1, curY - 2);

      // Lower move
      if (curY + 2 <= BOARD_HEIGHT - 1)
        this.checkPossiblePlay(curX + 1, curY + 2);
    }

    // Far right moves
    if (curX + 2 <= BOARD_WIDTH - 1) {
      // Upper move
      if (curY - 1 >= 0) this.checkPossiblePlay(curX + 2, curY - 1);

      // Lower move
      if (curY + 1 <= BOARD_HEIGHT - 1)
        this.checkPossiblePlay(curX + 2, curY + 1);
    }
  }

  checkPossiblePlaysRook(curX, curY) {
    // Upper move
    for (let i = 1; curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX, curY - i)) break;
    }

    // Right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
      if (this.checkPossiblePlay(curX + i, curY)) break;
    }

    // Lower move
    for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
      if (this.checkPossiblePlay(curX, curY + i)) break;
    }

    // Left move
    for (let i = 1; curX - i >= 0; i++) {
      if (this.checkPossiblePlay(curX - i, curY)) break;
    }
  }

  checkPossiblePlaysBishop(curX, curY) {
    // Upper-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX + i, curY - i)) break;
    }

    // Lower-right move
    for (
      let i = 1;
      curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
      i++
    ) {
      if (this.checkPossiblePlay(curX + i, curY + i)) break;
    }

    // Lower-left move
    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
      if (this.checkPossiblePlay(curX - i, curY + i)) break;
    }

    // Upper-left move
    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX - i, curY - i)) break;
    }
  }

  checkPossiblePlaysQueen(curX, curY) {
    this.checkPossiblePlaysBishop(curX, curY);
    this.checkPossiblePlaysRook(curX, curY);
  }

  checkPossiblePlaysKing(curX, curY) {
    for (let i = -1; i <= 1; i++) {
      if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

      for (let j = -1; j <= 1; j++) {
        if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
        if (i == 0 && j == 0) continue;

        this.checkPossiblePlay(curX + j, curY + i);
      }
    }
  }

  checkPossiblePlay(x, y) {
    if (this.checkPossibleCapture(x, y)) return true;

    return !this.checkPossibleMove(x, y);
  }

  checkPossibleMove(x, y) {
    if (this.tiles[y][x].team !== EMPTY) return false;

    this.validMoves[y][x] = VALID;
    // this.drawCircle(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkPossibleCapture(x, y) {
    if (this.tiles[y][x].team !== this.getOppositeTeam(this.currentTeam))
      return false;

    this.validMoves[y][x] = VALID_CAPTURE;
    // drawCorners(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkValidMovement(x, y) {
    if (
      this.validMoves[y][x] === VALID ||
      this.validMoves[y][x] === VALID_CAPTURE
    )
      return true;
    else return false;
  }

  checkValidCapture(x, y) {
    if (this.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
  }

  getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
  }
      if (this.checkPossiblePlay(curX - i, curY)) break;
    }
  }

  checkPossiblePlaysBishop(curX, curY) {
    // Upper-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX + i, curY - i)) break;
    }

    // Lower-right move
    for (
      let i = 1;
      curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
      i++
    ) {
      if (this.checkPossiblePlay(curX + i, curY + i)) break;
    }

    // Lower-left move
    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
      if (this.checkPossiblePlay(curX - i, curY + i)) break;
    }

    // Upper-left move
    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX - i, curY - i)) break;
    }
  }

  checkPossiblePlaysQueen(curX, curY) {
    this.checkPossiblePlaysBishop(curX, curY);
    this.checkPossiblePlaysRook(curX, curY);
  }

  checkPossiblePlaysKing(curX, curY) {
    for (let i = -1; i <= 1; i++) {
      if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

      for (let j = -1; j <= 1; j++) {
        if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
        if (i == 0 && j == 0) continue;

        this.checkPossiblePlay(curX + j, curY + i);
      }
    }
  }

  checkPossiblePlay(x, y) {
    if (this.checkPossibleCapture(x, y)) return true;

    return !this.checkPossibleMove(x, y);
  }

  checkPossibleMove(x, y) {
    if (this.tiles[y][x].team !== EMPTY) return false;

    this.validMoves[y][x] = VALID;
    // this.drawCircle(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkPossibleCapture(x, y) {
    if (this.tiles[y][x].team !== this.getOppositeTeam(this.currentTeam))
      return false;

    this.validMoves[y][x] = VALID_CAPTURE;
    // drawCorners(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkValidMovement(x, y) {
    if (
      this.validMoves[y][x] === VALID ||
      this.validMoves[y][x] === VALID_CAPTURE
    )
      return true;
    else return false;
  }

  checkValidCapture(x, y) {
    if (this.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
  }

  getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
  }
      if (this.checkPossiblePlay(curX - i, curY)) break;
    }
  }

  checkPossiblePlaysBishop(curX, curY) {
    // Upper-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX + i, curY - i)) break;
    }

    // Lower-right move
    for (
      let i = 1;
      curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
      i++
    ) {
      if (this.checkPossiblePlay(curX + i, curY + i)) break;
    }

    // Lower-left move
    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
      if (this.checkPossiblePlay(curX - i, curY + i)) break;
    }

    // Upper-left move
    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX - i, curY - i)) break;
    }
  }

  checkPossiblePlaysQueen(curX, curY) {
    this.checkPossiblePlaysBishop(curX, curY);
    this.checkPossiblePlaysRook(curX, curY);
  }

  checkPossiblePlaysKing(curX, curY) {
    for (let i = -1; i <= 1; i++) {
      if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

      for (let j = -1; j <= 1; j++) {
        if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
        if (i == 0 && j == 0) continue;

        this.checkPossiblePlay(curX + j, curY + i);
      }
    }
  }

  checkPossiblePlay(x, y) {
    if (this.checkPossibleCapture(x, y)) return true;

    return !this.checkPossibleMove(x, y);
  }

  checkPossibleMove(x, y) {
    if (this.tiles[y][x].team !== EMPTY) return false;

    this.validMoves[y][x] = VALID;
    // this.drawCircle(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkPossibleCapture(x, y) {
    if (this.tiles[y][x].team !== this.getOppositeTeam(this.currentTeam))
      return false;

    this.validMoves[y][x] = VALID_CAPTURE;
    // drawCorners(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkValidMovement(x, y) {
    if (
      this.validMoves[y][x] === VALID ||
      this.validMoves[y][x] === VALID_CAPTURE
    )
      return true;
    else return false;
  }

  checkValidCapture(x, y) {
    if (this.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
  }

  getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
  }
      if (this.checkPossiblePlay(curX - i, curY)) break;
    }
  }

  checkPossiblePlaysBishop(curX, curY) {
    // Upper-right move
    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX + i, curY - i)) break;
    }

    // Lower-right move
    for (
      let i = 1;
      curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1;
      i++
    ) {
      if (this.checkPossiblePlay(curX + i, curY + i)) break;
    }

    // Lower-left move
    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
      if (this.checkPossiblePlay(curX - i, curY + i)) break;
    }

    // Upper-left move
    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
      if (this.checkPossiblePlay(curX - i, curY - i)) break;
    }
  }

  checkPossiblePlaysQueen(curX, curY) {
    this.checkPossiblePlaysBishop(curX, curY);
    this.checkPossiblePlaysRook(curX, curY);
  }

  checkPossiblePlaysKing(curX, curY) {
    for (let i = -1; i <= 1; i++) {
      if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

      for (let j = -1; j <= 1; j++) {
        if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
        if (i == 0 && j == 0) continue;

        this.checkPossiblePlay(curX + j, curY + i);
      }
    }
  }

  checkPossiblePlay(x, y) {
    if (this.checkPossibleCapture(x, y)) return true;

    return !this.checkPossibleMove(x, y);
  }

  checkPossibleMove(x, y) {
    if (this.tiles[y][x].team !== EMPTY) return false;

    this.validMoves[y][x] = VALID;
    // this.drawCircle(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkPossibleCapture(x, y) {
    if (this.tiles[y][x].team !== this.getOppositeTeam(this.currentTeam))
      return false;

    this.validMoves[y][x] = VALID_CAPTURE;
    // drawCorners(x, y, HIGHLIGHT_COLOR);
    return true;
  }

  checkValidMovement(x, y) {
    if (
      this.validMoves[y][x] === VALID ||
      this.validMoves[y][x] === VALID_CAPTURE
    )
      return true;
    else return false;
  }

  checkValidCapture(x, y) {
    if (this.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
  }

  getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
  }

  onClick(x, y) {
    // let chessCanvasX = chessCanvas.getBoundingClientRect().left;
    // let chessCanvasY = chessCanvas.getBoundingClientRect().top;

    // let x = Math.floor((event.clientX-chessCanvasX)/TILE_SIZE);
    // let y = Math.floor((event.clientY-chessCanvasY)/TILE_SIZE);
    // console.log("function run");
    // this.moveSelectedPiece(x, y);
    if (this.checkValidMovement(x, y) === true) {
      if (this.checkValidCapture(x, y) === true) {
        if (this.tiles[y][x].pieceType === KING) {
          if (this.currentTeam === WHITE) this.whiteVictories++;
          else this.blackVictories++;

          this.startGame();
        }

        if (this.currentTeam === WHITE) {
          this.blackCasualities[this.tiles[y][x].pieceType]++;
          this.updateBlackCasualities();
        } else {
          this.whiteCasualities[this.tiles[y][x].pieceType]++;
          this.updateWhiteCasualities();
        }
      }

      this.moveSelectedPiece(x, y);
      console.log("moved");
      console.log(this.tiles);

      this.changeCurrentTeam();
    } else {
      this.curX = x;
      this.curY = y;
    }

    this.repaintBoard();
  }

  moveSelectedPiece(x, y) {
    this.tiles[y][x].pieceType = this.tiles[this.curY][this.curX].pieceType;
    this.tiles[y][x].team = this.tiles[this.curY][this.curX].team;

    this.tiles[this.curY][this.curX].pieceType = EMPTY;
    this.tiles[this.curY][this.curX].team = EMPTY;

    this.curX = -1;
    this.curY = -1;
    this.resetValidMoves();
  }

  startGame() {
    this.tile = this.createBoard();
    this.curX = -1;
    this.curY = -1;

    this.currentTeam = WHITE;
    this.currentTeamText.textContent = "White's turn";

    this.whiteCasualities = [0, 0, 0, 0, 0];
    this.blackCasualities = [0, 0, 0, 0, 0];

    this.repaintBoard();
    this.updateWhiteCasualities();
    this.updateBlackCasualities();
    this.updateTotalVictories();
  }
  repaintBoard() {
    // drawBoard();
    this.checkPossiblePlays();
    // drawPieces();
  }
  updateWhiteCasualities() {
    this.updateCasualities(this.whiteCasualities, this.whiteCasualitiesText);
  }

  updateBlackCasualities() {
    this.updateCasualities(this.blackCasualities, this.blackCasualitiesText);
  }

  updateCasualities(casualities, text) {
    let none = true;

    for (let i = QUEEN; i >= PAWN; i--) {
      if (casualities[i] === 0) continue;

      if (none) {
        text.textContent = casualities[i] + " " + piecesCharacters[i];
        none = false;
      } else {
        text.textContent += " - " + casualities[i] + " " + piecesCharacters[i];
      }
    }

    if (none) text.textContent = "None";
  }

  updateTotalVictories() {
    this.totalVictoriesText.textContent =
      "Games won: white " +
      this.whiteVictories +
      " - black " +
      this.blackVictories;
  }
}

class Tile {
  constructor(pieceType, team) {
    this.pieceType = pieceType;
    this.team = team;
    this.highlighted = false;
  }
}

export { Game, Tile };
