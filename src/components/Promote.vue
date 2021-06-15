<template>
  <!-- <div>Promote</div> -->
  <div class="w-16 h-16 flex flex-wrap ">
    <div
      v-for="(piece, i) in promotionPieces"
      :key="i"
      class="w-1/2 h-1/2 rounded-sm cursor-pointer bg-white flex items-center justify-center font-bold text-sm shadow-xl"
      @click="$emit('make-promotion', getPromotionPayload(piece))"
    >
      <!-- {{ piece }} -->
      <img :src="getImage(piece)" alt="" class="w-1/2 h-1/2" />
    </div>
  </div>
</template>

<script>
const promotionPieces = ["r", "n", "b", "q"];

export default {
  name: "promote",
  props: ["promotion"],
  data() {
    return {
      promotionPieces,
    };
  },
  methods: {
    getImage(piece) {
      // const type = this.piece.type;
      const type = piece;
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
      // const color = this.piece.color;
      // eslint-disable-next-line no-unused-vars
      const filename = "w" + "_" + name + "_1x_ns.png";
      // return "../pics/" + filename;
      return require("../pics/" + filename);
    },
    getPromotionPayload(piece) {
      return {
        piece,
        from: this.promotion.from,
        to: this.promotion.to,
      };
    },
  },
};
</script>

<style></style>
