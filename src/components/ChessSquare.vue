<template>
  <div
    class="border  h-20 w-20 border-gray-500 flex items-center justify-center transition-colors duration-200"
    ref="square"
    :class="{
      'bg-gray-800': (row + col) % 2,
      'bg-gray-700': !((row + col) % 2),
    }"
  >
    <promote
      v-if="promotion"
      :promotion="promotion"
      @make-promotion="$emit('make-promotion', $event)"
    ></promote>
    <chess-piece
      :piece="piece"
      :row="row"
      :col="col"
      v-else-if="piece"
    ></chess-piece>
    <!-- <promote v-else-if="promotion"></promote> -->
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
  props: ["row", "col", "piece", "pendingPromotion"],
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
  data() {
    return {
      // onOver: false,
      promotion: null,
    };
  },
  methods: {
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
