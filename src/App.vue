<template>
  <div class="w-full h-screen flex items-center justify-center bg-gray-800">
    <chess-modal
      :open="isGameOver"
      :result="result"
      @new-game="newGame"
    ></chess-modal>
    <div v-if="!isGameOver">
      <div class="flex items-center justify-between">
        <h1
          class="font-bold text-center text-3xl text-white mb-2 bg-blue-600 rounded-md px-3 py-1"
        >
          {{ turn }}'s Turn
        </h1>

        <div class="flex items-center">
          <label for="sound" class="font-bold text-white text-xl mr-1">
            Enable Sound</label
          >
          <input
            type="checkbox"
            name="sound"
            class="w-5 h-5"
            v-model="enableSound"
            value="Enable Rotation"
          />
        </div>
        <div class="flex items-center">
          <label for="rotation" class="font-bold text-white text-xl mr-1">
            Enable Rotation</label
          >
          <input
            type="checkbox"
            name="rotation"
            class="w-5 h-5"
            v-model="shouldRotate"
            value="Enable Rotation"
          />
        </div>
      </div>
      <audio ref="gameAudio" />
      <transition name="board">
        <div
          class="container w-108 h-108 bg-green-500 shadow-2xl transition-transform duration-1000"
          :class="{ 'rotate-board': rotate && shouldRotate }"
        >
          <table class="table-fixed" cellspacing="0" cellpadding="0">
            <tbody>
              <tr v-for="(row, rowIdx) in chessBoard" :key="rowIdx">
                <td v-for="(col, colIdx) in row" :key="colIdx">
                  <chess-square
                    :rotate="rotate && shouldRotate"
                    :piece="col"
                    :row="rowIdx"
                    :col="colIdx"
                    :highlight="getHightlight(rowIdx, colIdx)"
                    :checkProp="checkProp"
                    :pendingPromotion="pendingPromotion"
                    @make-promotion="makePromotion"
                    @piece-moved="moveChessPiece"
                    @piece-dragged="pieceDragged"
                    @piece-drag-end="pieceDragEnd"
                  >
                  </chess-square>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
    <div v-if="!isGameOver" class="ml-10">
      <div
        class="w-64 h-16 bg-yellow-400 rounded-sm shadow-xl mb-4 flex items-center justify-center font-bold text-2xl"
      >
        Check
      </div>
      <div
        class="w-64 h-16 bg-green-500 rounded-sm shadow-xl mb-4 flex items-center justify-center font-bold text-2xl"
      >
        Possible Move
      </div>
      <div
        class="w-64 h-16 bg-red-500 rounded-sm shadow-xl mb-4 flex items-center justify-center font-bold text-2xl text-white"
      >
        Capture Move
      </div>
    </div>
  </div>
</template>

<script>
// /* eslint-disable no-unused-vars */

/* eslint-disable vue/no-unused-components */
import ChessSquare from "./components/ChessSquare.vue";

import * as Chess from "chess.js";
import ChessModal from "./components/ChessModal.vue";

// let custom = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
// const stalemate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
const chess = new Chess();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default {
  name: "App",
  components: { ChessSquare, ChessModal },

  data() {
    let highlights = [];
    for (let i = 0; i < 8; i++) {
      const curr = [];
      for (let j = 0; j < 8; j++) {
        curr.push(false);
      }
      highlights.push(curr);
    }

    return {
      chessBoard: chess.board(),
      pendingPromotion: null,
      isGameOver: chess.game_over(),
      result: this.getResult(),
      turn: this.getTurn(),
      highlights: highlights,
      rotate: false,
      shouldRotate: true,
      enableSound: true,
      check: false,
      checkProp: null,
    };
  },
  methods: {
    getHightlight(row, col) {
      return this.highlights[row][col];
    },
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
      this.rotate = false;
    },
    update(pendingPromotion) {
      this.isGameOver = chess.game_over();
      this.result = this.getResult();
      this.chessBoard = chess.board();
      this.turn = this.getTurn();

      this.pendingPromotion = pendingPromotion;
      this.rotate = !this.rotate && !this.pendingPromotion;

      if (chess.in_check()) {
        this.check = true;
        const turn = chess.turn();
        this.checkProp = { turn };
      } else {
        this.check = false;
        this.checkProp = null;
      }
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
    },
    makePromotion({ from, to, piece }) {
      this.move(from, to, piece);
    },
    playSound() {
      if (!this.enableSound) return;
      const soundVal = getRandomInt(1, 3);
      const sound = this.$refs.gameAudio;
      sound.src = require(`../src/sounds/wood${soundVal}.wav`);
      sound
        .play()
        .then(() => {
          // console.log("resolved");
        })
        .catch(() => {
          // console.log("rejected");
        });
    },
    move(from, to, promotion) {
      const tempMove = { from, to };
      if (promotion) {
        tempMove.promotion = promotion;
      }

      const legalMove = chess.move(tempMove);
      if (legalMove) {
        this.playSound();
        this.update();
        // console.log("legal move");
      }
      // else console.log("illegal move");
    },
    pieceDragged({ position }) {
      const moves = chess
        .moves({ verbose: true })
        .filter((move) => move.from === position);

      for (const move of moves) {
        const to = move.to;
        const hrow = 8 - parseInt(to.charAt(1));
        const hcol = to.charAt(0).charCodeAt(0) - 96 - 1;
        this.highlights[hrow][hcol] = true;
      }
    },
    pieceDragEnd() {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          this.highlights[i][j] = false;
        }
      }
    },
    moveChessPiece({ from, to }) {
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

.rotate-board {
  transform: rotate(180deg);
}
</style>
