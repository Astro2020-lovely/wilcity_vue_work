<template>
  <div :class="wrapperClasses">
    <!-- utility-box-1_module__MYXpX -->
    <div
      class="utility-box-1_module__MYXpX utility-box-1_xs__3Nipt d-inline-block mr-10 wil-float-left"
    >
      <wil-review-author-info :is-show-right="false" :author="user.author" />
    </div>
    <wil-review-discussion-form @update="handleUpdateDiscussion" />
  </div>
</template>
<script>
export default {
  name: "wil-review-submit-discussion",
  components: {
    WilReviewDiscussionForm: () =>
      import(
        /*webpackChunkName: "WilReviewDiscussionForm" */
        /*webpackPreload: true */
        "./WilReviewDiscussionForm.vue"
      ),
    WilReviewAuthorInfo: () =>
      import(
        /*webpackChunkName: "WilReviewAuthorInfo" */
        /*webpackPreload: true */
        "./WilReviewAuthorInfo.vue"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "comment-review_form__20wWm"
    },
    user: {
      type: Object,
      required: true
    }
  }
};
</script>
