<template>
  <div :class="wrapperClasses">
    <div class="rated-small_wrap__2Eetz" :data-rated="parseAverageRating">
      <div class="rated-small_overallRating__oFmKR">{{ averageRating }}</div>
      <div class="rated-small_ratingWrap__3lzhB">
        <div class="rated-small_maxRating__2D9mI">{{ mode }}</div>
        <div class="rated-small_ratingOverview__2kCI_">{{ quality }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-review-average-rating",
  computed: {
    parseAverageRating() {
      if (this.mode === 5) {
        return parseFloat(this.averageRating) * 2;
      }
      return this.averageRating;
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "rated-small_module__1vw2B"
    },
    averageRating: {
      type: Number,
      default: 0
    },
    mode: {
      type: Number, // 5 or 10
      default: 0
    },
    quality: {
      type: String,
      default: ""
    }
  }
};
</script>
