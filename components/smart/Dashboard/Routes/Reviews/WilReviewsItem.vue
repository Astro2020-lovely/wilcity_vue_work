<template>
  <tr>
    <td class="before-hide" :data-th="'Review Title'|filterTranslation('reviewTitle')">
      <wil-td-item :item="item" target="_blank">
        <template v-slot:after-title="{item}">
          <span>{{'Author'|filterTranslation('author')}}: {{item.author}}</span>
          <span>{{'Average rating'|filterTranslation('averageRating')}}: {{item.average}}</span>
          <span>{{'Quality'|filterTranslation('quality')}}: {{item.quality}}</span>
        </template>
      </wil-td-item>
    </td>
    <td :data-th="'Details'|filterTranslation('details')">
      <ul v-if="item.oDetails" style="padding-left: 0">
        <li
          v-for="(reviewDetail) in item.oDetails"
          :key="`review-item-score-${reviewDetail.key}-${reviewDetail.score}`"
        >{{reviewDetail.name}} {{reviewDetail.score}}</li>
      </ul>
    </td>
    <td :data-th="'Content'|filterTranslation('content')">
      <p v-html="item.content"></p>
      <wil-link
        wrapper-classes="color-primary"
        @click="toggleReplyReview"
        :btn-name="''|filterTranslation('reply')"
      />
      <wil-alert
        v-if="isSubmittedReply"
        :msg="''|filterTranslation('discussionAddedSuccessfully')"
        type="success"
        style="margin-top: 20px; margin-bottom: 20px"
      />
      <div v-if="openReply">
        <wil-textarea
          :value="reply"
          @change="updateReplyContent"
          :label="''|filterTranslation('reply')"
        />
        <wil-link
          wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--primary wil-change-plan wil-btn--round mt-10"
          style="margin-left:0"
          @click="submitReply"
          :is-loading="isSubmitting"
          :btn-name="''|filterTranslation('submit')"
        />
      </div>
    </td>
    <td :data-th="'Review on'|filterTranslation('reviewOn')">
      <a :href="item.parentPermalink" target="_blank" v-html="item.parentTitle"></a>
    </td>
    <td class="before-hide wil-text-right" :data-th="'More'|filterTranslation('more')">
      <wil-link
        v-if="itemStatus === 'publish'"
        wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--primary wil-change-plan wil-btn--round"
        @click="hideReview(item)"
        :is-loading="isLoading"
        :btn-name="''|filterTranslation('hide')"
      />
      <wil-link
        v-else
        wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--secondary wil-change-plan wil-btn--round"
        @click="publishReview(item)"
        :is-loading="isLoading"
        :btn-name="'Publish'|filterTranslation('publish')"
      />
    </td>
  </tr>
</template>

<script>
import WilTdItem from "./../../../../dumbs/table/WilTdItem.vue";
export default {
  name: "wil-reviews-item",
  data() {
    return {
      openReply: false,
      isSubmitting: false,
      isLoading: false,
      itemStatus: "",
      reply: "",
      isSubmittedReply: false
    };
  },
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.itemStatus = this.item.postStatus;
  },
  components: {
    WilTdItem
  },
  methods: {
    toggleReplyReview() {
      this.isSubmittedReply = false;
      this.openReply = !this.openReply;
    },
    handlReviewAction(data) {
      const formData = this.createFormData(data);
      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData
      })
        .then(response => {
          if (!response.data.success) {
            alert(response.data.data.msg);
          } else {
            this.itemStatus = response.data.data.postStatus;
            this.openReply = false;
            if (data.action === "wilcity_review_discussion") {
              this.isSubmittedReply = true;
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isSubmitting = false;
        });
    },
    hideReview() {
      this.isLoading = true;
      this.handlReviewAction({
        postID: this.item.postID,
        action: "wil_hide_review"
      });
    },
    publishReview() {
      this.isLoading = true;
      this.handlReviewAction({
        postID: this.item.postID,
        action: "wil_publish_review"
      });
    },
    submitReply() {
      this.isSubmitting = true;
      this.isSubmittedReply = false;
      this.handlReviewAction({
        parentID: this.item.postID,
        action: "wilcity_review_discussion",
        content: this.reply
      });
    },
    updateReplyContent(val) {
      this.reply = val;
    }
  }
};
</script>
