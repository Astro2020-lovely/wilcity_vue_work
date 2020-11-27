<template>
  <wil-popup
    id="write-a-review-popup"
    @close="handleClosePopup"
    :is-open="true"
    :is-loading="isSubmitting"
    @submit="handleSubmitReview"
    :title="parseTitle"
  >
    <template slot="body" class="pos-r">
      <wil-block-loading :is-loading="isSubmitting" />
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <div v-if="!isSubmitted">
        <template v-if="reviewCategories.length">
          <wil-slider-range
            v-for="item in reviewCategories"
            :key="`review-category-${item.key}`"
            :maximum="mode"
            :minimum="1"
            :label="item.name"
            :value="getReviewCategory(item.key)"
            :direction="sliderDirection"
            v-on="{ change: handleReviewCategoryChange(item.key) }"
          />
        </template>
        <div class="wil-divider bg-color-gray-1 mt-20 mb-20"></div>
        <wil-input
          :label="'' | filterTranslation('reviewTitle')"
          :is-required="true"
          :value="reviewData.title"
          v-on="{ change: handleFieldChange('title') }"
        />
        <wil-textarea
          :label="'' | filterTranslation('content')"
          :is-required="true"
          :value="cleanContent(reviewData.content)"
          v-on="{ change: handleFieldChange('content') }"
        />
        <wil-uploader
          v-if="isGalleryAllowed"
          :maximum-items="20"
          :value="reviewData.gallery ? reviewData.gallery : []"
          v-on="{ change: handleFieldChange('gallery') }"
        />
      </div>
    </template>
  </wil-popup>
</template>
<script>
import WilSliderRange from "./../../dumbs/WilSliderRange.vue";
import WilUploader from "./../../dumbs//uploads/WilUploader.vue";
import { mapActions } from "vuex";

export default {
  name: "wil-review-popup",
  data() {
    return {
      reviewCategories: [],
      mode: 0,
      isGalleryAllowed: false,
      msg: "",
      msgType: "",
      isSubmitting: false,
      isSubmitted: false,
      reviewData: {},
      reviewId: 0
    };
  },
  created() {
    // maybe event discussion
    if (
      typeof WILCITY_REVIEW_SETTINGS !== "undefined" &&
      !_.isEmpty(WILCITY_REVIEW_SETTINGS)
    ) {
      this.reviewCategories = [...WILCITY_REVIEW_SETTINGS.details];
      this.mode = parseInt(WILCITY_REVIEW_SETTINGS.mode, 10);
      this.isGalleryAllowed =
        WILCITY_REVIEW_SETTINGS.isGalleryAllowed === "enable";
    }
    this.setReviewData();
  },
  props: {
    postId: {
      type: Number,
      required: true
    },
    review: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    WilSliderRange,
    WilUploader
  },
  computed: {
    parseTitle() {
      if (_.isNumber(this.reviewId) && this.reviewId !== 0) {
        return this.$options.filters.filterTranslation("", "editReview");
      }

      return this.$options.filters.filterTranslation("", "leaveAReview");
    },
    sliderDirection() {
      if (WILOKE_INLINE_GLOBAL.isRTL === "yes") {
        return "rtl";
      }

      return "ltr";
    }
  },
  methods: {
    ...mapActions({
      reviewObserver: "ModuleReviews/reviewObserver"
    }),
    cleanContent(content) {
      return !_.isEmpty(content) ? wilTextClean.clean(content) : content;
    },
    updateFrontEndReview(data) {
      let status = "update";
      let ID = this.reviewId;
      let {
        review,
        averageRating,
        reviewCategoriesStatistic,
        qualityRating
      } = data;
      if (this.reviewId === 0) {
        ID = parseInt(data.reviewID, 10);
        status = "prepend";
      }
      review = { ID, ...this.reviewData, ...review };
      this.reviewObserver({
        info: {
          review,
          averageRating,
          reviewCategoriesStatistic,
          qualityRating
        },
        status
      });
    },
    setReviewData() {
      this.reviewData = { ...this.review };
      if (
        !_.isUndefined(this.review.details) &&
        !_.isEmpty(this.review.details)
      ) {
        const details = this.review.details.reduce((accumolator, item) => {
          return { ...accumolator, [item.key]: item.score };
        }, {});

        this.reviewData = {
          ...this.reviewData,
          details
        };
      }

      this.reviewId = !_.isUndefined(this.reviewData.ID)
        ? this.reviewData.ID
        : 0;
    },
    getReviewCategory(key) {
      if (this.reviewData.details) {
        return this.reviewData.details[key];
      }
      return this.mode;
    },
    handleReviewCategoryChange(category) {
      return val => {
        const details = this.reviewData.details
          ? { ...this.reviewData.details, [category]: val }
          : {
              [category]: val
            };

        this.reviewData = {
          ...this.reviewData,
          details: {
            ...this.reviewData.details,
            ...details
          }
        };
      };
    },
    handleFieldChange(key) {
      return val => {
        this.reviewData = {
          ...this.reviewData,
          [key]: val
        };
      };
    },
    handleClosePopup() {
      this.$emit("close");
    },
    handleSubmitReview(event) {
      this.msg = "";
      this.isSubmitting = true;
      const formData = this.createFormData({
        action: "wilcity_submit_review",
        postID: this.postId,
        reviewID: this.reviewId,
        data: JSON.stringify(this.reviewData)
      });

      Vue.axios({
        url: WILOKE_GLOBAL.ajaxurl,
        method: "POST",
        data: formData
      })
        .then(response => {
          const data = response.data.data;
          if (!response.data.success) {
            this.msg = data.msg;
            this.msgType = "danger";
          } else {
            this.msg = data.msg;
            this.msgType = "success";
            this.$emit("submitted", response.data.data);
            this.updateFrontEndReview(response.data.data);
            setTimeout(() => {
              this.handleClosePopup();
            }, 3000);
          }
        })
        .finally(() => (this.isSubmitting = false));
    }
  }
};
</script>
