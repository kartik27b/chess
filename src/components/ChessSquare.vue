<template>
  <div
    class="border h-20 w-20 border-gray-500 flex items-center justify-center transition-colors duration-200"
    :class="{
      'bg-green-500': tile.highlighted,
      'bg-gray-700': !tile.highlighted,
    }"
    ref="square"
  >
    <!-- {{ tile.pieceType }}
    {{ tile.team }} -->
    <!-- <chess-piece
      v-if="piece"
      :piece="piece"
      :whiteTurn="whiteTurn"
    ></chess-piece> -->
    <chess-piece
      :piece="tile"
      v-if="tile.pieceType !== -1"
      @click="pieceClicked"
    ></chess-piece>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

// import { PAWN } from "src/game";
// import { PieceDataType } from "./ChessPiece.vue";
import ChessPiece from "./ChessPiece.vue";

export default {
  name: "chess-square",
  props: ["row", "col", "tile"],
  components: {
    ChessPiece,
  },
  mounted() {
    this.enableDrop();
  },
  data() {
    return {
      // onOver: false,
    };
  },
  computed: {
    // pieceType(){
    // }
  },
  methods: {
    pieceClicked() {
      this.$emit("piece-clicked", { row: this.row, col: this.col });
    },
    enableDrop() {
      const square = this.$refs.square;
      square.addEventListener("dragenter", this.handleDragEnter);
      square.addEventListener("dragover", this.handleDragOver);
      square.addEventListener("dragleave", this.handleDragLeave);
      square.addEventListener("drop", this.handleDrop);
    },
    handleDragLeave(event) {
      event.preventDefault();
      this.onOver = false;
    },
    handleDragEnter(event) {
      event.preventDefault();
      this.onOver = true;
      // if (event.dataTransfer.types.includes[PieceDataType]) {
      //   event.preventDefault();
      // }
    },
    handleDragOver(event) {
      event.dataTransfer.dropEffect = "move";
      event.preventDefault();
      this.onOver = true;
    },
    handleDrop(event) {
      this.onOver = false;
      const type = event.dataTransfer.getData("type");
      const color = event.dataTransfer.getData("color");
      //   console.log(event.dataTransfer.items);
      console.log(color);
      console.log(type);
      this.$emit("piece-moved", { type, color, row: this.row, col: this.col });
    },
  },
};
</script>

<style lang="scss" scoped></style>
