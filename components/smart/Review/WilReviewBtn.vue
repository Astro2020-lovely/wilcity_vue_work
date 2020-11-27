<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    :btn-name="parseBtnName"
    :icon="icon"
    @click="handleOpenPopup"
  >
    <template
      v-if="hasWrapperForIcon === 'yes'"
      v-slot:default="{ btnName, icon }"
    >
      <span class="list_icon__2YpTp">
        <i v-if="icon" :class="icon"></i>
      </span>
      <span
        class="list_text__35R07"
        v-if="btnName.length"
        v-html="btnName"
      ></span>
    </template>
    <template v-slot:after-link>
      <portal to="wil-modal" v-if="isOpenPopup">
        <component
          :is="popupType"
          @close="handleClosePopup"
          :post-id="postId"
          :review="parseReview"
          :review-id="parseReviewID"
        ></component>
      </portal>
    </template>
  </wil-link>
</template>

<script>
export default {
  name: "wil-review-btn",
  data() {
    return {
      isOpenPopup: false
    };
  },
  methods: {
    handleSubmitted(data) {
      this.$emit("submitted", data);
    },
    handleOpenPopup() {
      WilClickHelper.next(() => {
        this.isOpenPopup = true;
      });
    },
    handleClosePopup() {
      this.isOpenPopup = false;
      this.$emit("close");
    }
  },
  computed: {
    parseReviewID() {
      return !_.isUndefined(this.review) && _.isNumber(this.review.ID)
        ? this.review.ID
        : 0;
    },
    parseReview() {
      return this.review ? { ...this.review } : {};
    },
    parseBtnName() {
      if (this.btnName) {
        return this.btnName;
      }

      if (!_.isEmpty(this.review)) {
        return this.$options.filters.filterTranslation(
          "Edit review",
          "editReview"
        );
      } else {
        return this.$options.filters.filterTranslation(
          "Add a review",
          "addReview"
        );
      }
    }
  },
  props: {
    hasWrapperForIcon: {
      type: String,
      default: "no"
    },
    postId: {
      type: Number,
      default: 0,
      required: true
    },
    icon: {
      type: String,
      default: ""
    },
    btnName: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "wil-btn wil-btn--border wil-btn--round wil-btn--sm"
    },
    popupType: {
      type: String,
      default: "wil-review-popup"
    },
    review: {
      // EG: You want to edit a review, We should show up the current review data
      type: Object,
      default: () => {}
    }
  }
};
</script>
