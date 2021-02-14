<template>
  <!-- <div>Promote</div> -->
  <div class="w-16 h-16 flex flex-wrap ">
    <div
      v-for="(piece, i) in promotionPieces"
      :key="i"
      class="w-1/2 h-1/2 rounded-sm cursor-pointer bg-white flex items-center justify-center font-bold text-sm shadow-xl"
      @click="$emit('make-promotion', getPromotionPayload(piece))"
    >
      {{ piece }}
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
