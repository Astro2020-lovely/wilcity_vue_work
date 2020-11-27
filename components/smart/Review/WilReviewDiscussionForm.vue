<template>
  <div :class="wrapperClasses">
    <!-- field_module__1H6kT -->
    <div :class="parseInnerClasses">
      <div class="field_wrap__Gv92k">
        <textarea
          class="field_field__3U_Rt"
          data-height-default="22"
          v-model="content"
          v-wil-focus="isFocus"
          @focus="handleFocusOnForm"
          @keypress="maybeSubmit"
        ></textarea>
        <span class="field_label__2eCP7 text-ellipsis">{{''|filterTranslation('typeAMessage')}}</span>
        <span class="bg-color-primary"></span>
        <div :class="parseBtnClasses">
          <span @click="handleSubmit" class="field_iconButton__2p3sr bg-color-primary">
            <i :class="btnIcon"></i>
          </span>
        </div>
        <div v-if="hasCancelBtn" class="mt-10 pos-a review-cancel">
          <a href="#" @click.prevent="handleCancel" :title="'Cancel'|filterTranslation('cancel')">
            <i class="la la-times-circle"></i>
          </a>
        </div>
      </div>
    </div>
    <!-- End / field_module__1H6kT -->
  </div>
</template>
<script>
export default {
  name: "wil-review-discussion-form",
  data() {
    return {
      content: "",
      btnIcon: "la la-arrow-up"
    };
  },
  created() {
    this.content = this.value;
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "comment-review_comment__dJNqv mt-10"
    },
    innerClasses: {
      type: String,
      default: "field_rightButton__1GGWz js-field-rightButton"
    },
    hasCancelBtn: {
      type: Boolean,
      default: true
    },
    isSubmitted: {
      type: Boolean,
      default: false
    },
    isFocus: {
      type: Boolean,
      default: true
    },
    isUserLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isSubmitted(status) {
      if (status) {
        this.content = "";
        this.btnIcon = "la la-arrow-up";
      } else {
        this.btnIcon = "fa fa-spinner fa-spin";
      }
    }
  },
  computed: {
    parseInnerClasses() {
      if (this.content.length) {
        return `active ${this.innerClasses}`;
      }

      return this.innerClasses;
    },
    parseBtnClasses() {
      let btnClasses = "field_rightButton__1GGWz js-field-rightButton";
      return this.content.length ? `${btnClasses} active` : btnClasses;
    }
  },
  methods: {
    maybeSubmit(event) {
      if (event.code === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.handleSubmit();
      }
    },
    handleSubmit() {
      if (!this.content.length || this.content === this.value) {
        return false;
      }

      this.$emit("update", this.content);
    },
    handleCancel() {
      this.$emit("close");
    },
    handleFocusOnForm() {
      if (!this.isUserLoggedIn) {
        jQuery("body").trigger("onOpenLoginRegisterPopup", "login-form");
      }
    }
  }
};
</script>
