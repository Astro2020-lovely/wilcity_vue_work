<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    target="_blank"
    :href="parseSandleSharing"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-tumblr"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseSandleSharing"
    target="_blank"
    @click="handleClick"
    style="background-color: #35465c"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-tumblr",
  props: {
    btnName: {
      type: String,
      default: "Tumblr"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "tumblr");
    }
  },
  computed: {
    parseHandleSharing() {
      let url = `//www.tumblr.com/share/link?url=${encodeURI(this.href)}`;
      if (this.title.length) {
        url = `${url}&name=${encodeURI(this.title)}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  }
};
</script>
