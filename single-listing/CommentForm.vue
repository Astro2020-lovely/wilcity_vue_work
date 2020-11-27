<template>
  <div class="comment-review_form__20wWm">
    <div
      class="utility-box-1_module__MYXpX utility-box-1_xs__3Nipt d-inline-block mr-10 wil-float-left"
    >
      <div
        class="utility-box-1_avatar__DB9c_ rounded-circle"
        :style="'background-image: url('+oGlobal.user.avatar+');'"
      >
        <img :src="oGlobal.user.avatar" :alt="oGlobal.user.displayName" />
      </div>
    </div>
    <div class="comment-review_comment__dJNqv">
      <!-- field_module__1H6kT -->
      <div class="field_module__1H6kT field_style4__2DBqx field-autoHeight js-field">
        <div class="field_wrap__Gv92k">
          <textarea
            v-model="discussion"
            class="field_field__3U_Rt wilcity-write-new-discussion-field"
            data-height-default="22"
            @keydown.enter="submitDiscussion"
            :placeholder="oTranslation.message"
          ></textarea>
          <span class="field_label__2eCP7 text-ellipsis">{{oTranslation.typeAMessage}}</span>
          <span class="bg-color-primary"></span>
          <div class="field_rightButton__1GGWz js-field-rightButton" :class="submitDiscussionClass">
            <span
              class="field_iconButton__2p3sr bg-color-primary"
              @click.prevent="submitDiscussion"
            >
              <i class="la la-arrow-up"></i>
            </span>
          </div>
        </div>
      </div>
      <!-- End / field_module__1H6kT -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      discussion: "",
      oTranslation: WILCITY_I18,
      oGlobal: WILOKE_GLOBAL,
      discussionWrapper: null
    };
  },
  computed: {
    submitDiscussionClass() {
      return {
        active: this.discussion.length != "",
        "field_rightButton__1GGWz js-field-rightButton": 1 == 1
      };
    }
  },
  props: ["parentId"],
  mounted() {
    this.startWriteDiscussion();
  },
  methods: {
    startWriteDiscussion() {
      jQuery("body").on("startWriteReview", () => {
        jQuery(this.$el)
          .find(".wilcity-write-new-discussion-field")
          .focus();
      });
    },
    getDiscussionWrapper($target) {
      if (this.discussionWrapper === null) {
        this.discussionWrapper = $target
          .closest("footer.comment-review_footer__3XR0_")
          .find(".comment-review_commentlist__1LH_D");
      }
    },
    submitDiscussion(event) {
      if (event.shiftKey) {
        return true;
      }
      event.preventDefault();
      if (WilCityHelpers.isNull(this.discussion)) {
        return false;
      }

      this.getDiscussionWrapper(jQuery(event.currentTarget));

      let fakeID = "discussion-" + new Date().getTime(),
        oNewDiscussion = {
          content: this.discussion,
          display_name: this.oGlobal.user.display_name,
          avatar: this.oGlobal.user.avatar,
          ID: fakeID,
          fakeID: fakeID,
          parentID: this.parentId,
          postID: WILOKE_INLINE_GLOBAL.postID,
          action: "wilcity_review_discussion"
        };
      this.discussion = "";
      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: oNewDiscussion,
        success: response => {
          this.discussionWrapper.append(response.data.html);
          jQuery(
            ".wilcity-discussion-toggle-toolbar-" + response.data.id
          ).wilToggle();
          jQuery(
            ".wilcity-delete-discussion-" + response.data.id
          ).deleteDiscussion();
        }
      });
    }
  }
};
</script>
