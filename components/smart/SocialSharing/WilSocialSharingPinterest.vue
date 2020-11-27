<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    target="_blank"
    :href="parseHandleSharing"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-pinterest"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    target="_blank"
    :href="parseHandleSharing"
    @click="handleClick"
    style="background-color: #bd081c"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-pinterest",
  props: {
    btnName: {
      type: String,
      default: "Pinterest"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "pinterest");
    }
  },
  computed: {
    parseHandleSharing() {
      let url = `//pinterest.com/pin/create/button/?url=${encodeURI(
        this.href
      )}`;
      if (this.title.length) {
        url = `${url}&description=${encodeURI(this.title)}`;
      }

      if (this.picture.length) {
        url = `${url}&media=${encodeURI(this.picture)}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  }
};
</script>
