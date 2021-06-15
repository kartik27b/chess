<template>
  <div
    class="w-14 h-14 rounded-md flex items-center justify-center font-bold text-sm transition-transform duration-300 "
    ref="piece"
    :class="{ 'rotate-piece': rotate }"
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
  props: ["piece", "row", "col", "rotate"],
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
      this.$emit("piece-dragged", {
        position: getPosition(this.row, this.col),
        row: this.row,
        col: this.col,
      });
    },
    handleDragEnd(event) {
      event.target.style.opacity = 1;
      this.$emit("piece-drag-end", {
        position: getPosition(this.row, this.col),
        row: this.row,
        col: this.col,
      });
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

<style scoped>
.rotate-piece {
  transform: rotate(180deg);
}
</style>
