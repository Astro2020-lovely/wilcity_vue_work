<template>
  <div :class="wrapperClasses">
    <wil-heading
      wrapper-classes="add-review_wrap__K1JtF"
      inner-classes="add-review_left__ziIv1"
      left-classes="add-review_title__3ePFu"
      :heading="heading"
    >
      <template v-slot:heading="{ leftClasses, icon, heading }">
        <h3 class="add-review_title__3ePFu">
          <span class="color-primary">{{ total }}</span>
          {{ heading }}
        </h3>
      </template>
      <template v-slot:desc="{ desc }" v-if="!parseIsReviewed">
        <div class="wil-float-right">
          <wil-review-btn
            :post-id="postId"
            wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
            icon="la la-star-o"
            :review="myReview"
          ></wil-review-btn>
        </div>
      </template>
    </wil-heading>
  </div>
</template>
<script>
export default {
  name: "wil-review-total-statistic",
  computed: {
    parseIsReviewed() {
      if (this.isReviewed) {
        return true;
      }

      if (this.userId) {
        return this.$store.getters["ModuleReviews/isUserLeftReview"](
          this.userId
        );
      }

      return false;
    },
    myReview() {
      if (this.userId) {
        return this.$store.getters["ModuleReviews/getUserReviews"](
          this.userId,
          true
        );
      }

      return {};
    },
    total() {
      const total = this.$store.getters["ModuleReviews/countTotal"];
      if (total > 1) {
        return `${total} ${this.$options.filters.filterTranslation(
          "reviewsFor"
        )}`;
      }
      return `${total} ${this.$options.filters.filterTranslation("reviewFor")}`;
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "add-review_module__2KOQC"
    },
    heading: {
      type: String,
      default: ""
    },
    userId: {
      type: Number,
      default: 0
    },
    postId: {
      type: Number,
      required: true
    },
    isReviewed: {
      type: Boolean,
      default: false
    }
  }
};
</script>
