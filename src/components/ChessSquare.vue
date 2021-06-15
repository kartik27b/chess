<template>
  <div
    class="border  h-20 w-20 border-gray-500 flex items-center justify-center transition-colors duration-200"
    ref="square"
    :class="{
      'bg-gray-800': (row + col) % 2,
      'bg-gray-700': !((row + col) % 2),
      'bg-red-600': kill,
      'bg-green-500': highlight && !kill,
      'bg-blue-500': onOver,
      'bg-yellow-400': inCheck,
    }"
  >
    <promote
      v-if="promotion"
      :promotion="promotion"
      @make-promotion="$emit('make-promotion', $event)"
    ></promote>

    <chess-piece
      :rotate="rotate"
      :piece="piece"
      :row="row"
      :col="col"
      v-else-if="piece"
      @piece-dragged="$emit('piece-dragged', $event)"
      @piece-drag-end="$emit('piece-drag-end')"
    ></chess-piece>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

// import { PAWN } from "src/game";
import { PieceDataType } from "./ChessPiece.vue";
import ChessPiece from "./ChessPiece.vue";
import { getPosition } from "./utils";
import Promote from "./Promote.vue";

export default {
  name: "chess-square",
  props: [
    "row",
    "col",
    "piece",
    "pendingPromotion",
    "highlight",
    "rotate",
    "checkProp",
  ],
  components: {
    ChessPiece,
    Promote,
  },
  watch: {
    pendingPromotion(val) {
      if (val && val.to === getPosition(this.row, this.col)) {
        this.promotion = val;
      } else {
        this.promotion = null;
      }
    },
  },
  mounted() {
    this.enableDrop();
    if (
      this.pendingPromotion &&
      this.pendingPromotion.to === this.getPosition(this.row, this.col)
    ) {
      this.promotion = this.pendingPromotion;
    } else {
      this.promotion = null;
    }
  },
  computed: {
    kill() {
      return this.highlight && this.piece;
    },
    inCheck() {
      if (
        this.checkProp &&
        this.piece &&
        this.piece.type === "k" &&
        this.checkProp.turn === this.piece.color
      ) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      onOver: false,
      promotion: null,
      // kill: false,
    };
  },
  methods: {
    enableDrop() {
      const square = this.$refs.square;
      square.addEventListener("dragenter", this.handleDragEnter);
      square.addEventListener("dragover", this.handleDragOver);
      square.addEventListener("drop", this.handleDrop);
      square.addEventListener("dragleave", this.handleDragLeave);
    },

    handleDragEnter(event) {
      if (event.dataTransfer.types.includes[PieceDataType]) {
        event.preventDefault();
      }
    },
    handleDragLeave(event) {
      this.onOver = false;
    },
    handleDragOver(event) {
      this.onOver = true;
      // console.log("drag over");
      event.dataTransfer.dropEffect = "move";
      event.preventDefault();
    },
    handleDrop(event) {
      this.onOver = false;
      const data = event.dataTransfer.getData(PieceDataType);
      //   console.log(event.dataTransfer.items);
      // console.log("from", data, " to", getPosition(this.row, this.col));
      // console.log(data);
      this.$emit("piece-moved", {
        from: data,
        to: getPosition(this.row, this.col),
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
