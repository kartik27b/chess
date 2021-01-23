<template>
  <div
    draggable="true"
    class="w-14 h-14 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-sm"
    ref="piece"
  >
    {{ piece.type }}
  </div>
</template>

<script>
export const PieceDataType = "text/x-kanban-card";

export default {
  name: "chess-piece",
  props: ["piece"],
  mounted() {
    this.setDraggable();
  },
  methods: {
    handleDragStart(event) {
      const dataTransfer = event.dataTransfer;

      dataTransfer.setData(PieceDataType, this.piece.id);
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
