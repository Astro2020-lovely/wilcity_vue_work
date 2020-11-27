<template>
  <div :id="parseId" :class="wrapperClasses" v-click-outside="hideDropdownStatus">
    <slot
      :item="review"
      :can-do-anything="canDoAnything"
      :is-discussion-allowed="isDiscussionAllowed"
      name="wil-review-item-before-item"
    ></slot>
    <div class="comment-review_header__1si3M">
      <wil-review-author-info :author="review.author" />
      <div class="comment-review_abs__9mb1G pos-a-center-right">
        <span :class="stickyClasses">
          <i class="la la-thumb-tack"></i>
        </span>

        <wil-review-average-rating
          v-if="review.average !== 0"
          :average-rating="review.average"
          :mode="review.mode"
          :quality="review.quality"
        />

        <wil-buttons-dropdown :is-active="isDropdownActive" @change="toggleDropdownStatus">
          <wil-lists
            :items="parseDropdownItems"
            wrapper-classes="list_module__1eis9 list-none list_small__3fRoS list_abs__OP7Og arrow--top-right"
            inner-classes="list_item__3YghP"
            :has-wrap-for-icon="true"
          >
            <template v-slot:list-item="{item}">
              <component
                :is="item.component"
                :wrapper-classes="item.wrapperClasses"
                has-wrapper-for-icon="yes"
                span-classes="list_text__35R07"
                :btn-name="item.btnName"
                :post-id="review.parentID"
                :icon="item.icon"
                :review-id="review.ID"
                :popup-type="item.popupComponent"
                :review="review"
                @click="handleBtnClick(item)"
                @close="hideDropdownStatus"
              />
            </template>
          </wil-lists>
        </wil-buttons-dropdown>
      </div>
    </div>

    <div class="comment-review_body__qhUqq">
      <div class="comment-review_content__1jFfZ">
        <h3 class="comment-review_title__2WbAh" v-html="review.title"></h3>
        <div :class="reviewContentClasses">
          <div v-html="review.content"></div>
          <wil-gallery
            wrapper-classes="comment-review_gallery__2Tyry row"
            column-classes="col-xs-12 col-sm-3"
            :maxium-preview-items="4"
            :items="review.gallery"
          />
        </div>
        <wil-link
          v-if="!isNoMoreLess"
          :wrapper-classes="showMoreLessClasses"
          :btn-name="showMoreBtnName"
          @click="toggleShowMoreLess"
        />
      </div>
      <div class="comment-review_meta__1chzm">
        <span>{{printLiked}}</span>
        <span v-if="isDiscussionAllowed">{{printNumberOfComments}}</span>
        <span>{{printCountShared}}</span>
      </div>
    </div>

    <footer class="comment-review_footer__3XR0_">
      <slot
        :item="review"
        :can-do-anything="canDoAnything"
        :is-discussion-allowed="isDiscussionAllowed"
        name="wil-review-item-before-footer"
      ></slot>
      <div class="comment-review_btnGroup__1PqPh">
        <div
          v-for="item in parseFooterItems"
          class="comment-review_btn__32CMP"
          :key="`wil-review-footer-${reviewId}-${item.type}`"
        >
          <component
            :is="item.component"
            :wrapper-classes="footerItemWrapperClasses(item)"
            btn-classes="'no-style'"
            :icon="item.icon"
            :btn-name="item.btnName"
            :socials="socialsSharing"
            :settings="socialSharingInfo"
            @click="handleBtnClick(item)"
          ></component>
        </div>
      </div>
      <slot
        :item="review"
        :can-do-anything="canDoAnything"
        :is-discussion-allowed="isDiscussionAllowed"
        name="wil-review-item-after-footer"
      ></slot>
    </footer>
    <slot
      :item="review"
      :can-do-anything="canDoAnything"
      :is-discussion-allowed="isDiscussionAllowed"
      name="wil-review-item-after-item"
    ></slot>
  </div>
