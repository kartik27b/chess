<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="container w-108 h-108 bg-green-500">
      <table class="table-fixed " cellspacing="0" cellpadding="0">
        <tbody>
          <tr v-for="(row, rowIdx) in grid" :key="rowIdx">
            <td v-for="(col, colIdx) in row" :key="colIdx">
              <chess-square
                :piece="col.piece"
                @piece-moved="movePiece($event, rowIdx, colIdx)"
              >
              </chess-square>
            </td>
          </tr>
        </tbody>
      </table>
      {{ chessGrid }}
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { v4 } from "uuid";
import ChessPiece from "./components/ChessPiece.vue";
import ChessSquare from "./components/ChessSquare.vue";
import { PieceTypes } from "./utils";

import * as Chess from "chess.js";
// const { Chess } = require("chess.js");
const chess = new Chess();

// while (!chess.game_over()) {
//   const moves = chess.moves();
//   const move = moves[Math.floor(Math.random() * moves.length)];
//   chess.move(move);
// }
// console.log(chess.pgn());
console.log(chess.board());

export default {
  name: "App",
  components: { ChessPiece, ChessSquare },
  data() {
    const mygrid = [
      [
        this.createObject(PieceTypes.ROOK),
        this.createObject(PieceTypes.KNIGHT),
        this.createObject(PieceTypes.BISHOP),
        this.createObject(PieceTypes.QUEEN),
        this.createObject(PieceTypes.KING),
        this.createObject(PieceTypes.BISHOP),
        this.createObject(PieceTypes.KNIGHT),
        this.createObject(PieceTypes.ROOK),
      ],
      [
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
      ],
      [
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
      ],
      [
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
      ],
      [
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
      ],
      [
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
        this.createObject(),
      ],
      [
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
        this.createObject(PieceTypes.PAWN),
      ],
      [
        this.createObject(PieceTypes.ROOK),
        this.createObject(PieceTypes.KNIGHT),
        this.createObject(PieceTypes.BISHOP),
        this.createObject(PieceTypes.QUEEN),
        this.createObject(PieceTypes.KING),
        this.createObject(PieceTypes.BISHOP),
        this.createObject(PieceTypes.KNIGHT),
        this.createObject(PieceTypes.ROOK),
      ],
    ];

    return {
      grid: mygrid,
    };
  },
  computed: {
    chessGrid() {
      return chess.board();
    },
  },
  mounted() {},
  methods: {
    createObject(type) {
      if (!type) {
        return { piece: null };
      }
      return { piece: { id: v4(), name: "pawn", type: type } };
    },
    movePiece(data, rowIdx, colIdx) {
      // console.log(data, rowIdx, colIdx);
      let len = this.grid.length;

      let currSquare;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
          if (this.grid[i][j].piece && this.grid[i][j].piece.id === data) {
            currSquare = this.grid[i][j];
            break;
          }
        }
      }
      const moveSquare = this.grid[rowIdx][colIdx];
      moveSquare.piece = currSquare.piece;
      currSquare.piece = null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
