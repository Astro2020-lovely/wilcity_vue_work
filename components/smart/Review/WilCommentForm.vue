<template>
  <!-- content-box_module__333d9 -->
  <div class="content-box_module__333d9">
    <wil-heading :icon="headingIcon" :heading="heading" />
    <div class="content-box_body__3tSRB pos-r">
      <wil-alert v-if="msg.length" icon="la la-bullhorn" :msg="msg" :type="msgType"></wil-alert>
      <wil-block-loading :is-loading="isSubmitting" />
      <div v-if="!isSubmitted">
        <div class="row" v-if="!isUserLoggedIn">
          <div class="col-xs-6">
            <wil-input
              :label="'Name'|filterTranslation('name')"
              v-on="{change: handleFieldChange('name')}"
              :value="data.name"
              :is-required="true"
            />
          </div>
          <div class="col-xs-6">
            <wil-input
              :label="'Email'|filterTranslation('email')"
              v-on="{change: handleFieldChange('email')}"
              :value="data.email"
              :is-required="true"
              rules="email"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <wil-textarea
              :is-required="true"
              :label="contentLabel"
              :value="data.content"
              v-on="{change: handleFieldChange('content')}"
            />
          </div>
        </div>
        <wil-link
          @click="handleSubmitDiscussion"
          :wrapper-classes="parseBtnClasses"
          :btn-name="postCommentText"
        />
      </div>
    </div>
  </div>
  <!-- End / content-box_module__333d9 -->
</template>

<script>
export default {
  name: "wil-comment-form",
  data() {
    return {
      msg: "",
      msgType: "",
      isSubmitting: false,
      isSubmitted: false,
      data: {
        email: "",
        name: "",
        content: ""
      }
    };
  },
  props: {
    heading: {
      type: String,
      default: ""
    },
    headingIcon: {
      type: String,
      default: ""
    },
    postCommentText: {
      type: String,
      default: "Post Discussion"
    },
    contentLabel: {
      type: String,
      default: "Discussion"
    },
    postId: {
      type: Number,
      required: true
    },
    isUserLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    parseBtnClasses() {
      let classes =
        "wil-btn wil-btn--md wil-btn--gray wil-btn--block wil-btn--round";
      if (!this.data.content.length) {
        return `${classes} disabled`;
      }

      if (!this.isUserLoggedIn) {
        if (!this.data.content.email || !this.data.name.length) {
          return `${classes} disabled`;
        }
      }

      return classes;
    }
  },
  methods: {
    handleFieldChange(key) {
      return val => {
        this.data = {
          ...this.data,
          [key]: val
        };
      };
    },
    handleSubmitDiscussion() {
      this.isSubmitting = true;
      this.msg = "";

      const data = {
        ...this.data,
        parentID: this.postId,
        action: "wilcity_post_comment"
      };

      jQuery
        .ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data
        })
        .done(response => {
          this.isSubmitting = false;
          this.msg = response.data.msg;
          if (response.success) {
            this.$emit("submitted", response.data);

            this.data = {
              email: "",
              content: "",
              name: ""
            };
            this.msgType = "success";
            this.isSubmitted = true;
          } else {
            this.msgType = "error";
          }
        });
    }
  }
};
</script>