</template>
<style scoped>
/deep/ .listing-detail_shareContent__2nr-2 {
  z-index: 999;
}
</style>
<script lang="javascript">
import { ShowTextMoreLess } from "./../../../mixins/TextHelper";
import ScrollHelper from "./../../../mixins/ScrollHelper";
import WilReviewAuthorInfo from "./WilReviewAuthorInfo.vue";
import { mapActions } from "vuex";

export default {
  name: "wil-review-item",
  mixins: [ShowTextMoreLess, ScrollHelper],
  data() {
    return {
      isDropdownActive: false
    };
  },
  created() {},
  components: {
    WilReviewAverageRating: () =>
      import(
        /*webpackChunkName: "WilReviewAverageRating"*/
        /*webpackPreload: true*/
        "./../../dumbs/review/WilReviewAverageRating.vue"
      ),
    WilReviewAuthorInfo
  },
  props: {
    id: {
      type: String,
      required: true
    },
    socialsSharing: {
      type: Array,
      default: () => []
    },
    reviewId: {
      type: Number,
      required: true
    },
    order: {
      type: String,
      default: ""
    },
    review: {
      type: Object,
      default: () => {}
    },
    canDoAnything: {
      type: Boolean,
      default: false
    },
    isAllowReported: {
      type: Boolean,
      default: false
    },
    isDiscussionAllowed: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      default: "comment-review_module__-Z5tr"
    }
  },
  computed: {
    socialSharingInfo() {
      return {
        postID: this.review.ID,
        title: this.review.title,
        content: this.review.content,
        link: this.review.link
      };
    },
    countShared() {
      return this.review.countShared;
    },
    countDiscussion() {
      return this.review.countDiscussion;
    },
    countLiked() {
      return this.review.countLiked;
    },
    isLiked() {
      return this.review.isLiked === "yes";
    },
    parseId() {
      return `${this.id}-${this.review.ID}`;
    },
    isPintToTop() {
      return this.review.isPintToTop === "yes";
    },
    reviewContentClasses() {
      let classes = `wilcity-review-content wilcity-review-content-${this.review.ID}`;
      if (!this.isNoMoreLess && !this.isShowMore) {
        classes = `${classes} wilcity-text-show-less`;
      }

      return classes;
    },
    parseDropdownItems() {
      let items = [];
      if (this.isAllowReported) {
        items = [
          ...items,
          {
            component: "wil-report-btn",
            type: "report",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            icon: "la la-flag-o",
            btnName: this.$options.filters.filterTranslation("", "reportReview")
          }
        ];
      }

      if (this.review.isParentAuthor === "yes" || this.canDoAnything) {
        let btnName = "pinToTopOfReview";
        let icon = "la la-thumb-tack";
        if (this.isPintToTop) {
          btnName = "unPinToTopOfReview";
        }

        items = [
          ...items,
          {
            component: "wil-link",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            type: "pinttotop",
            icon: "la la-thumb-tack",
            btnName: this.$options.filters.filterTranslation("", btnName)
          }
        ];
      }

      if (this.review.isAuthor === "yes") {
        items = [
          ...items,
          {
            component: "wil-review-btn",
            popupComponent: "wil-review-popup",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            type: "edit",
            icon: "la la-edit",
            btnName: this.$options.filters.filterTranslation("", "editReview")
          }
        ];
      }

      if (this.review.isAuthor === "yes" || this.canDoAnything) {
        items = [
          ...items,
          {
            component: "wil-review-btn",
            popupComponent: "wil-delete-review-popup",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            type: "delete",
            icon: "la la-trash",
            btnName: this.$options.filters.filterTranslation("", "delete")
          }
        ];
      }

      return items;
    },
    parseFooterItems() {
      let items = [
        {
          type: "like",
          component: "wil-link",
          btnName: this.likeText,
          icon: "la la-thumbs-up"
        }
      ];

      items = [
        ...items,
        {
          type: "socialSharing",
          btnName: this.$options.filters.filterTranslation("", "share"),
          component: "wil-social-sharing-btn",
          icon: "la la-share-square-o"
        }
      ];
      return items;
    },
    stickyClasses() {
      let classes = "comment-review_sticky__3iQ8y color-primary fs-20 v-middle";
      return this.isPintToTop
        ? `${classes} d-inline-block`
        : `${classes} visible-hidden`;
    },
    deleteReviewClass() {
      return (
        "list_link__2rDA1 text-ellipsis color-primary--hover wilcity-edit-review wilcity-delete-review-" +
        this.review.ID
      );
    },
    likeText() {
      return this.countLiked > 1
        ? this.$options.filters.filterTranslation("", "likes")
        : this.$options.filters.filterTranslation("", "like");
    },
    commentText() {
      return this.countDiscussion > 1
        ? this.$options.filters.filterTranslation("", "comments")
        : this.$options.filters.filterTranslation("", "comment");
    },
    shareText() {
      return this.countShared > 1
        ? this.$options.filters.filterTranslation("", "shares")
        : this.$options.filters.filterTranslation("", "share");
    },
    printLiked() {
      return `${this.countLiked}  ${this.likeText}`;
    },
    printNumberOfComments() {
      return `${this.countDiscussion}  ${this.commentText}`;
    },
    printCountShared() {
      return `${this.countShared}  ${this.shareText}`;
    }
  },
  methods: {
    ...mapActions({
      storeResort: "ModuleReviews/resort",
      storeUpdate: "ModuleReviews/update",
      storeResetMenuOrder: "ModuleReviews/resetMenuOrder"
    }),
    hideDropdownStatus() {
      this.isDropdownActive = false;
    },
    toggleDropdownStatus(status) {
      this.isDropdownActive = status;
    },
    handleBtnClick(item) {
      switch (item.type) {
        case "pinttotop":
          this.handlePintReviewToTop();
          break;
        case "like":
          this.handleLikeReview();
          break;
        case "socialSharing":
          this.handleSocialSharing();
          break;
      }
    },
    handleSocialSharing() {
      this.storeUpdate({
        ID: this.review.ID,
        value: {
          countShared: this.countShared + 1
        }
      });
    },
    handleLikeReview() {
      this.storeUpdate({
        ID: this.review.ID,
        value: {
          isLiked: this.isLiked ? "no" : "yes",
          countLiked: this.isLiked ? this.countLiked - 1 : this.countLiked + 1
        }
      });
      const data = this.createFormData({
        action: "wilcity_review_is_update_like",
        reviewID: this.review.ID
      });
      Vue.axios({
        url: WILOKE_GLOBAL.ajaxurl,
        method: "POST",
        data
      }).catch(err => alert(err));
    },
    handlePintReviewToTop() {
      const data = this.createFormData({
        action: "wilcity_pin_review_to_top",
        reviewID: this.review.ID,
        postID: this.review.parentID
      });

      // Updating menu order of this item
      const isPintToTop = this.isPintToTop;
      const menuOrder = isPintToTop ? 0 : 100;
      this.storeResetMenuOrder();
      this.storeUpdate({
        ID: this.review.ID,
        value: {
          menuOrder,
          isPintToTop: isPintToTop ? "no" : "yes"
        }
      });
      this.storeResort();
      this.isDropdownActive = false;

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data
      })
        .then(response => {
          if (response.data.success) {
            this.$emit("pinToTop", response.data.data);
          } else {
            alert(response.data.data.msg);
          }
        })
        .catch(err => alert(err));
    },
    handlFooterClick(item) {},
    footerItemWrapperClasses(item) {
      let classes = "";
      switch (item.type) {
        case "like":
          classes = "utility-meta_module__mfOnV";
          if (this.isLiked) {
            classes = `${classes} color-primary`;
          }
          break;
        case "leaveADiscussion":
          classes = "comment-review_btn__32CMP";
          break;
        case "socialSharing":
          classes = "utility-meta_module__mfOnV";
          break;
      }

      return classes;
    }
  }
};
</script>
