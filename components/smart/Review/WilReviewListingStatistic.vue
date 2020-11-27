<template>
  <!-- content-box_module__333d9 -->
  <div class="content-box_module__333d9" v-if="reviewDetails.length">
    <wil-heading :heading="heading" icon="la la-star-o" />

    <div class="content-box_body__3tSRB">
      <!-- average-rating-info_module__TOHeu -->
      <div class="average-rating-info_module__TOHeu">
        <div class="average-rating-info_left__255Tl">
          <!-- rated-small_module__1vw2B -->
          <wil-review-average-rating
            :mode="reviews.mode"
            :quality="reviews.quality"
            :average-rating="reviews.average"
          />
          <!-- End / rated-small_module__1vw2B -->
        </div>
        <wil-review-details :items="reviewDetails">
          <template v-slot:default="{ item }">
            <wil-review-detail :item="item" :mode="reviews.mode" />
          </template>
        </wil-review-details>
      </div>
      <!-- End / average-rating-info_module__TOHeu -->
    </div>
    <footer v-if="!isUserReviewed" class="content-box_footer__kswf3">
      <wil-review-btn
        wrapper-classes="content-box_link__2K0Ib wil-text-center"
        icon="la la-star-o"
        has-wrapper-for-icon="no"
        :post-id="postId"
        :btn-name="'' | filterTranslation('addReview')"
      />
    </footer>
  </div>
  <!-- End / content-box_module__333d9 -->
</template>
<script>
export default {
  name: "wil-review-listing-statistic",
  data() {
    return {
      isOpenReviewPopup: false
    };
  },
  components: {
    WilReviewAverageRating: () =>
      import(
        /* webpackChunkName: "WilReviewAverageRating" */
        /* webpackPreload: true */
        "./../../dumbs/review/WilReviewAverageRating.vue"
      ),
    WilReviewDetails: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilReviewDetails" */
        "./WilReviewDetails.vue"
      ),
    WilReviewDetail: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilReviewDetails" */
        "./../../dumbs/review/WilReviewDetail.vue"
      )
  },
  props: {
    postId: {
      type: Number,
      required: true
    },
    heading: {
      type: String,
      default: ""
    },
    addReviewBtnName: {
      type: String,
      default: ""
    },
    reviews: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    reviewDetails() {
      if (this.reviews.aDetails) {
        return [...this.reviews.aDetails];
      }

      if (this.reviews.details) {
        return [...this.reviews.aDetails];
      }

      return [];
    },
    isUserReviewed() {
      return this.reviews.isUserReviewed === "yes";
    }
  },
  methods: {
    toggleReviewPopup() {
      this.isOpenReviewPopup = !this.isOpenReviewPopup;
    }
  }
};
</script>
