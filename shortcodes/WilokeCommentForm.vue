<template>
  <!-- content-box_module__333d9 -->
  <div class="content-box_module__333d9">
    <wiloke-header :icon="headingIcon" :heading="heading"></wiloke-header>
    <div class="content-box_body__3tSRB">
      <message v-show="errorMsg.length" icon="la la-bullhorn" :msg="errorMsg"></message>

      <div class="row">
        <div v-if="isUserLoggedIn == 'no'" class="col-xs-6">
          <div :class="nameWrapperClass">
            <div class="field_wrap__Gv92k">
              <input v-model="name" class="field_field__3U_Rt" type="text" @keyup="removeNameError" />
              <span class="field_label__2eCP7 text-ellipsis required">{{oTranslation.name}}</span>
              <span class="bg-color-primary"></span>
              <span
                v-show="isNameError"
                class="field_message__3Z6FX color-quaternary"
              >{{errorNameMsg}}</span>
            </div>
          </div>
        </div>
        <div v-if="isUserLoggedIn == 'no'" class="col-xs-6">
          <div :class="emailWrapperClass">
            <div class="field_wrap__Gv92k">
              <input
                v-model="email"
                class="field_field__3U_Rt"
                type="email"
                @keyup="removeEmailError"
              />
              <span class="field_label__2eCP7 text-ellipsis required">{{oTranslation.email}}</span>
              <span class="bg-color-primary"></span>
              <span
                v-show="isEmailError"
                class="field_message__3Z6FX color-quaternary"
              >{{errorEmailMsg}}</span>
            </div>
          </div>
        </div>
        <div class="col-xs-12">
          <div :class="commentWrapperClass">
            <div class="field_wrap__Gv92k">
              <textarea
                v-model="content"
                @keyup="removeCommentError"
                class="field_field__3U_Rt"
                :placeholder="label"
              ></textarea>
              <span class="field_label__2eCP7 text-ellipsis"></span>
              <span class="bg-color-primary"></span>
            </div>
            <span
              v-show="isCommentError"
              class="field_message__3Z6FX color-quaternary"
            >{{errorCommentMsg}}</span>
          </div>
        </div>
      </div>
      <a
        @click.prevent="submitContent"
        class="wil-btn wil-btn--md wil-btn--gray wil-btn--block wil-btn--round"
        href="#"
      >{{postCommentText}}</a>
    </div>
  </div>
  <!-- End / content-box_module__333d9 -->
</template>

<script>
import Message from "./../shortcodes/WilokeMessage.vue";
import WilokeHeader from "./WilokeSingleHeader.vue";

export default {
  data() {
    return {
      errorMsg: "",
      errorNameMsg: "",
      errorEmailMsg: "",
      errorCommentMsg: "",
      content: "",
      name: "",
      email: "",
      xhr: null,
      oTranslation: WILCITY_I18,
      isCommentError: false,
      isNameError: false,
      isEmailError: false
    };
  },
  components: {
    WilokeHeader,
    Message
  },
  props: [
    "heading",
    "headingIcon",
    "postCommentText",
    "postId",
    "label",
    "isUserLoggedIn"
  ],
  methods: {
    validateEmail() {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
    },
    removeCommentError() {
      this.isCommentError = false;
    },
    removeEmailError() {
      if (this.validateEmail(this.email)) {
        this.isEmailError = false;
      }
    },
    removeNameError() {
      this.isNameError = false;
    },
    setErrorMsg(oError) {
      switch (oError.type) {
        case "email":
          this.isEmailError = true;
          this.errorEmailMsg = oError.msg;
          break;
        case "name":
          this.isNameError = true;
          this.errorNameMsg = oError.msg;
          break;
        case "comment":
          this.isCommentError = true;
          this.errorCommentMsg = oError.msg;
          break;
        default:
          this.errorMsg = oError.msg;
          break;
      }
    },
    resetError() {
      this.isEmailError = false;
      this.isNameError = false;
      this.isCommentError = false;
      this.errorMsg = false;
    },
    submitContent() {
      let $body = jQuery("body");

      if (this.isUserLoggedIn == "no") {
        if (!this.name.length) {
          this.isNameError = true;
        }

        if (this.validateEmail()) {
          this.isEmailError = true;
        }
      }

      if (this.content.length === 0) {
        this.isCommentError = true;
        return false;
      }

      if (this.xhr !== null && this.xhr.status !== 200) {
        return false;
      }

      $body.trigger("topLoading");

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          name: this.name,
          email: this.email,
          action: "wilcity_post_comment",
          content: this.content,
          postID: this.postId
        },
        success: response => {
          $body.trigger("topHideLoading");
          if (response.success) {
            jQuery("#wilcity-render-comments").prepend(response.data.html);
            this.content = "";
            this.resetError();
          } else {
            this.setErrorMsg(response.data);
          }
        }
      });
    }
  },
  computed: {
    emailWrapperClass() {
      return {
        "field_module__1H6kT field_style2__2Znhe mb-15": 1 == 1,
        active: this.email.length,
        error: this.isEmailError
      };
    },
    nameWrapperClass() {
      return {
        "field_module__1H6kT field_style2__2Znhe mb-15": 1 == 1,
        active: this.name.length,
        error: this.isNameError
      };
    },
    commentWrapperClass() {
      return {
        "field_module__1H6kT field_style2__2Znhe mb-15": 1 == 1,
        error: this.isCommentError
      };
    }
  },
  mounted() {}
};
</script>
