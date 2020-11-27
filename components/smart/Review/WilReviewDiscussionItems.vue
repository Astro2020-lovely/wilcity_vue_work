<template>
  <div>
    <ul v-if="discussions.length" class="comment-review_commentlist__1LH_D list-none">
      <li v-for="item in discussions" :class="itemClasses(item)" :key="generateItemKey(item)">
        <wil-review-discussion-item
          :discussion="item"
          v-on="{update: handleUpdateDiscussion(item), delete: handleConfirmDeleteItem(item)}"
          :is-submitted="isSubmitted"
          :can-do-anything="canDoAnything"
          :is-user-logged-in="isUserLoggedIn"
        />
      </li>
    </ul>
    <wil-link
      v-if="!isLoaddedAll && maxPages > page"
      wrapper-classes="color-primary"
      style="display:block; font-size: 13px; opacity: 0.8; padding: 5px 20px;"
      @click="handleIncreasePage"
      :btn-name="loadmoreBtnName"
    />

    <div v-if="isDiscussionAllowed" class="comment-review_form__20wWm">
      <wil-review-author-info
        :author="myInfo"
        wrapper-classes="utility-box-1_module__MYXpX utility-box-1_xs__3Nipt d-inline-block mr-10 wil-float-left"
        :is-show-right="false"
      />
      <wil-review-discussion-form
        @update="handleAddNewDiscussion"
        inner-classes="field_module__1H6kT field_style4__2DBqx field-autoHeight-2"
        wrapper-classes="comment-review_comment__dJNqv"
        :has-cancel-btn="false"
        :is-submitted="isSubmitted"
        :is-user-logged-in="isUserLoggedIn"
        :is-focus="false"
      />
    </div>

    <portal to="wil-modal" v-if="isAskForDeleteDiscussion">
      <wil-confirmation-popup
        :id="`wil-confirm-delete-discussion-${deleteItem.ID}`"
        :is-loading="isDeleting"
        :title="''|filterTranslation('warning')"
        :body="''|filterTranslation('confirmDelete')"
        :msg="deleteMsg"
        :msg-type="deleteMsgType"
        @close="isAskForDeleteDiscussion=false"
        @confirmed="handleDeleteDiscussion"
      />
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "wil-review-discussion-items",
  data() {
    return {
      isDeleting: false,
      isSubmitting: false,
      isSubmitted: true,
      deleteMsg: "",
      deleteMsgType: "",
      isAskForDeleteDiscussion: false,
      isLoaddedAll: false,
      deleteItem: {},
      maxPages: 1,
      page: 1
    };
  },
  props: {
    uquid: {
      type: String,
      default: ""
    },
    parentId: {
      type: Number,
      required: true
    },
    postsPerPage: {
      type: Number,
      default: 5
    },
    parent: {
      type: Object,
      default: () => {}
    },
    isDiscussionAllowed: {
      type: Boolean,
      default: false
    },
    myInfo: {
      type: Object,
      default: () => {}
    },
    canDoAnything: {
      type: Boolean,
      default: false
    },
    isUserLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    discussions() {
      return this.$store.getters["ModuleReviews/getReviewDiscussions"](
        this.parentId
      );
    },
    loadmoreBtnName() {
      if (this.isSubmitting) {
        return this.$options.filters.filterTranslation(
          "Loading",
          "loadingText"
        );
      }
      return this.$options.filters.filterTranslation("", "viewMoreComments");
    }
  },
  components: {
    WilReviewAuthorInfo: () =>
      import(
        /*webpackChunkName: "WilReviewAuthorInfo" */
        /*webpackPreload: true */
        "./WilReviewAuthorInfo.vue"
      ),
    WilReviewDiscussionItem: () =>
      import(
        /*webpackChunkName: "WilReviewDiscussionItem" */
        /*webpackPreload: true */
        "./WilReviewDiscussionItem.vue"
      ),
    WilReviewDiscussionForm: () =>
      import(
        /*webpackChunkName: "WilReviewDiscussionForm" */
        /*webpackPreload: true */
        "./WilReviewDiscussionForm.vue"
      )
  },
  created() {
    // We should not fetch discussions If the review is showing on the both tabs and homepage
    if (!this.discussions.length) {
      this.fetchDiscussions();
    }
  },
  methods: {
    ...mapActions({
      storeUpdate: "ModuleReviews/updateDiscussion",
      storeAdd: "ModuleReviews/addDiscussions",
      storeDelete: "ModuleReviews/deleteDiscussion"
    }),
    generateItemKey(item) {
      return `wil-review-discussion-item-${this.uquid}-${item.ID}`;
    },
    reset() {
      this.deleteMsgType = "";
      this.deleteMsg = "";
      this.isDeleting = false;
      this.isAskForDeleteDiscussion = false;
    },
    handleIncreasePage() {
      this.page = this.page + 1;
      this.fetchDiscussions();
    },
    addDiscussionToStore(discussions) {
      if (!Array.isArray(discussions)) {
        this.storeAdd({
          parentID: this.parentId,
          value: [{ ...discussions }]
        });
      } else {
        this.storeAdd({
          parentID: this.parentId,
          value: [...discussions]
        });
      }
    },
    handleDeleteDiscussion() {
      this.isDeleting = true;

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: this.createFormData({
          postID: this.deleteItem.ID,
          action: "wilcity_delete_discussion"
        })
      })
        .then(response => {
          this.deleteMsg = response.data.data.msg;
          if (response.data.success) {
            this.deleteMsgType = "success";
            setTimeout(() => {
              this.reset();
              this.storeDelete({
                ID: this.deleteItem.ID,
                parentID: this.parentId
              });
            }, 3000);
          } else {
            this.deleteMsgType = "danger";
          }
        })
        .catch(err => {
          this.deleteMsg = err;
          this.deleteMsgType = "danger";
        });
    },
    handleAddNewDiscussion(content) {
      this.handleSubmitDiscussion({
        content
      });
    },
    handleConfirmDeleteItem(item) {
      return () => {
        this.deleteItem = item; // Make sure that Author wants to delete this item
        this.isAskForDeleteDiscussion = true;
      };
    },
    handleUpdateDiscussion(item) {
      return content => {
        if (!content.length) {
          return false;
        }
        this.handleSubmitDiscussion({
          content,
          postID: item.ID
        });
      };
    },
    handleSubmitDiscussion(data) {
      this.isSubmitting = true;
      this.isSubmitted = false;

      const formData = this.createFormData({
        ...data,
        parentID: this.parentId,
        action: "wilcity_submit_review_discussion"
      });

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData
      })
        .then(response => {
          if (!response.data.success) {
            alert(response.data.data.msg);
          } else {
            if (!data.postID) {
              this.addDiscussionToStore({
                ID: response.data.data.ID,
                content: data.content,
                author: { ...this.myInfo }
              });
            } else {
              this.storeUpdate({
                parentID: this.parentId,
                ID: data.postID,
                value: {
                  content: data.content
                }
              });
            }
            this.isSubmitted = true;
          }
        })
        .finally(() => (this.isSubmitting = false));
    },
    itemClasses(item) {
      return `comment-review_commentlistItem__2DILM js-review-discussion-${item.ID}`;
    },
    fetchDiscussions() {
      this.isSubmitting = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_fetch_discussions",
          parentID: this.parentId,
          page: this.page,
          postsPerPage: this.postsPerPage
        })
      })
        .then(response => {
          if (!response.data.success) {
            this.isLoaddedAll = true;
          } else {
            this.maxPages = response.data.data.maxPages;
            this.addDiscussionToStore(response.data.data.discussions);
          }
        })
        .finally(() => (this.isSubmitting = false));
    }
  }
};
</script>
