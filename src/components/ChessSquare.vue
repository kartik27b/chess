<template>
  <div
<<<<<<< HEAD
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
=======
    class="bg-blue-100 border h-20 w-20 border-gray-500 flex items-center justify-center"
    ref="square"
  >
    <chess-piece v-if="piece" :piece="piece"></chess-piece>
>>>>>>> parent of e400348... before adding own logic
  </div>
</template>

<script>
<<<<<<< HEAD
/* eslint-disable no-unused-vars */

// import { PAWN } from "src/game";
// import { PieceDataType } from "./ChessPiece.vue";
=======
import { PieceDataType } from "./ChessPiece.vue";
>>>>>>> parent of e400348... before adding own logic
import ChessPiece from "./ChessPiece.vue";

export default {
  name: "chess-square",
<<<<<<< HEAD
  props: ["row", "col", "tile"],
=======
  props: ["piece"],
>>>>>>> parent of e400348... before adding own logic
  components: {
    ChessPiece,
  },
  mounted() {
    this.enableDrop();
  },
<<<<<<< HEAD
  data() {
    return {
      // onOver: false,
    };
  },
  computed: {
    // pieceType(){
    // }
  },
=======
>>>>>>> parent of e400348... before adding own logic
  methods: {
    pieceClicked() {
      this.$emit("piece-clicked", { row: this.row, col: this.col });
    },
    enableDrop() {
      const square = this.$refs.square;
      square.addEventListener("dragenter", this.handleDragEnter);
      square.addEventListener("dragover", this.handleDragOver);
      square.addEventListener("drop", this.handleDrop);
    },

    handleDragEnter(event) {
      if (event.dataTransfer.types.includes[PieceDataType]) {
        event.preventDefault();
      }
    },
    handleDragOver(event) {
      event.dataTransfer.dropEffect = "move";
      event.preventDefault();
    },
    handleDrop(event) {
      const data = event.dataTransfer.getData(PieceDataType);
      //   console.log(event.dataTransfer.items);
      console.log(data);
      this.$emit("piece-moved", data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
