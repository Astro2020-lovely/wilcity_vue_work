<template>
  <div :class="wrapperClasses">
    <span :class="titleClasses" v-html="item.name"></span>
    <!-- rated-small_module__1vw2B -->
    <div :class="innerClasses">
      <div class="rated-small_wrap__2Eetz" :data-rated="detailDataRated">
        <div class="rated-small_overallRating__oFmKR">
          {{ item.average }}/{{ mode }}
        </div>
      </div>
    </div>
    <!-- End / rated-small_module__1vw2B -->
  </div>
</template>
<script>
export default {
  name: "wil-review-detail",
  computed: {
    detailDataRated() {
      if (this.mode == 5) {
        return parseFloat(this.item.average) * 2;
      }
      return this.item.average;
    }
  },
  props: {
    mode: {
      type: Number,
      default: 5
    },
    item: {
      type: Object,
      default: {}
    },
    wrapperClasses: {
      type: String,
      default: "average-rating-info_item__2yvNR"
    },
    titleClasses: {
      type: String,
      default: "average-rating-info_text__3Cq-a"
    },
    innerClasses: {
      type: String,
      default: "rated-small_module__1vw2B rated-small_style-4__VTQSw"
    }
  }
};
</script>
