<template>
  <div class="w-full h-screen flex items-center justify-center bg-gray-800">
    <div>
      <h1 class="text-center text-white text-3xl font-extrabold mb-3">
        {{ whiteTurn ? "White" : "Black" }}'s Turn
      </h1>
      <div class="container w-108 h-108 bg-green-500 shadow-2xl">
        <table class="table-fixed " cellspacing="0" cellpadding="0">
          <tbody>
            <tr v-for="(row, rowIdx) in chessGrid" :key="rowIdx">
              <td v-for="(col, colIdx) in row" :key="colIdx">
                <chess-square
                  :piece="col"
                  :row="rowIdx"
                  :col="colIdx"
                  :whiteTurn="whiteTurn"
                  @piece-moved="moveChessPiece($event, rowIdx, colIdx)"
                >
                </chess-square>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

/* eslint-disable vue/no-unused-components */
import { v4 } from "uuid";
import ChessPiece from "./components/ChessPiece.vue";
import ChessSquare from "./components/ChessSquare.vue";
import { PieceTypes } from "./utils";

import * as Chess from "chess.js";

const chess = new Chess();

console.log(chess.moves());

export default {
  name: "App",
  components: { ChessPiece, ChessSquare },
  data() {
    return {
      whiteTurn: true,
      chessGrid: chess.board(),
    };
  },
  mounted() {},
  methods: {
    checkGameState() {
      if (chess.in_stalemate()) {
        console.log("stalemate");
      } else if (chess.in_draw()) {
        console.log("in draw");
      } else if (chess.in_checkmate()) {
        console.log("in checkmate");
      } else if (chess.in_check()) {
        console.log("in check");
      }
    },
    moveChessPiece(data, rowIdx, colIdx) {
      const { type, color, row, col } = data;
      // const whiteColor = color === "w" ? false : true;

      let move =
        String.fromCharCode("a".charCodeAt(0) + colIdx) +
        (this.chessGrid.length - rowIdx);

      let pawn = false;

      if (type === chess.KNIGHT) {
        move = "N" + move;
        console.log("knight moved");
      } else if (type === chess.QUEEN) {
        move = "Q" + move;
        console.log("queen moved");
      } else if (type === chess.BISHOP) {
        move = "B" + move;
        console.log("bishop moved");
      } else if (type === chess.ROOK) {
        move = "R" + move;
        console.log("rook moved");
      } else if (type === chess.KING) {
        move = "K" + move;
        console.log("king moved");
      } else {
        pawn = true;
      }
      const availableMoves = chess.moves();
      console.log("current moves", chess.moves());
      let invalid = false;

      if (!pawn) {
        const killMove = move.substring(0, 1) + "x" + move.substring(1);
        if (availableMoves.find((currMove) => currMove === killMove)) {
          chess.move(killMove);
        } else if (availableMoves.find((currMove) => currMove === move)) {
          chess.move(move);
        } else {
          invalid = true;
        }
      } else {
        let killMove = "x" + move;
        let found = false;

        for (const currMove of chess.moves()) {
          if (currMove.includes(killMove)) {
            found = true;
            killMove = currMove;
            break;
          }
        }
        if (!found && availableMoves.find((currMove) => currMove === move)) {
          chess.move(move);
        } else {
          chess.move(killMove);
        }
      }

      // if not pawn
      // i will generate possible kill moves, knight moved  Nxd5 where moved to d5
      // if pawn prevpos exd5 => e = prev, d5 = curr
      console.log("available moves", chess.moves());
      this.whiteTurn = !this.whiteTurn;
      this.chessGrid = chess.board();
      this.checkGameState();
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
