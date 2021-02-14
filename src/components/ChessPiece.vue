<template>
  <div
    class="w-14 h-14 rounded-md flex items-center justify-center font-bold text-sm "
    ref="piece"
  >
    <img :src="getImage()" alt="" class="w-5/6 h-5/6" />
    <!-- {{ piece.type }} -->
  </div>
</template>

<script>
export const PieceDataType = "text/x-kanban-card";
import { getPosition } from "./utils";
export default {
  name: "chess-piece",
  props: ["piece", "row", "col"],
  mounted() {
    this.setDraggable();
  },
  methods: {
    getImage() {
      const type = this.piece.type;
      let name = "";
      if (type === "b") {
        name = "bishop";
      } else if (type === "r") {
        name = "rook";
      } else if (type === "n") {
        name = "knight";
      } else if (type === "p") {
        name = "pawn";
      } else if (type === "q") {
        name = "queen";
      } else if (type === "k") {
        name = "king";
      }
      const color = this.piece.color;
      // eslint-disable-next-line no-unused-vars
      const filename = color + "_" + name + "_1x_ns.png";
      // return "../pics/" + filename;
      return require("../pics/" + filename);
    },
    handleDragStart(event) {
      const dataTransfer = event.dataTransfer;
      dataTransfer.setData(PieceDataType, getPosition(this.row, this.col));
      dataTransfer.effectAllowed = "move";
      event.target.style.opacity = 0.2;
    },
    handleDragEnd(event) {
      event.target.style.opacity = 1;
    },
    setDraggable() {
      const piece = this.$refs.piece;
      piece.draggable = true;
      piece.addEventListener("dragstart", this.handleDragStart);
      piece.addEventListener("dragend", this.handleDragEnd);
    },
  },
};
</script>

<style scoped></style>
