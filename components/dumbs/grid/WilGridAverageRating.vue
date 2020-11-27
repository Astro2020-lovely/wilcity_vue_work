<template>
  <div v-if="post.oReviews && post.oReviews.average > 0" :class="wrapperClasses">
    <wil-review-average-rating
      :average-rating="post.oReviews.average"
      :mode="post.oReviews.mode"
      :quality="post.oReviews.quality"
    />
  </div>
</template>
<script>
export default {
  name: "wil-grid-average-rating",
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "listing_rated__1y7qV"
    }
  },
  components: {
    WilReviewAverageRating: () =>
      import(
        /*webpackPreload: true */
        /*webpackChunkName: "WilReviewAverageRating"*/
        "./../review/WilReviewAverageRating.vue"
      )
  }
};
</script>
