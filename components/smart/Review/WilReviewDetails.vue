<template>
  <div :class="parseWrapperClasses">
    <template v-for="item in items">
      <slot :item="item"></slot>
    </template>
  </div>
</template>
<style scoped>
.wil-rating-item-md-2 .average-rating-info_item__2yvNR {
  width: 60%;
}

.wil-rating-item-md-3 .average-rating-info_item__2yvNR {
  width: 40%;
}

.wil-rating-item-md-4 .average-rating-info_item__2yvNR {
  width: 30%;
}

.wil-rating-item-md-6 .average-rating-info_item__2yvNR {
  width: 20%;
}
</style>
<script>
export default {
  type: "wil-review-details",
  props: {
    items: {
      type: [Object, Array],
      default: () => []
    },
    wrapperClasses: {
      type: String,
      default: "average-rating-info_right__3xLnz"
    }
  },
  computed: {
    parseWrapperClasses() {
      const totalItems = this.items.length;
      if (totalItems % 2 === 0) {
        return `${this.wrapperClasses} wil-rating-item-md-2`;
      }

      if (totalItems % 3 === 0) {
        return `${this.wrapperClasses} wil-rating-item-md-4`;
      }

      if (totalItems % 4 === 0) {
        return `${this.wrapperClasses} wil-rating-item-md-3`;
      }

      if (totalItems % 6 === 0) {
        return `${this.wrapperClasses} wil-rating-item-md-2`;
      }

      return this.wrapperClasses;
    }
  }
};
</script>
