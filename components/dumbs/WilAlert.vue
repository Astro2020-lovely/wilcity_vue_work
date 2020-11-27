<template>
  <div
    :class="[parseWrapperClasses, 'alert_module__Q4QZx']"
    :style="{ 'padding-left': paddingLeft }"
  >
    <div v-if="icon" class="alert_icon__1bDKL">
      <i :class="icon"></i>
    </div>
    <div class="alert_content__1ntU3" v-html="msg"></div>
    <slot name="after-msg"></slot>
    <a
      v-if="hasRemove"
      @click.prevent="handleRemove"
      class="alert_close__3PtGd"
      href="#"
      :title="removeBtnName"
    >
      <i class="la la-times"></i>
    </a>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-alert",
  methods: {
    handleRemove() {
      this.$emit("remove");
    }
  },
  computed: {
    parseWrapperClasses() {
      let typeClass = "";
      switch (this.type) {
        case "success":
          typeClass = "alert_success__1nkos";
          break;
        case "danger":
          typeClass = "alert_danger__2ajVf";
          break;
        case "warning":
          typeClass = "alert_warning__2IUiO";
          break;
        case "dark":
          typeClass = "alert_dark__3ks-i";
          break;
        case "info":
          typeClass = "alert_info__2dwkg";
          break;
      }
      return `${this.wrapperClasses} ${typeClass} ${this.alignment}`;
    },
    parseDefaultRemoveBtn() {
      return this.removeBtnName.length
        ? this.removeBtnName
        : this.$options.filters.filterTranslation("", "remove");
    },
    paddingLeft() {
      return this.icon ? "60px" : "15px";
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "",
      required: false
    },
    icon: {
      type: String,
      default: "",
      required: false
    },
    msg: {
      type: String,
      default: "",
      required: true
    },
    hasRemove: {
      type: Boolean,
      default: false
    },
    removeBtnName: {
      type: String,
      default: ""
    },
    type: {
      type: String, // danger, success, warning, info, dark
      default: ""
    },
    alignment: {
      type: String,
      default: ""
    }
  }
};
</script>
