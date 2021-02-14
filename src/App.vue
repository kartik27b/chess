<template>
  <div class="w-full h-screen flex items-center justify-center bg-gray-800">
    <div>
      <chess-modal
        :open="isGameOver"
        :result="result"
        @new-game="newGame"
      ></chess-modal>
      <h1 class="font-bold text-center text-3xl text-white mb-2">
        {{ turn }}'s Turn
      </h1>
      <transition name="board">
        <div
          v-if="!isGameOver"
          class="container w-108 h-108 bg-green-500 shadow-2xl"
        >
          <table class="table-fixed " cellspacing="0" cellpadding="0">
            <tbody>
              <tr v-for="(row, rowIdx) in chessBoard" :key="rowIdx">
                <td v-for="(col, colIdx) in row" :key="colIdx">
                  <chess-square
                    :piece="col"
                    :row="rowIdx"
                    :col="colIdx"
                    @piece-moved="moveChessPiece"
                    @make-promotion="makePromotion"
                    :pendingPromotion="pendingPromotion"
                  >
                  </chess-square>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

/* eslint-disable vue/no-unused-components */
// import { v4 } from "uuid";
// import ChessPiece from "./components/ChessPiece.vue";
import ChessSquare from "./components/ChessSquare.vue";
// import { PieceTypes } from "./utils";

import * as Chess from "chess.js";
import ChessModal from "./components/ChessModal.vue";
// let custom = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
// const stalemate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
const chess = new Chess();
console.log(chess.board());
console.log(chess.game_over());

export default {
  name: "App",
  components: { ChessSquare, ChessModal },

  data() {
    return {
      chessBoard: chess.board(),
      pendingPromotion: null,
      isGameOver: chess.game_over(),
      result: this.getResult(),
      turn: this.getTurn(),
    };
  },
  methods: {
    getTurn() {
      return chess.turn() === "w" ? "White" : "Black";
    },
    newGame() {
      chess.reset();
      this.chessBoard = chess.board();
      this.pendingPromotion = null;
      this.isGameOver = chess.game_over();
      this.result = this.getResult();
      this.turn = this.getTurn();
    },
    update(pendingPromotion) {
      this.isGameOver = chess.game_over();
      this.result = this.getResult();
      this.chessBoard = chess.board();
      this.turn = this.getTurn();

      this.pendingPromotion = pendingPromotion;
    },
    getResult() {
      if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? "Black" : "White";
        return "CHECKMATE - WINNER - " + winner;
      } else if (chess.in_draw()) {
        let reason = "50 - MOVES - RULE";
        if (chess.in_stalemate()) {
          reason = "STALEMATE";
        } else if (chess.in_threefold_repitition()) {
          reason = "REPITITION";
        } else if (chess.insufficient_material()) {
          reason = "INSUFFICIENT MATERIAL";
        }
        return "DRAW - " + reason;
      } else {
        return "UNKNOWN REASON";
      }
    },
    handleMove(from, to) {
      const promotions = chess
        .moves({ verbose: true })
        .filter((move) => move.promotion);

      if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0].color };
        this.update(pendingPromotion);
      }

      if (!this.pendingPromotion) {
        this.move(from, to);
      }
      console.table(promotions);
    },
    makePromotion({ from, to, piece }) {
      // console.log(data);
      // this.move()
      this.move(from, to, piece);
    },
    move(from, to, promotion) {
      const tempMove = { from, to };
      if (promotion) {
        tempMove.promotion = promotion;
      }

      const legalMove = chess.move(tempMove);
      if (legalMove) {
        this.update();
        console.log("legal move");
      } else console.log("illegal move");
    },
    moveChessPiece({ from, to }) {
      // this.move(from, to);
      this.handleMove(from, to);
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
.board-enter-from,
.board-leave-to {
  opacity: 0;
  scale: 0;
}
.board-enter-to,
.board-leave-from {
  opacity: 1;
  scale: 1;
}

.board-enter-active,
.board-leave-active {
  transition: all 1s ease;
}
</style>
