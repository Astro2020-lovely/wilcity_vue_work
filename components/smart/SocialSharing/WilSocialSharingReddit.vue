<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    target="_blank"
    :href="parseHandleSharing"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-reddit"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseHandleSharing"
    @click="handleClick"
    target="_blank"
    style="background-color: #ff4500"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-reddit",
  props: {
    btnName: {
      type: String,
      default: "Reddit"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "reddit");
    }
  },
  computed: {
    parseHandleSharing() {
      let url = `//reddit.com/submit?url=${encodeURI(this.href)}`;
      if (this.title.length) {
        url = `${url}&title=${encodeURI(this.title)}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  }
};
</script>
