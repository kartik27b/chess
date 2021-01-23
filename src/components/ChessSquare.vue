<template>
  <div
    class="bg-blue-100 border h-20 w-20 border-gray-500 flex items-center justify-center"
    ref="square"
  >
    <chess-piece v-if="piece" :piece="piece"></chess-piece>
  </div>
</template>

<script>
import { PieceDataType } from "./ChessPiece.vue";
import ChessPiece from "./ChessPiece.vue";

export default {
  name: "chess-square",
  props: ["piece"],
  components: {
    ChessPiece,
  },
  mounted() {
    this.enableDrop();
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
      console.log(data);
      this.$emit("piece-moved", data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
