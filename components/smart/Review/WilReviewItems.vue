<template>
  <div :id="id" :class="[wrapperClasses, 'pos-r', isShowEmpty ? 'wil-reviews-tab' : '']">
    <slot name="before-review-items"></slot>
    <content-placeholders v-if="isLoading">
      <content-placeholders-heading :img="false" />
      <content-placeholders-text :lines="3" />
    </content-placeholders>
    <wil-alert v-if="isShowMsg" :msg="msg" :type="msgType" />
    <div v-if="reviews.length || isShowEmpty">
      <template v-for="review in reviews">
        <slot :review="review"></slot>
      </template>
      <slot name="after-review-items"></slot>
      <wil-link
        v-if="parseLoadMore"
        :is-loading="isLoadingMore"
        wrapper-classes="wil-btn wil-btn--primary2 wil-btn--round wil-btn--md wil-btn--block"
        :btn-name="''|filterTranslation('seeMoreReview')"
        @click="handleLoadMore"
      />
    </div>
  </div>
</template>
<style scoped>
.wil-reviews-tab {
  min-height: 200px;
}
</style>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "wil-review-items",
  data() {
    return {
      args: {
        action: "wil_fetch_reviews"
      },
      msg: "",
      msgType: "",
      isLoading: false,
      isLoadingMore: false,
      page: 1
    };
  },
  computed: {
    ...mapGetters({
      reviews: "ModuleReviews/getAll",
      maxPages: "ModuleReviews/getMaxPages"
    }),
    parseLoadMore() {
      if (!this.isLoadmore) {
        return false;
      }
      return this.maxPages > this.page + 1;
    },
    isShowMsg() {
      if (!this.isShowEmpty) {
        return false;
      }

      if (!this.msg.length) {
        return false;
      }

      if (this.msgType !== "success" && this.reviews.length) {
        return false;
      }

      return true;
    }
  },
  created() {
    this.args = {
      ...this.args,
      postsPerPage: this.postsPerPage,
      page: this.page,
      parentID: this.postId,
      action: this.ajaxAction
    };

    // We should not fetch review If the review is showing on the both tabs and homepage
    if (!this.reviews.length) {
      this.fetchReviews();
    }
  },
  watch: {
    page(page) {
      this.args = {
        ...this.args,
        page
      };
      this.fetchReviews();
    },
    postsPerPage(postsPerPage) {
      this.args = {
        ...this.args,
        postsPerPage
      };
    }
  },
  props: {
    ajaxAction: {
      type: String,
      default: "wil_fetch_reviews"
    },
    alwaysReturnReview: {
      type: String,
      default: "no"
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      required: true
    },
    postId: {
      type: Number,
      required: true
    },
    postsPerPage: {
      type: Number,
      default: 5
    },
    isShowEmpty: {
      type: Boolean, // Showing "There is no review message if We found no review currently"
      default: false
    },
    isLoadmore: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions("ModuleReviews", [
      "setModeRating",
      "reviewObserver",
      "setTotalReviews",
      "setMaxPages"
    ]),
    handleLoadMore() {
      this.isLoadingMore = true;
      this.page = this.page + 1;
    },
    fetchReviews() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          ...this.args,
          alwaysReturnReview: this.alwaysReturnReview
        })
      })
        .then(response => {
          if (response.data.success) {
            const {
              reviews,
              maxPages,
              total,
              averageRating,
              reviewCategoriesStatistic,
              modeRating,
              qualityRating
            } = response.data.data;

            this.reviewObserver({
              status: "add",
              info: {
                reviews,
                maxPages,
                total,
                averageRating,
                reviewCategoriesStatistic,
                qualityRating
              }
            });

            this.setModeRating(response.data.data.modeRating);
            this.setTotalReviews(response.data.data.total);
            this.setMaxPages(response.data.data.maxPages);

            if (response.data.data.msg) {
              this.msg = response.data.data.msg;
            }
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "success";
            this.icon = "fa fa-smile";
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isLoadingMore = false;
        });
    }
  }
};
</script>
