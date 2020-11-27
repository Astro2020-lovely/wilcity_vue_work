<template>
  <wil-popup
    id="delete-review-popup"
    @close="handleClosePopup"
    :is-loading="isLoading"
    :title="''|filterTranslation('deleteReview')"
    :is-open="true"
    wrapper-classes="popup_module__3M-0- pos-f-full popup_sm__Rc24D popup_mobile-full__1hyc4"
    @submit="handleDeleteReview"
  >
    <template slot="body">
      <wil-block-loading :is-loading="isLoading" />
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <wil-alert v-if="!isDeleted" :msg="''|filterTranslation('confirmDeleteReview')"></wil-alert>
    </template>
  </wil-popup>
</template>
<script lang="javascript">
import { mapState, mapActions } from "vuex";
export default {
  name: "wil-delete-review-popup",
  data() {
    return {
      msg: "",
      msgType: "",
      isLoading: false,
      isDeleted: false
    };
  },
  props: {
    reviewId: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapActions({
      reviewObserver: "ModuleReviews/reviewObserver"
    }),
    handleDeleteReview() {
      this.isLoading = true;
      this.msg = "";

      const data = this.createFormData({
        action: "wilcity_delete_review",
        reviewID: this.reviewId
      });
      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.success) {
            this.msgType = "success";
            this.isDeleted = true;

            const {
              averageRating,
              reviewCategoriesStatistic,
              qualityRating
            } = response.data.data;

            this.reviewObserver({
              status: "delete",
              info: {
                review: {
                  ID: this.reviewId
                },
                averageRating,
                reviewCategoriesStatistic,
                qualityRating
              }
            });
            setTimeout(() => {
              this.handleClosePopup();
            }, 1000);
          } else {
            this.msgType = "error";
          }
        })
        .finally(() => (this.isLoading = false));
    },
    handleClosePopup() {
      this.$emit("close");
    }
  }
};
</script>
