<template>
  <div
    :class="{
      'bg-black text-white': piece.color === 'b',
      'bg-white text-black': piece.color === 'w',
    }"
    class="w-14 h-14 rounded-md flex items-center justify-center font-bold text-sm shadow-xl"
    ref="piece"
  >
    <!-- {{ piece.type }} -->
    {{ piece.type }}
  </div>
</template>

<script>
export const PieceDataType = "text/x-kanban-card";

export default {
  name: "chess-piece",
  props: ["piece", "whiteTurn"],
  mounted() {
    this.setDraggable();
  },
  methods: {
    handleDragStart(event) {
      const dataTransfer = event.dataTransfer;

      dataTransfer.setData("type", this.piece.type);
      dataTransfer.setData("color", this.piece.color);
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
